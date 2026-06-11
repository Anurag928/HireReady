import os
import logging
from pymongo import MongoClient
from pymongo.errors import PyMongoError
from dotenv import load_dotenv

# Load .env variables (if not already loaded in app)
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI") or "mongodb://localhost:27017"
# If not set, default to local MongoDB instance
# No RuntimeError is raised to allow development without explicit env var

try:
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    # Trigger a server selection to verify connection
    client.admin.command('ping')
    # Use a default database name (you can change it later)
    # The URI may include a default database; otherwise we use "careerpilot".
    _db_name = os.getenv("MONGO_DB_NAME", "careerpilot")

    db = client[_db_name]
    # Export the users collection reference
    users_collection = db["users"]
except PyMongoError as e:
    # On connection failure, set references to None and surface a warning
    # so the rest of the application can handle the missing DB gracefully.
    client = None
    db = None
    users_collection = None
    try:
        # avoid failing import-time by printing/logging the error
        logging.warning(f"Could not connect to MongoDB at {MONGO_URI}: {e}")
    except Exception:
        pass


def get_db():
    if db is None:
        raise RuntimeError(
            "MongoDB is unavailable. Check MONGO_URI, database credentials, and network access."
        )
    return db


def get_collection(name: str):
    database = get_db()
    return database[name]


def init_db(app=None):
    """Initialize MongoDB connection (already established at import) and optionally store references on the Flask app.
    
    Parameters
    ----------
    app: Flask or None
        The Flask application instance. If provided, the MongoDB client, db, and collection are set
        on ``app.config`` for easy access in other parts of the code.
    """
    if app is not None:
        app.config.setdefault('MONGO_CLIENT', client)
        app.config.setdefault('MONGO_DB', db)
        app.config.setdefault('USERS_COLLECTION', users_collection)
    return client

__all__ = ["client", "db", "users_collection", "init_db", "get_db", "get_collection"]
