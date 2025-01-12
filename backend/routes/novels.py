from flask import Blueprint, jsonify, request
from models.novel import Novel
from models import db

novels_bp = Blueprint("novels", __name__)


# Get all novels
@novels_bp.route("/", methods=["GET"])
def get_novels():
    novels = Novel.query.all()
    return jsonify([novel.to_json() for novel in novels])


# Create a novel
@novels_bp.route("/", methods=["POST"])
def create_novel():
    data = request.get_json()
    name = data.get("name")
    if not name:
        return jsonify({"error": "Name is required"}), 400

    novel = Novel(name=name)
    db.session.add(novel)
    db.session.commit()
    return jsonify(novel.to_json()), 201


# Get a specific novel by ID
@novels_bp.route("/<int:id>", methods=["GET"])
def get_novel(id):
    novel = Novel.query.get(id)
    if not novel:
        return jsonify({"error": "Novel not found"}), 404
    return jsonify(novel.to_json())


# Delete a novel
@novels_bp.route("/<int:id>", methods=["DELETE"])
def delete_novel(id):
    novel = Novel.query.get(id)
    if not novel:
        return jsonify({"error": "Novel not found"}), 404
    db.session.delete(novel)
    db.session.commit()
    return jsonify({"message": "Novel deleted successfully"}), 200
