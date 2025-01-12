from flask import Flask, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import event
from flask_cors import CORS
from routes import register_routes
from models import db

import os


def create_app():

    app = Flask(__name__)
    CORS(app)

    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db.sqlite"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    db.init_app(app)

    def enable_foreign_keys(db_connection, _):
        db_connection.execute("PRAGMA foreign_keys=ON")

    with app.app_context():
        event.listen(db.engine, "connect", enable_foreign_keys)

    register_routes(app)

    dist_folder = os.path.join(os.getcwd(), "..", "frontend", "dist")

    @app.route("/", defaults={"filename": ""})
    @app.route("/<path:filename>")
    def index(filename):
        if filename == "":
            filename = "index.html"
        return send_from_directory(dist_folder, filename)

    with app.app_context():
        db.create_all()

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
