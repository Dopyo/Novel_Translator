from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

from .friend import Friend
from .novel import Novel
from .chapter import Chapter
from .completion_pair import CompletionPair
