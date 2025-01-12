from . import db


class CompletionPair(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    request_json = db.Column(db.JSON, nullable=False)
    response_json = db.Column(db.JSON, nullable=False)
    chapter_id = db.Column(db.Integer, db.ForeignKey("chapter.id"), nullable=False)

    def to_json(self):
        return {
            "id": self.id,
            "name": self.name,
            "request_json": self.request_json,
            "response_json": self.response_json,
            "chapter_id": self.chapter_id,
        }
