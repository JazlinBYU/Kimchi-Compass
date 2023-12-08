# review.py
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
from config import db

class Review(db.Model, SerializerMixin):
    __tablename__ = 'reviews'

    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    restaurant_id = db.Column(db.Integer, db.ForeignKey('restaurants.id'), nullable=False)

    user = db.relationship('User', back_populates='reviews')
    restaurant = db.relationship('Restaurant', back_populates='reviews')

    @validates('content')
    def validate_content(self, key, content):
        if not content:
            raise ValueError('Review content is required')
        if len(content) < 10:
            raise ValueError('Review content must be at least 10 characters')
        return content
