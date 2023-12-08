import os

class Config:
    # Flask configuration
    SECRET_KEY = 'your_secret_key'  # Replace with a secure secret key
    DEBUG = True

    # SQLAlchemy configuration
    SQLALCHEMY_DATABASE_URI = 'sqlite:///site.db'  # Adjust based on your database type and location
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Bcrypt configuration
    BCRYPT_LOG_ROUNDS = 12

    # Flask-RESTful configuration
    ERROR_404_HELP = False

    # Session configuration
    SESSION_TYPE = 'filesystem'
    SESSION_PERMANENT = False
    PERMANENT_SESSION_LIFETIME = 1800  # Session timeout in seconds (e.g., 30 minutes)

    # Add other configurations as needed

    # Ensure that the secret key is set
    if not SECRET_KEY:
        raise ValueError("SECRET_KEY not set. Set it in config.py for security.")

    # Use a secure random key if SECRET_KEY is not provided
    SECRET_KEY = SECRET_KEY or os.urandom(24)

