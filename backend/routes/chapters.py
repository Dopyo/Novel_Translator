from flask import Blueprint, jsonify, request
from models.chapter import Chapter
from models.novel import Novel
from models import db

chapters_bp = Blueprint("chapters", __name__)


# Get all chapters for a novel
@chapters_bp.route("/novel/<int:novel_id>", methods=["GET"])
def get_chapters(novel_id):
    chapters = Chapter.query.filter_by(novel_id=novel_id).all()
    return jsonify([chapter.to_json() for chapter in chapters])


# Create a chapter for a novel
@chapters_bp.route("/", methods=["POST"])
def create_chapter():
    data = request.get_json()
    chapter_number = data.get("chapter_number")
    novel_id = data.get("novel_id")
    system_prompt = data.get("system_prompt")

    # Validate required fields
    if not chapter_number or not novel_id:
        return jsonify({"error": "Chapter number and novel ID are required"}), 400

    # Check if the novel exists
    novel = Novel.query.get(novel_id)
    if not novel:
        return jsonify({"error": "Novel not found"}), 404

    # Create the chapter
    chapter = Chapter(
        chapter_number=chapter_number,
        novel_id=novel_id,
        system_prompt=system_prompt,
    )
    db.session.add(chapter)
    db.session.commit()

    return jsonify(chapter.to_json()), 201


# Delete a chapter
@chapters_bp.route("/<int:id>", methods=["DELETE"])
def delete_chapter(id):
    chapter = Chapter.query.get(id)
    if not chapter:
        return jsonify({"error": "Chapter not found"}), 404
    db.session.delete(chapter)
    db.session.commit()
    return jsonify({"message": "Chapter deleted successfully"}), 200
