import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
from werkzeug.exceptions import HTTPException

# Load environment variables from .env
load_dotenv()

from services.mongo_service import init_db
from routes.user import user_bp
from routes.onboarding import onboarding_bp
from routes.roadmap import roadmap_bp
from routes.resume import resume_bp
from routes.interview import interview_bp
from routes.dashboard import dashboard_bp

app = Flask(__name__)
CORS(app, resources={ # type: ignore
    r"/api/*": {
        "origins": [
            "http://localhost:3000",
            "https://hire-ready-self.vercel.app"
        ],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

@app.before_request
def log_request():
    app.logger.info(
        f"[Request] {request.method} {request.path} content_type={request.content_type}"
    )

from flask import Response

@app.errorhandler(Exception)
def handle_exception(error: Exception) -> tuple[Response, int]:
    if isinstance(error, HTTPException):
        return jsonify({
            "success": False,
            "message": error.description
        }), (error.code or 500)

    app.logger.exception(f"[Unhandled Error] {error}")
    return jsonify({
        "success": False,
        "message": str(error)
    }), 500

# Initialize MongoDB connection
init_db(app)

# Register blueprints
app.register_blueprint(user_bp, url_prefix="/api")
app.register_blueprint(onboarding_bp, url_prefix="/api")
app.register_blueprint(roadmap_bp, url_prefix="/api")
app.register_blueprint(resume_bp, url_prefix="/api")
app.register_blueprint(interview_bp, url_prefix="/api")
app.register_blueprint(dashboard_bp, url_prefix="/api")

@app.route("/")
def home():
    return {
        "status": "success",
        "service": "HireReady AI Backend",
        "message": "Backend running successfully"
    }, 200

@app.route("/health")
def health():
    return {
        "status": "ok"
    }, 200

print("====================================================")
print("HireReady AI Backend Started Successfully")
print("====================================================")
print("Registered Routes:")
for rule in app.url_map.iter_rules():
    print(rule)
print("====================================================")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
