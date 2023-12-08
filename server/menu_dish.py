# menu_dish.py
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
from config import db

class MenuDish(db.Model, SerializerMixin):
    __tablename__ = 'menu_dish'

    id = db.Column(db.Integer, primary_key=True)
    menu_id = db.Column(db.Integer, db.ForeignKey('menus.id'))
    dish_id = db.Column(db.Integer, db.ForeignKey('dishes.id'))
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    # Define relationships
    menu = db.relationship('Menu', back_populates='menu_dish')
    dish = db.relationship('Dish', back_populates='menu_dish')

    serialize_only = ("id", "menu_id", "dish_id")

    @validates('menu_id')
    def validate_menu_id(self, key, menu_id):
        if not menu_id:
            raise ValueError('Menu ID is required')
        # Add any other validations as needed
        return menu_id

    @validates('dish_id')
    def validate_dish_id(self, key, dish_id):
        if not dish_id:
            raise ValueError('Dish ID is required')
        # Add any other validations as needed
        return dish_id

    # Implement any additional validations as needed
