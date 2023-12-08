from flask import Flask, redirect, url_for, session
from flask_oauthlib.client import OAuth
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from config import app, db, oauth

login_manager = LoginManager(app)
login_manager.login_view = 'login'

# OAuth Configuration
google = oauth.remote_app(
    'google',
    consumer_key=app.config.get('OAUTH_CREDENTIALS')['google']['id'],
    consumer_secret=app.config.get('OAUTH_CREDENTIALS')['google']['secret'],
    request_token_params={
        'scope': 'email',
    },
    base_url='https://www.googleapis.com/oauth2/v1/',
    request_token_url=None,
    access_token_method='POST',
    access_token_url='https://accounts.google.com/o/oauth2/token',
    authorize_url='https://accounts.google.com/o/oauth2/auth',
)

class User(UserMixin):
    def __init__(self, user_id):
        self.id = user_id

# Routes
@app.route('/')
def index():
    return 'Welcome to your app!'

@app.route('/login')
def login():
    return google.authorize(callback=url_for('authorized', _external=True))

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('index'))

@app.route('/login/authorized')
def authorized():
    resp = google.authorized_response()
    if resp is None:
        return 'Access denied: reason=%s error=%s' % (
            request.args['error_reason'],
            request.args['error_description']
        )
    session['oauth_token'] = (resp['access_token'], '')
    me = google.get('userinfo')
    user = User(me.data['id'])
    login_user(user)
    return redirect(url_for('index'))

@google.tokengetter
def get_google_oauth_token():
    return session.get('google_token')

# Sample protected route
@app.route('/profile')
@login_required
def dashboard():
    return f'Hello, {current_user.username}! This is your profile.'

if __name__ == '__main__':
    db.create_all()
    app.run(debug=True)
