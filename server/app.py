#!/usr/bin/env python3

from flask import Flask, jsonify, request, redirect, url_for
from flask_restful import Resource, Api
from werkzeug.exceptions import NotFound
from werkzeug.security import check_password_hash
from authlib.integrations.flask_client import OAuth
from flask_login import LoginManager, login_user, logout_user, UserMixin
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from config import app, db, api, bcrypt

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
login_manager = LoginManager(app)
jwt = JWTManager(app)

app.config['JWT_SECRET_KEY'] = 'super-secret'  # Change this to a random secret key

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

# User loader for Flask-Login
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

class Users(Resource):
    def get(self):
        try:
            users = [user.to_dict() for user in User.query.all()]
            return users, 200
        except Exception as e:
            return {'message': str(e)}, 400

    def post(self):
        try:
            data = request.get_json()
            new_user = User(username=data['username'], email=data['email'])
            new_user.password = data['password']  # This will hash the password
            db.session.add(new_user)
            db.session.commit()
            return new_user.to_dict(), 201
        except Exception as e:
            db.session.rollback()
            return {'message': str(e)}, 400

api.add_resource(Users, "/users")

class Restaurants(Resource):
    def get(self):
        try:
            restaurants = [restaurant.to_dict() for restaurant in Restaurant.query]
            return restaurants, 200
        except Exception as e:
            return {'message': str(e)}, 400

    def post(self):
        try:
            data = request.get_json()
            new_restaurant = Restaurant(name=data['name'])
            new_restaurant = Restaurant(rating=data['rating'])
            new_restaurant = Restaurant(image_url=data['image_url'])
            new_restaurant = Restaurant(phone_number=data['phone_number'])
            db.session.add(new_restaurant)
            db.session.commit()
            return new_restaurant.to_dict(), 201
        except Exception as e:
            db.session.rollback()
            return {'message': str(e)}, 400

api.add_resource(Restaurants, "/restaurants")

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

    access_token = create_access_token(identity=user.id)
    return jsonify(access_token=access_token), 200

@app.route('/logout')
@jwt_required()
def logout():
    logout_user()  
    return jsonify(msg="Logged out"), 200


@app.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user_id = get_jwt_identity()
    return jsonify(logged_in_as=current_user_id), 200

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email', None)
    password = data.get('password', None)

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
    app.run(port=5555, debug=True)