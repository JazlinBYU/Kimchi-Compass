# user.py
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.ext.associationproxy import association_proxy  # Add this import
from config import db, bcrypt

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String, nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    # Define relationships
    reviews = db.relationship('Review', back_populates='user')

    # Add association_proxy for dishes through reviews
    reviewed_dishes = association_proxy('reviews', 'dish')

    serialize_only = ("id", "username", "email")

    @validates('username')
    def validate_username(self, key, username):
        if not username:
            raise ValueError('Username is required')
        if len(username) > 50:
            raise ValueError('Username must be at most 50 characters')
        return username

    @validates('email')
    def validate_email(self, key, email):
        if not email:
            raise ValueError('Email is required')
        if len(email) > 100:
            raise ValueError('Email must be at most 100 characters')
        # Ensure the email is valid (you may want to use a more robust validation)
        if '@' not in email or '.' not in email:
            raise ValueError('Invalid email address')
        return email

    # Implement any additional validations as needed

    @hybrid_property
    def password_hash(self):
        # return self._password_hash
        raise AttributeError("Password hashes are super secret!")

    @password_hash.setter
    def password_hash(self, new_password):
        hashed_password = bcrypt.generate_password_hash(new_password).decode("utf-8")
        self._password_hash = hashed_password

    def authenticate(self, password_to_check):
        return bcrypt.check_password_hash(self._password_hash, password_to_check)
