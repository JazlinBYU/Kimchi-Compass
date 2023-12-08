from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import validates
from config import bcrypt, db

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    _password_hash = db.Column(db.String)
    oauth_provider = db.Column(db.String)  
    oauth_user_id = db.Column(db.String)   # User ID from the OAuth provider
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    # relationships
    reviews = db.relationship('Review', back_populates='user', cascade='all, delete-orphan')

    # serialization
    serialize_only = ("id", "username", "email", "reviews", "oauth_provider", "oauth_user_id")

    def __repr__(self):
        return f"<User {self.id}: {self.username}>"

    # validation
    @validates("username")
    def validate_username(self, _, username):
        if not isinstance(username, str):
            raise ValueError("Username must be a string")
        elif len(username) < 1:
            raise ValueError("Username must be at least 1 character")
        return username

    # password handling
    @hybrid_property
    def password(self):
        raise AttributeError("Password is a write-only field")

    @password.setter
    def password(self, password):
        self._password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    @hybrid_property
    def password_hash(self):
        raise AttributeError("Password hashes are super secret!")