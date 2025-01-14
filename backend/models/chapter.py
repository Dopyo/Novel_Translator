from . import db


class Chapter(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    chapter_number = db.Column(db.Integer, nullable=False)
    novel_id = db.Column(
        db.Integer, db.ForeignKey("novel.id", ondelete="CASCADE"), nullable=False
    )
    system_prompt = db.Column(db.String(500), nullable=True)
    completion_pairs = db.relationship(
        "CompletionPair", backref="chapter", cascade="all, delete-orphan", lazy=True
    )

    def to_json(self):
        return {
            "id": self.id,
            "chapter_number": self.chapter_number,
            "novel_id": self.novel_id,
            "system_prompt": self.system_prompt,
            "completion_pairs": [pair.to_json() for pair in self.completion_pairs],
        }
