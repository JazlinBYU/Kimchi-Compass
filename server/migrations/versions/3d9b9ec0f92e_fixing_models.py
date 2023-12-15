"""fixing models

Revision ID: 3d9b9ec0f92e
Revises: 
Create Date: 2023-12-14 14:12:59.379603

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '3d9b9ec0f92e'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('dishes',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=255), nullable=False),
    sa.Column('description', sa.String(length=500), nullable=True),
    sa.Column('price', sa.Float(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('restaurants',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('rating', sa.Float(), nullable=True),
    sa.Column('image_url', sa.String(), nullable=True),
    sa.Column('phone_number', sa.String(), nullable=True),
    sa.Column('address', sa.String(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('username', sa.String(length=50), nullable=True),
    sa.Column('email', sa.String(length=100), nullable=False),
    sa.Column('password_hash', sa.String(), nullable=True),
    sa.Column('google_id', sa.String(length=100), nullable=True),
    sa.Column('created_at', sa.DateTime(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email'),
    sa.UniqueConstraint('google_id'),
    sa.UniqueConstraint('username')
    )
    op.create_table('favorites',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('restaurant_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['restaurant_id'], ['restaurants.id'], name=op.f('fk_favorites_restaurant_id_restaurants')),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], name=op.f('fk_favorites_user_id_users')),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('menus',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('restaurant_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['restaurant_id'], ['restaurants.id'], name=op.f('fk_menus_restaurant_id_restaurants')),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('reviews',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('content', sa.String(), nullable=False),
    sa.Column('rating', sa.Float(), nullable=True),
    sa.Column('review_date', sa.DateTime(), nullable=True),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('restaurant_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['restaurant_id'], ['restaurants.id'], name=op.f('fk_reviews_restaurant_id_restaurants')),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], name=op.f('fk_reviews_user_id_users')),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('menu_dishes',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('dish_id', sa.Integer(), nullable=False),
    sa.Column('menu_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['dish_id'], ['dishes.id'], name=op.f('fk_menu_dishes_dish_id_dishes')),
    sa.ForeignKeyConstraint(['menu_id'], ['menus.id'], name=op.f('fk_menu_dishes_menu_id_menus')),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('menu_dishes')
    op.drop_table('reviews')
    op.drop_table('menus')
    op.drop_table('favorites')
    op.drop_table('users')
    op.drop_table('restaurants')
    op.drop_table('dishes')
    # ### end Alembic commands ###