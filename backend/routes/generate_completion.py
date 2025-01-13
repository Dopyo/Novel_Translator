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

        print(f"Request data: {data}")  # Debugging line

        if not prompt or not chapter_id or not model_id:
            return (
                jsonify({"error": "Prompt, chapter_id, and model_id are required"}),
                400,
            )

        selected_model = next(
            (model for model in models if model["name"] == model_id), None
        )
        if not selected_model:
            print(f"Invalid model_id: {model_id}")  # Debugging line
            return jsonify({"error": f"Invalid model_id: {model_id}"}), 400

        print(f"Selected model: {selected_model}")  # Debugging line

        client = OpenAI(
            api_key=selected_model["api_key"],
            base_url=selected_model["endpoint"],
        )

        response = client.chat.completions.create(
            model=selected_model["name"],
            messages=[
                {"role": "user", "content": prompt},
            ],
            max_tokens=150,
            temperature=0.7,
            stream=True,  # Enable streaming
        )

        # Stream the response to the frontend
        def generate():
            full_response = ""
            for chunk in response:
                if chunk.choices and chunk.choices[0].delta.content:
                    content = chunk.choices[0].delta.content
                    full_response += content
                    yield f"data: {json.dumps({'content': content})}\n\n"

            new_pair = CompletionPair(
                name="Temporary Pair",
                request_json={"key": "value"},
                response_json={"result": "success"},
                chapter_id=1,
            )
            db.session.add(new_pair)
            db.session.flush()
            would_be_id = new_pair.id
            db.session.rollback()

            completion_pair = CompletionPair(
                name=f"{model_id} - {would_be_id}",
                request_json={"messages": [{"role": "user", "content": prompt}]},
                response_json={"choices": [{"message": {"content": full_response}}]},
                chapter_id=chapter_id,
            )
            db.session.add(completion_pair)
            db.session.commit()

            yield "event: end\ndata: {}\n\n"

        return Response(stream_with_context(generate()), mimetype="text/event-stream")

    except Exception as e:
        print(f"Error generating completion pair: {str(e)}")  # Debugging line
        return jsonify({"error": str(e)}), 500
