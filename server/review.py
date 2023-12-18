# review.py
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
from config import db
from food_user import FoodUser  # Import the User class
from datetime import datetime  # Import datetime if you're adding a date field

class Review(db.Model, SerializerMixin):
    __tablename__ = 'reviews'

    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String, nullable=False)
    rating = db.Column(db.Float)
    review_date = db.Column(db.DateTime, default=datetime.utcnow)  # Optional date field
    food_user_id = db.Column(db.Integer, db.ForeignKey('food_users.id'), nullable=False) 
    restaurant_id = db.Column(db.Integer, db.ForeignKey('restaurants.id'), nullable=False)

    # Relationships

    food_user = db.relationship('FoodUser', back_populates='reviews')
    restaurant = db.relationship('Restaurant', back_populates='reviews')

    # Serialization
    serialize_only = ("id", "content", "rating", "food_user","-food_user.reviews", "restaurant","-restaurant.reviews", "review_date")

    def __repr__(self):
        return f"<Review {self.id}: {self.content}: {self.rating}>"

    # Validation
    @validates("content")
    def validate_content(self, _, content):
        if not content:
            raise ValueError("Content must not be empty")
        return content

    @validates("rating")
    def validate_rating(self, key, rating):
        if rating is not None and (rating < 0 or rating > 5):
            raise ValueError("Rating must be between 0 and 5")
        return rating
