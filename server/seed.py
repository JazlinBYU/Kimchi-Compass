import requests
from config import db, app
from restaurant import Restaurant
from fake_data import populate_data

YELP_API_KEY = "nS0hSkt6MykfzvtTOX0nD8MexHqE5NYlAlaZUj6_r9_Uz6E-XTAypJc_N10lkzWj1wb2ZJ3QTsQH-x1u8SYFpxvzwpKGo2H01US8j-s-7_Bg_Y-OdhmyHWKKLAVzZXYx"


def clear_tables():
    db.drop_all()
    db.create_all()
    print("Database created!")


def get_yelp_data():
    params = {
        'location': 'Seattle',
        'categories': 'restaurants',
        'limit': 10 # Adjust based on your needs
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
        rating = data.get('rating')
        price = data.get('price')
        # Extract other fields as needed

        # Create a new Restaurant instance and add it to the database
        restaurant = Restaurant(name=name, rating=rating, price=price)
        # Set other fields as needed

        db.session.add(restaurant)

    # Commit the changes to the database
    db.session.commit()


if __name__ == '__main__':
    with app.app_context():
        # Run the seed script
        clear_tables()
        seed_database()