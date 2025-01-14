import os
import json
from flask import Blueprint, request, Response, stream_with_context, jsonify
from openai import OpenAI
from models import db, CompletionPair, Chapter
from utils.get_models import get_models

generate_completion_bp = Blueprint("generate_completion", __name__)
models = get_models()


@generate_completion_bp.route("/models", methods=["GET"])
def get_models_route():
    try:
        return jsonify(models), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@generate_completion_bp.route("/generate-completion", methods=["POST"])
def generate_completion():
    try:
        data = request.get_json()
        prompt = data.get("prompt")
        chapter_id = data.get("chapter_id")
        model_id = data.get("model_id")

        if not prompt or not chapter_id or not model_id:
            return (
                jsonify({"error": "Prompt, chapter_id, and model_id are required"}),
                400,
            )

        # Fetch the chapter to get the system prompt
        chapter = Chapter.query.get(chapter_id)
        if not chapter:
            return jsonify({"error": "Chapter not found"}), 404

        selected_model = next(
            (model for model in models if model["name"] == model_id), None
        )
        if not selected_model:
            return jsonify({"error": f"Invalid model_id: {model_id}"}), 400

        client = OpenAI(
            api_key=selected_model["api_key"],
            base_url=selected_model["endpoint"],
        )

        # Include the system prompt in the messages
        messages = []
        if chapter.system_prompt:
            messages.append({"role": "system", "content": chapter.system_prompt})
        messages.append({"role": "user", "content": prompt})

        response = client.chat.completions.create(
            model=selected_model["name"],
            messages=messages,  # Use the updated messages array
            max_tokens=16384,
            temperature=0.7,
            stream=True,
        )

        # Stream the response to the frontend
        def generate():
            full_response = ""
            for chunk in response:
                if chunk.choices and chunk.choices[0].delta.content:
                    content = chunk.choices[0].delta.content
                    full_response += content
                    yield f"data: {json.dumps({'content': content})}\n\n"

            # Save the completion pair to the database
            completion_pair = CompletionPair(
                name=f"{model_id} - {chapter_id}",
                request_json={
                    "messages": messages
                },  # Include system prompt in request_json
                response_json={"choices": [{"message": {"content": full_response}}]},
                chapter_id=chapter_id,
            )
            db.session.add(completion_pair)
            db.session.commit()

            yield "event: end\ndata: {}\n\n"

        return Response(stream_with_context(generate()), mimetype="text/event-stream")

    except Exception as e:
        print(f"Error generating completion pair: {str(e)}")
        return jsonify({"error": str(e)}), 500
