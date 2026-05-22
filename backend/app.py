from flask import Flask, jsonify
from flask_cors import CORS
from routes.health import health_bp
from routes.user import user_bp
from routes.onboarding import onboarding_bp
from dotenv import load_dotenv
import os

def create_app():
    # Load environment variables from .env
    load_dotenv()
    app = Flask(__name__)
    CORS(app)  # Allow all origins for development

    # Initialize MongoDB connection
    from services.mongo_service import init_db
    init_db(app)

    from routes.health import health_bp
    from routes.user import user_bp
    from routes.onboarding import onboarding_bp
    from routes.roadmap import roadmap_bp
    from routes.resume import resume_bp

    # Register blueprints
    app.register_blueprint(health_bp)
    app.register_blueprint(user_bp, url_prefix="/api")
    app.register_blueprint(onboarding_bp, url_prefix="/api")
    app.register_blueprint(roadmap_bp, url_prefix="/api")
    app.register_blueprint(resume_bp, url_prefix="/api")

    @app.route("/ping")
    def ping():
        return jsonify({"message": "pong"}), 200

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=5000, debug=True)
