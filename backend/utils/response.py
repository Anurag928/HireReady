from flask import jsonify

def success_response(data=None, message="Success", status=200):
    return jsonify({
        "success": True,
        "message": message,
        "data": data
    }), status

def error_response(message: str, status_code: int = 400, details: dict = None):
    response = {
        "success": False,
        "error": message
    }
    if details:
        response.update(details)
        
    return jsonify(response), status_code
