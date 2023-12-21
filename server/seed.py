import requests
from flask import Flask
from faker import Faker
from favorite import Favorite
from random import randint, choice
from datetime import datetime
from config import db
from restaurant import Restaurant
from menu import Menu
from dish import Dish
from menu_dish import MenuDish
from food_user import FoodUser
from review import Review
from random import sample 

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'  # Ensure this matches your actual database URI
db.init_app(app)

YELP_API_KEY = "nS0hSkt6MykfzvtTOX0nD8MexHqE5NYlAlaZUj6_r9_Uz6E-XTAypJc_N10lkzWj1wb2ZJ3QTsQH-x1u8SYFpxvzwpKGo2H01US8j-s-7_Bg_Y-OdhmyHWKKLAVzZXYx"  # Replace with your actual Yelp API key

def get_yelp_data():
    params = {
        'location': 'Seattle',
        'categories': 'korean',
        'limit': 10  # Adjust based on your needs
    }

    headers = {
        'Authorization': f'Bearer {YELP_API_KEY}'
    }

    try:
        response = requests.get('https://api.yelp.com/v3/businesses/search', params=params, headers=headers)
        response.raise_for_status()  # Raises an exception for HTTP errors
        return response.json().get('businesses', [])
    except requests.RequestException as e:
        print(f"Error fetching data from Yelp API: {e}")
        return []
    
def add_favorite(food_user_id, restaurant_id):
    try:
        new_favorite = Favorite(food_user_id=food_user_id, restaurant_id=restaurant_id)
        db.session.add(new_favorite)
        db.session.commit()
        print(f"Added favorite: FoodUser {food_user_id} -> Restaurant {restaurant_id}")
    except Exception as e:
        print(f"Failed to add favorite: {e}")
        db.session.rollback()

def seed_database():
    fake = Faker()
    try:
        # Seed restaurants from Yelp data
        yelp_data = get_yelp_data()
        for data in yelp_data:  
            name = data.get('name')
            rating = data.get('rating')
            image_url = data.get('image_url')
            phone_number = data.get('phone')

            restaurant = Restaurant(name=name, rating=rating, image_url=image_url, phone_number=phone_number)
            db.session.add(restaurant)

        db.session.commit()

        

        # Sample Korean dishes
        sample_dishes = [
    {"name": "Bibimbap", "description": "Mixed rice with vegetables", "price": 12.99},
    {"name": "Kimchi Jjigae", "description": "Kimchi stew with tofu", "price": 13.99},
    {"name": "Bulgogi", "description": "Marinated beef BBQ", "price": 15.99},
    {"name": "Japchae", "description": "Stir-fried sweet potato noodles", "price": 14.99},
    {"name": "Tteokbokki", "description": "Spicy rice cakes", "price": 10.99},
    {"name": "Galbi", "description": "Grilled short ribs", "price": 16.99},
    {"name": "Sundubu-jjigae", "description": "Soft tofu stew", "price": 12.99},
    {"name": "Samgyeopsal", "description": "Grilled pork belly", "price": 14.99},
    {"name": "Haemul Pajeon", "description": "Seafood pancake", "price": 13.99},
    {"name": "Gimbap", "description": "Korean sushi rolls", "price": 9.99},
    {"name": "Dakgangjeong", "description": "Crispy fried chicken", "price": 11.99},
    {"name": "Mandu", "description": "Korean dumplings", "price": 10.99},
    {"name": "Naengmyeon", "description": "Cold buckwheat noodles", "price": 12.99},
    {"name": "Banchan", "description": "Small side dishes", "price": 5.99},
    {"name": "Bossam", "description": "Boiled pork wrap", "price": 15.99},
    {"name": "Jjajangmyeon", "description": "Black bean sauce noodles", "price": 13.99},
    {"name": "Soondae", "description": "Korean blood sausage", "price": 14.99},
    {"name": "Yukgaejang", "description": "Spicy beef soup", "price": 14.99},
    {"name": "Hobakjeon", "description": "Zucchini fritters", "price": 9.99},
    {"name": "Gamjatang", "description": "Pork bone soup", "price": 13.99}
]


        # Seed dishes
        for dish_data in sample_dishes:
            dish = Dish(name=dish_data['name'], description=dish_data['description'], price=dish_data['price'])
            db.session.add(dish)

        db.session.commit()

        # Create menus and assign dishes to restaurants
        dishes = Dish.query.all()
        restaurants = Restaurant.query.all()

        for restaurant in restaurants:
            # Create lunch and dinner menus for each restaurant
            lunch_menu = Menu(name="Lunch Menu", restaurant_id=restaurant.id)
            dinner_menu = Menu(name="Dinner Menu", restaurant_id=restaurant.id)
            db.session.add(lunch_menu)
            db.session.add(dinner_menu)

            # Randomly assign a subset of dishes to each menu
            lunch_dishes = sample(dishes, 5)  # Select 5 dishes for lunch
            dinner_dishes = sample(dishes, 5)  # Select 5 different dishes for dinner

            # Associate dishes with lunch menu
            for dish in lunch_dishes:
                menu_dish = MenuDish(menu=lunch_menu, dish=dish)
                db.session.add(menu_dish)

            # Associate dishes with dinner menu
            for dish in dinner_dishes:
                menu_dish = MenuDish(menu=dinner_menu, dish=dish)
                db.session.add(menu_dish)

                # Seed fake users
        for _ in range(10):  # Adjust number as needed
            food_user = FoodUser(
                username=fake.user_name(),
                email=fake.email(),
                _password_hash=fake.password()  # In reality, hash this password
            )
            db.session.add(food_user)

        db.session.commit()
        
        # Seed favorites
        food_users = FoodUser.query.all()
        restaurants = Restaurant.query.all()

# Let's assume each user favorites 2 restaurants
        for food_user in food_users:
            favorite_restaurants = sample(restaurants, 2)  # Select 2 random restaurants
            for restaurant in favorite_restaurants:
                add_favorite(food_user.id, restaurant.id)



        # Seed fake reviews
        food_users = FoodUser.query.all()
        for restaurant in restaurants:
            for _ in range(5):  # Adjust number as needed
                review = Review(
                    content=fake.text(),
                    rating=randint(1, 5),
                    review_date=datetime.utcnow(),
                    food_user_id=choice(food_users).id,
                    restaurant_id=restaurant.id
                )
                db.session.add(review)

        db.session.commit()
        print("Database seeded successfully!")
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.session.rollback()

if __name__ == '__main__':
    with app.app_context():
        print("Seeding database...")
        seed_database()
