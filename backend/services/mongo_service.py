import os
from pymongo import MongoClient
from pymongo.errors import PyMongoError
from dotenv import load_dotenv

# Load .env variables (if not already loaded in app)
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
if not MONGO_URI:
    raise RuntimeError("MONGO_URI not set in environment variables")

try:
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    # Trigger a server selection to verify connection
    client.admin.command('ping')
except PyMongoError as e:
    raise RuntimeError(f"Failed to connect to MongoDB: {e}")

# Use a default database name (you can change it later)
# The URI may include a default database; otherwise we use "careerpilot".
_db_name = os.getenv("MONGO_DB_NAME", "careerpilot")

db = client[_db_name]
# Export the users collection reference
users_collection = db["users"]
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
__all__ = ["client", "db", "users_collection", "init_db"]
