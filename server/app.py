#!/usr/bin/env python3

from flask import request, session, Flask, jsonify
from flask_restful import Api, Resource
from werkzeug.exceptions import NotFound
from config import app, db

# Import your model files
from user import User
from restaurant import Restaurant
from menu import Menu
from dish import Dish
from menu_dish import MenuDish
from review import Review

api = Api(app)

@app.errorhandler(NotFound)
def handle_404(error):
    response = {"message": error.description}
    return response, error.code

@app.route('/')
def index():
    return '<h1>Project Server</h1>'

# Define your resource classes

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

if __name__ == '__main__':
    app.run(debug=True)