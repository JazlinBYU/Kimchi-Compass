from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
from config import db

class Review(db.Model, SerializerMixin):
    __tablename__ = 'reviews'

    id = db.Column(db.Integer, primary_key=True)
    rating = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.String)
    # Add other fields as needed

    # relationships
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    user = db.relationship('User', back_populates='reviews')

    restaurant_id = db.Column(db.Integer, db.ForeignKey('restaurants.id'), nullable=False)
    restaurant = db.relationship('Restaurant', back_populates='reviews')

    menu_id = db.Column(db.Integer, db.ForeignKey('menus.id'))
    menu = db.relationship('Menu', back_populates='reviews')

    dish_id = db.Column(db.Integer, db.ForeignKey('dishes.id'))
    dish = db.relationship('Dish', back_populates='reviews')

    # serialization
    serialize_only = ("id", "rating", "comment", "user_id", "restaurant_id", "menu_id", "dish_id")

    def __repr__(self):
        return f"<Review {self.id}: Rating {self.rating}>"

    # validation
    @validates("rating")
    def validate_rating(self, _, rating):
        if not isinstance(rating, int):
            raise TypeError("Rating must be an integer")
        elif rating < 1 or rating > 5:
            raise ValueError("Rating must be between 1 and 5")
        return rating

    # Add more validations as needed
