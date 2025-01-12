from flask import Blueprint
from .friends import friends_bp
from .novels import novels_bp
from .chapters import chapters_bp
from .completion_pairs import completion_pairs_bp


def register_routes(app):
    app.register_blueprint(friends_bp, url_prefix="/api/friends")
    app.register_blueprint(novels_bp, url_prefix="/api/novels")
    app.register_blueprint(chapters_bp, url_prefix="/api/chapters")
    app.register_blueprint(completion_pairs_bp, url_prefix="/api/completion-pairs")
