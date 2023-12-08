# dish.py
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
from sqlalchemy.ext.associationproxy import association_proxy  # Add this import
from config import db
from menudish import MenuDish

class Dish(db.Model, SerializerMixin):
    __tablename__ = 'dishes'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.String(500))
    price = db.Column(db.Float)

    # relationships
    menu_dish_associations = db.relationship('MenuDish', back_populates='dish', cascade='all, delete-orphan')
    menus = association_proxy('menu_dish_associations', 'menu')  # Add association_proxy

    @validates('name')
    def validate_name(self, key, name):
        if not name:
            raise ValueError('Dish name is required')
        if len(name) < 5:
            raise ValueError('Dish name must be at least 5 characters')
        return name

    @validates('description')
    def validate_description(self, key, description):
        # Add any additional validation for description if needed
        return description

    @validates('price')
    def validate_price(self, key, price):
        if price is not None and price < 0:
            raise ValueError('Price cannot be negative')
        # Add any additional validation for price if needed
        return price
