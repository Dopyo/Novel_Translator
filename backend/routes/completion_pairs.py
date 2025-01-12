from flask import Blueprint, jsonify, request
from models.completion_pair import CompletionPair
from models import db

completion_pairs_bp = Blueprint("completion_pairs", __name__)


# Get all completion pairs for a chapter
@completion_pairs_bp.route("/chapter/<int:chapter_id>", methods=["GET"])
def get_completion_pairs(chapter_id):
    pairs = CompletionPair.query.filter_by(chapter_id=chapter_id).all()
    return jsonify([pair.to_json() for pair in pairs])


# Create a completion pair for a chapter
@completion_pairs_bp.route("/", methods=["POST"])
def create_completion_pair():
    data = request.get_json()
    name = data.get("name")
    request_json = data.get("request_json")
    response_json = data.get("response_json")
    chapter_id = data.get("chapter_id")
    if not name or not request_json or not response_json or not chapter_id:
        return jsonify({"error": "All fields are required"}), 400

    pair = CompletionPair(
        name=name,
        request_json=request_json,
        response_json=response_json,
        chapter_id=chapter_id,
    )
    db.session.add(pair)
    db.session.commit()
    return jsonify(pair.to_json()), 201


# Delete a completion pair
@completion_pairs_bp.route("/<int:id>", methods=["DELETE"])
def delete_completion_pair(id):
    pair = CompletionPair.query.get(id)
    if not pair:
        return jsonify({"error": "Completion pair not found"}), 404
    db.session.delete(pair)
    db.session.commit()
    return jsonify({"message": "Completion pair deleted successfully"}), 200
