# favorite.py
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
from config import db

class Favorite(db.Model, SerializerMixin):
    __tablename__ = 'favorites'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    restaurant_id = db.Column(db.Integer, db.ForeignKey('restaurants.id'), nullable=True)

    # Relationships
    user = db.relationship('User', back_populates='favorites')
    restaurant = db.relationship('Restaurant', back_populates='favorites')

    serialize_only = ("id", "user_id", "restaurant_id")

    def __repr__(self):
        return f"<Favorite {self.id}: User {self.user_id} - Restaurant {self.restaurant_id} - Dish {self.dish_id}>"
    
    @validates("user_id")
    def validate_user_id(self, key, user_id):
        if user_id <= 0:
            raise ValueError("Invalid user ID")
        return user_id

    @validates("restaurant_id")
    def validate_restaurant_id(self, key, restaurant_id):
        if restaurant_id is not None and restaurant_id <= 0:
            raise ValueError("Invalid restaurant ID")
        return restaurant_id

    @validates("dish_id")
    def validate_dish_id(self, key, dish_id):
        if dish_id is not None and dish_id <= 0:
            raise ValueError("Invalid dish ID")
        return dish_id
