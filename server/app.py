
from flask import Flask, jsonify, request, redirect, url_for, session, make_response
from flask_restful import Resource
from werkzeug.exceptions import NotFound
from werkzeug.security import check_password_hash
from authlib.integrations.flask_client import OAuth
from flask_login import LoginManager, login_user, logout_user, UserMixin, login_required
from config import app, db, api, bcrypt

# Import your model files
from food_user import FoodUser
from restaurant import Restaurant
from menu import Menu
from dish import Dish
from menu_dish import MenuDish
from review import Review
from favorite import Favorite
import requests, json 


# Initialize OAuth and Flask-Login
oauth = OAuth(app)
login_manager = LoginManager(app)

app.secret_key = 'AfLm8OuKhH416azwazV_KA'  # Change this to a random secret key

# OAuth Configuration for Google
google = oauth.register(
    name='google',
    client_id='9656575814-i0rc5aehtlvhkv8fu23gnmgrtnspf5ps.apps.googleusercontent.com',
    # client_secret='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',
    access_token_url='https://accounts.google.com/o/oauth2/token',
    authorize_url='https://accounts.google.com/o/oauth2/auth',
    api_base_url='https://www.googleapis.com/oauth2/v1/',
    client_kwargs={'scope': 'openid email profile'},
)

# User loader for Flask-Login
@login_manager.user_loader
def load_user(food_user_id):
    return FoodUser.query.get(int(food_user_id))

class FoodUsers(Resource):
    def get(self):
        try:
            food_users = [food_user.to_dict() for food_user in FoodUser.query]
            return food_users, 200
        except Exception as e:
            return {'message': str(e)}, 400

    def post(self):
        try:
            data = request.get_json()
            new_food_user = FoodUser(username = data['username'], email = data['email'])
            new_food_user.password_hash = data.get('password')
            db.session.add(new_food_user)
            db.session.commit()
            session["food_user_id"]=new_food_user.id
            return new_food_user.to_dict(), 201
        except Exception as e:
            db.session.rollback()
            return {'message': str(e)}, 400

api.add_resource(FoodUsers, "/food_users")

class FoodUsersById(Resource):
    def get(self, id):
        food_user = FoodUser.query.get_or_404(id, description=f"FoodUser {id} not found")
        return food_user.to_dict(rules=("restaurants",)), 200

    def patch(self, id):
        food_user = FoodUser.query.get_or_404(id, description=f"FoodUser {id} not found")
        try:
            data = request.get_json()
            # Update the user's attributes
            if 'username' in data:
                food_user.username = data['username']
            if 'email' in data:
                food_user.email = data['email'] 
            # Add other fields as necessary

            db.session.commit()
            return {'message': 'User updated successfully'}, 200
        except Exception as e:
            db.session.rollback()
            return {'message': str(e)}, 400

    def delete(self, id):
        food_user = FoodUser.query.get_or_404(id, description=f"FoodUser {id} not found")
        try:
            db.session.delete(food_user)
            db.session.commit()
            return {}, 204
        except Exception as e:
            db.session.rollback()
            return {'message': str(e)}, 400

api.add_resource(FoodUsersById, "/food_users/<int:id>")

class Restaurants(Resource):
    def get(self):
        try:
            restaurants = [restaurant.to_dict(only=("id", "name", "rating", "image_url", "phone_number")) for restaurant in Restaurant.query]
            return restaurants, 200
        except Exception as e:
            return {'message': str(e)}, 400

    def post(self):
        try:
            data = request.get_json()
            new_restaurant = Restaurant(
                name=data['name'],
                rating=data['rating'],
                image_url=data['image_url'],
                phone_number=data['phone_number'],
                address=data['address']
            )
            db.session.add(new_restaurant)
            db.session.commit()
            return new_restaurant.to_dict(), 201
        except Exception as e:
            db.session.rollback()
            return {'message': str(e)}, 400

api.add_resource(Restaurants, "/restaurants")

class RestaurantsById(Resource):
    def get(self, id):
        restaurant = Restaurant.query.get_or_404(id, description=f"Restaurant {id} not found")
        restaurant = restaurant.to_dict(only=(
            "id", "name", "rating", "phone_number", "image_url", 
            "reviews.content", "reviews.rating", "reviews.review_date", "reviews.food_user_id",
            "favorites.food_user.username"
        ))
        restaurant['favorited_by'] = [fav['food_user']['username'] for fav in restaurant['favorites']]
        del restaurant['favorites']
        return restaurant, 200

api.add_resource(RestaurantsById, "/restaurants/<int:id>")

class Menus(Resource):
    def get(self):
        try:
            menus = [menu.to_dict() for menu in Menu.query.all()]
            return menus, 200
        except Exception as e:
            return {'message': str(e)}, 400

    def post(self):
        try:
            data = request.get_json()
            new_menu = Menu(name=data['name'], restaurant_id=data['restaurant_id'])
            db.session.add(new_menu)
            db.session.commit()
            return new_menu.to_dict(), 201
        except Exception as e:
            db.session.rollback()
            return {'message': str(e)}, 400

api.add_resource(Menus, "/menus")


class Favorites(Resource):
    def post(self):
        # Check if a user is logged in
        if 'food_user_id' not in session:
            return {'error': 'FoodUser not logged in'}, 401

        # Parse the incoming data to get the restaurant_id
        parser = reqparse.RequestParser()
        parser.add_argument('restaurant_id', required=True, help="restaurant_id cannot be blank")
        args = parser.parse_args()

        user_id = session['food_user_id']
        restaurant_id = args['restaurant_id']

        # Check if the user has already favorited this restaurant
        favorite = Favorite.query.filter_by(food_user_id=user_id, restaurant_id=restaurant_id).first()
        if favorite:
            return {'message': 'You already have this restaurant favorited!'}, 400

        # If not already favorited, create a new favorite record
        try:
            new_fav = Favorite(food_user_id=user_id, restaurant_id=restaurant_id)
            db.session.add(new_fav)
            db.session.commit()
            return new_fav.to_dict(), 201
        except Exception as e:
            db.session.rollback()
            return {'message': str(e)}, 400

class FavoritesById(Resource):
    def delete(self, id):
        try:
            user_id = session['food_user_id']
            favorite = Favorites.query.filter_by(food_user_id=user_id, restaurant_id=id).first()

            if favorite:
                db.session.delete(favorite)
                db.session.commit()
                return {}, 201
            else:
                return {'message': f'FoodUser {id} does not have restaurant {id}'}, 400

        except Exception as e:
            db.session.rollback()
            return {'message': str(e)}, 400
        
api.add_resource(FavoritesById, "/favorites/<int:id>")

class Dishes(Resource):
    def get(self):
        try:
            dishes = [dish.to_dict() for dish in Dish.query.all()]
            return dishes, 200
        except Exception as e:
            return {'message': str(e)}, 400

    def post(self):
        try:
            data = request.get_json()
            new_dish = Dish(name=data['name'], description=data['description'], price=data['price'])
            db.session.add(new_dish)
            db.session.commit()
            return new_dish.to_dict(), 201
        except Exception as e:
            db.session.rollback()
            return {'message': str(e)}, 400

api.add_resource(Dishes, "/dishes")

class Login(Resource): 
    def post(self): 
        try:
            data = request.get_json()
            user = FoodUser.query.filter(
                (FoodUser.username == data.get('username'))  
            ).first()

            if user and user.authenticate(data.get('password')):
                session['food_user_id'] = user.id
                return user.to_dict(), 200
            else:
                return {'message': 'Invalid Credentials'}, 403
        except Exception as e:
            return {'message': str(e)}, 400

api.add_resource(Login, '/login')

class Logout(Resource):
    def delete(self):  
        session.pop('food_user_id', None)
        return {}, 204 

api.add_resource(Logout, '/logout')

class CheckSession(Resource): 
    def get(self):  
        if "food_user_id" not in session:
            return {"message": "Not Authorized"}, 403
        if food_user := db.session.get(FoodUser, session["food_user_id"]):
            return food_user.to_dict(rules=("-email",)), 200
        return {"message": "Not Authorized"}, 403

api.add_resource(CheckSession, '/check_session') 

# Google OAuth routes
@app.route('/login/google', methods=["POST"])
def google_login():
    data = json.loads(request.data)
    req = requests.get(
        f"https://www.googleapis.com/oauth2/v1/userinfo?access_token={data['access_token']}",
        headers={"Content-Type": "text"})
    # redirect_uri = url_for('authorize', _external=True
    res=req.json()
    if res["verified_email"]:
        food_user = FoodUser.query.filter_by(email=res["email"]).first()
        if not food_user:
            food_user = FoodUser(username = res['name'], email = res['email'])
            food_user.password_hash = "password"
            db.session.add(food_user)
            db.session.commit()
        food_user=food_user.to_dict()
        return make_response(food_user, 200)
    return make_response({"message":"this doesnt work"}, 200)

@app.route('/authorize')
def authorize():
    token = google.authorize_access_token()
    resp = google.get('fooduserinfo')
    food_user_info = resp.json()
    food_user = FoodUser.query.filter_by(email=food_user_info['email']).first()

    if not food_user:
        food_user = FoodUser(email=food_user_info['email'], google_id=food_user_info['sub'])
        db.session.add(food_user)
        db.session.commit()

    access_token = create_access_token(identity=food_user.id)
    return jsonify(access_token=access_token), 200

@app.route('/current_user')
def current_user():
    food_user_id = session.get('food_user_id')
    if food_user_id:
        food_user = FoodUser.query.get(food_user_id)
        return jsonify(food_user.to_dict()), 200
    return jsonify(None), 401



# @app.route('/users', methods=['POST'])
# def login():
#     data = request.get_json()
#     email = data.get('email', None)
#     password = data.get('password', None)

    if not email or not password:
        return jsonify({"msg": "Email and password are required"}), 400

    user = User.query.filter_by(email=email).first()
    if user and check_password_hash(user.password_hash, password):
        # Identity can be any data that is json serializable
        access_token = create_access_token(identity=user.id)
        return jsonify(access_token=access_token), 200
    else:
        return jsonify({"msg": "Bad username or password"}), 401

# Error handler
@app.errorhandler(NotFound)
def handle_404(error):
    return {'message': error.description}, 404


if __name__ == '__main__':
    app.run(port=5000, debug=True)