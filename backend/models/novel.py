from . import db


class Novel(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    chapters = db.relationship(
        "Chapter", backref="novel", cascade="all, delete-orphan", lazy=True
    )

    def to_json(self):
        return {
            "id": self.id,
            "name": self.name,
            "chapters": [chapter.to_json() for chapter in self.chapters],
        }
