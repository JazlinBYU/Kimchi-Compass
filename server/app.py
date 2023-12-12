#!/usr/bin/env python3

from flask import request, session, Flask, jsonify, url_for, redirect
from flask_restful import Api, Resource
from werkzeug.exceptions import NotFound
from authlib.integrations.flask_client import OAuth
from flask_login import LoginManager, login_user, logout_user, current_user
from config import app, db

# Import your model files
from user import User
from restaurant import Restaurant
from menu import Menu
from dish import Dish
from menu_dish import MenuDish
from review import Review
from favorite import Favorite

# Initialize OAuth and Flask-Login
oauth = OAuth(app)
login_manager = LoginManager()
login_manager.init_app(app)

# OAuth Configuration for Google
google = oauth.register(
    name='google',
    client_id='9656575814-i0rc5aehtlvhkv8fu23gnmgrtnspf5ps.apps.googleusercontent.com',
    client_secret='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',
    access_token_url='https://accounts.google.com/o/oauth2/token',
    authorize_url='https://accounts.google.com/o/oauth2/auth',
    api_base_url='https://www.googleapis.com/oauth2/v1/',
    client_kwargs={'scope': 'openid email profile'},
)

api = Api(app)

@app.route('/')
def index():
    return '<h1>Project Server</h1>'

def handle_exception(e):
    response = e.get_response()
    response.data = jsonify({"message": e.description})
    response.content_type = "application/json"
    return response

@app.errorhandler(NotFound)
def handle_404(error):
    response = {"message": error.description}
    return response, error.code

# Google OAuth routes
@app.route('/login/google')
def google_login():
    redirect_uri = url_for('authorize', _external=True)
    return google.authorize_redirect(redirect_uri)

@app.route('/authorize')
def authorize():
    token = google.authorize_access_token()
    resp = google.get('userinfo')
    user_info = resp.json()
    user = User.query.filter_by(email=user_info['email']).first()

    if not user:
        user = User(email=user_info['email'], google_id=user_info['sub'])
        db.session.add(user)
        db.session.commit()

    login_user(user)
    return redirect('/')

@app.route('/logout')
def logout():
    logout_user()
    return redirect('/')

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


# Define your resource classes

class UserResource(Resource):
    def get(self, id):
        user = User.query.get_or_404(id)
        return jsonify(user.to_dict())

    def put(self, id):
        user = User.query.get_or_404(id)
        data = request.get_json()
        user.username = data.get('username', user.username)
        user.email = data.get('email', user.email)
        # Handle password update if needed
        db.session.commit()
        return jsonify(user.to_dict())

    def delete(self, id):
        user = User.query.get_or_404(id)
        db.session.delete(user)
        db.session.commit()
        return '', 204

class UserList(Resource):
    def get(self):
        users = User.query.all()
        return jsonify([user.to_dict() for user in users])

    def post(self):
        data = request.get_json()
        new_user = User(username=data['username'], email=data['email'])
        new_user.password_hash = data.get('password')
        db.session.add(new_user)
        db.session.commit()
        return jsonify(new_user.to_dict()), 201

api.add_resource(UserResource, '/users/<int:id>')
api.add_resource(UserList, '/users')

class RestaurantResource(Resource):
    def get(self):
        restaurants = Restaurant.query.all()
        return jsonify([restaurant.to_dict() for restaurant in restaurants])

    def post(self):
        data = request.get_json()
        new_restaurant = Restaurant(name=data['name'])
        db.session.add(new_restaurant)
        db.session.commit()
        return jsonify(new_restaurant.to_dict()), 201

api.add_resource(RestaurantResource, '/restaurants')

class Users(Resource):
    def get(self):
        users = [user.to_dict() for user in User.query.all()]
        return users, 200
    
    def post(self):
        try:
            data = request.get_json()
            new_user = User(
                username=data.get('username'),
                email=data.get('email')
            )
            new_user.password_hash = data.get('password')
            db.session.add(new_user)
            db.session.commit()
            return new_user.to_dict(), 201
        except Exception as e:
            db.session.rollback()
            return {'message': str(e)}, 400

    def put(self, id):
        try:
            data = request.get_json()
            user = User.query.get_or_404(id, description=f"User {id} not found")

            # Update user information
            user.username = data.get('username', user.username)
            user.email = data.get('email', user.email)
            user.password_hash = data.get('password', user.password_hash)

            db.session.commit()
            return user.to_dict(), 200
        except Exception as e:
            db.session.rollback()
            return {'message': str(e)}, 400

    def delete(self, id):
        try:
            user = User.query.get_or_404(id, description=f"User {id} not found")

            # Delete the user
            db.session.delete(user)
            db.session.commit()
            
            return {}, 204
        except Exception as e:
            db.session.rollback()
            return {'message': str(e)}, 400

    def post(self, id):
        try:
            data = request.get_json()
            user = User.query.get_or_404(id, description=f"User {id} not found")

            # Create a new review for the user
            new_review = Review(
                content=data.get('content'),
                user_id=id,
                restaurant_id=data.get('restaurant_id') # Adjust based on your data model
            )

            db.session.add(new_review)
            db.session.commit()
            return new_review.to_dict(), 201
        except Exception as e:
            db.session.rollback()
            return {'message': str(e)}, 400

api.add_resource(Users, "/users", "/users/<int:id>")

class Restaurants(Resource):
    def get(self):
        restaurants = [restaurant.to_dict() for restaurant in Restaurant.query.all()]
        return restaurants, 200
    
    def post(self):
        try:
            data = request.get_json()
            new_restaurant = Restaurant(
                name=data.get('name')
            )
            db.session.add(new_restaurant)
            db.session.commit()
            return new_restaurant.to_dict(), 201
        except Exception as e:
            db.session.rollback()
            return {'message': str(e)}, 400

api.add_resource(Restaurants, "/restaurants")

# Define similar resources for Menu, Dish, MenuDish, and Review

class Menus(Resource):
    def get(self):
        menus = [menu.to_dict() for menu in Menu.query.all()]
        return menus, 200
    
    def post(self):
        try:
            data = request.get_json()
            new_menu = Menu(
                name=data.get('name'),
                restaurant_id=data.get('restaurant_id') # Make sure to adjust based on your data model
            )
            db.session.add(new_menu)
            db.session.commit()
            return new_menu.to_dict(), 201
        except Exception as e:
            db.session.rollback()
            return {'message': str(e)}, 400

api.add_resource(Menus, "/menus")

class Dishes(Resource):
    def get(self):
        dishes = [dish.to_dict() for dish in Dish.query.all()]
        return dishes, 200
    
    def post(self):
        try:
            data = request.get_json()
            new_dish = Dish(
                name=data.get('name'),
                description=data.get('description'),
                price=data.get('price')
            )
            db.session.add(new_dish)
            db.session.commit()
            return new_dish.to_dict(), 201
        except Exception as e:
            db.session.rollback()
            return {'message': str(e)}, 400

api.add_resource(Dishes, "/dishes")

# Define similar resources for MenuDish and Review

class MenuDishes(Resource):
    def get(self):
        menu_dishes = [menu_dish.to_dict() for menu_dish in MenuDish.query.all()]
        return menu_dishes, 200
    
    def post(self):
        try:
            data = request.get_json()
            new_menu_dish = MenuDish(
                menu_id=data.get('menu_id'),
                dish_id=data.get('dish_id')
            )
            db.session.add(new_menu_dish)
            db.session.commit()
            return new_menu_dish.to_dict(), 201
        except Exception as e:
            db.session.rollback()
            return {'message': str(e)}, 400

api.add_resource(MenuDishes, "/menu_dishes")

class Reviews(Resource):
    def get(self):
        reviews = [review.to_dict() for review in Review.query.all()]
        return reviews, 200
    
    def post(self):
        try:
            data = request.get_json()
            new_review = Review(
                content=data.get('content'),
                user_id=data.get('user_id'),
                restaurant_id=data.get('restaurant_id') # Make sure to adjust based on your data model
            )
            db.session.add(new_review)
            db.session.commit()
            return new_review.to_dict(), 201
        except Exception as e:
            db.session.rollback()
            return {'message': str(e)}, 400

api.add_resource(Reviews, "/reviews")

class Favorites(Resource):
    def get(self):
        favorites = [favorite.to_dict() for favorite in Favorite.query.all()]
        return favorites, 200
    
    def post(self):
        try:
            data = request.get_json()
            new_favorite = Favorite(
                user_id=data.get('user_id'),
                restaurant_id=data.get('restaurant_id')
            )
            db.session.add(new_favorite)
            db.session.commit()
            return new_favorite.to_dict(), 201
        except Exception as e:
            db.session.rollback()
            return {'message': str(e)}, 400

api.add_resource(Favorites, "/favorites")

@app.errorhandler(400)
def handle_400(error):
    return {"message": "Bad Request"}, 400

@app.errorhandler(500)
def handle_500(error):
    return {"message": "Internal Server Error"}, 500


if __name__ == '__main__':
    app.run(debug=True)