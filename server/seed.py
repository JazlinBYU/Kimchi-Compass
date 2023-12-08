import requests
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from app import Restaurant, db  # Assuming your main app file is named app.py
from restaurant import Restaurant

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
db = SQLAlchemy(app)

YELP_API_KEY = "nS0hSkt6MykfzvtTOX0nD8MexHqE5NYlAlaZUj6_r9_Uz6E-XTAypJc_N10lkzWj1wb2ZJ3QTsQH-x1u8SYFpxvzwpKGo2H01US8j-s-7_Bg_Y-OdhmyHWKKLAVzZXYx"

def get_yelp_data():
    params = {
        'location': 'Seattle',
        'categories': 'restaurants',
        'limit': 10  # Adjust based on your needs
    }

    headers = {
        'Authorization': f'Bearer {YELP_API_KEY}'
    }

    response = requests.get('https://api.yelp.com/v3/businesses/search', params=params, headers=headers)
    return response.json().get('businesses', [])

def seed_database():
    restaurant_data = get_yelp_data()

    for data in restaurant_data:
        # Extract relevant data from the Yelp API response
        name = data.get('name')

        # Create a new Restaurant instance and add it to the database
        restaurant = Restaurant(name=name)
        db.session.add(restaurant)

    # Commit the changes to the database
    db.session.commit()

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        print("Database created!")
        seed_database()
