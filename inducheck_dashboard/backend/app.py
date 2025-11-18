"""
InduCheck Live Dashboard - Backend API Server
Main Flask application entry point
"""

from flask import Flask
from flask_cors import CORS
from config import config
from api.dashboard import dashboard_bp


def create_app():
    """Application factory pattern"""
    app = Flask(__name__)

    # Enable CORS for React frontend
    CORS(app, origins=config.CORS_ORIGINS)

    # Register blueprints
    app.register_blueprint(dashboard_bp, url_prefix='/api')

    # Health check endpoint
    @app.route('/health')
    def health():
        return {'status': 'healthy', 'service': 'InduCheck Dashboard API'}, 200

    return app


if __name__ == '__main__':
    app = create_app()
    print(f"""
╔════════════════════════════════════════════════════════╗
║   InduCheck Live Dashboard - Backend Server           ║
╠════════════════════════════════════════════════════════╣
║   Environment: {config.FLASK_ENV:40s} ║
║   Host: {config.HOST:47s} ║
║   Port: {str(config.PORT):47s} ║
║   API Endpoint: http://{config.HOST}:{config.PORT}/api/dashboard/live
║   Health Check: http://{config.HOST}:{config.PORT}/health
╚════════════════════════════════════════════════════════╝
    """)
    app.run(debug=config.DEBUG, host=config.HOST, port=config.PORT)
