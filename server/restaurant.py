from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
from config import db

class Restaurant(db.Model, SerializerMixin):
    __tablename__ = 'restaurants'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    # Add other fields as needed

    # relationships
    reviews = db.relationship('Review', back_populates='restaurant', cascade='all, delete-orphan')
    menus = db.relationship('Menu', back_populates='restaurant', cascade='all, delete-orphan')

    # serialization
    serialize_only = ("id", "name", "reviews", "menus")

    def __repr__(self):
        return f"<Restaurant {self.id}: {self.name}>"

    # validation
    @validates("name")
    def validate_name(self, _, name):
        if not isinstance(name, str):
            raise TypeError("Name must be a string")
        elif len(name) < 1:
            raise ValueError("Name must be at least 1 character")
        return name

    # Add more validations as needed
