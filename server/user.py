# user.py
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
from sqlalchemy.ext.hybrid import hybrid_property
from flask_login import UserMixin


from config import db, bcrypt

class User(db.Model, SerializerMixin, UserMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=True)  # Made nullable for OAuth users
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String, nullable=True)  # Nullable for OAuth users
    google_id = db.Column(db.String(100), unique=True, nullable=True)  # Google OAuth ID
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    # Relationships
    reviews = db.relationship('Review', back_populates='user', cascade='all, delete-orphan')
    favorites = db.relationship('Favorite', back_populates='user', cascade='all, delete-orphan')

    # Serialize only specific fields
    serialize_only = ("id", "username", "email", "reviews", "-reviews.user", "favorites", "-favorites.user" )

    @validates('username')
    def validate_username(self, key, username):
        if username and len(username) > 50:
            raise ValueError('Username must be at most 50 characters')
        return username

    @validates('email')
    def validate_email(self, key, email):
        if not email:
            raise ValueError('Email is required')
        if len(email) > 100:
            raise ValueError('Email must be at most 100 characters')
        if '@' not in email or '.' not in email:
            raise ValueError('Invalid email address')
        return email

    @hybrid_property
    def password(self):
        raise AttributeError("Password hashes are super secret!")

    @password.setter
    def password(self, new_password):
        hashed_password = bcrypt.generate_password_hash(new_password).decode("utf-8")
        self.password_hash = hashed_password  # Fixed the attribute name


    def authenticate(self, password_to_check):
        # This method is not used for OAuth users
        if self.password_hash:
            return bcrypt.check_password_hash(self._password_hash, password_to_check)
        return False

