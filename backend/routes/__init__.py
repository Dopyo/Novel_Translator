from flask import Blueprint
from .friends import friends_bp


def register_routes(app):
    app.register_blueprint(friends_bp, url_prefix="/api/friends")
