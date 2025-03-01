from flask import jsonify
from werkzeug.exceptions import HTTPException

def register_error_handlers(app):
    @app.errorhandler(HTTPException)
    def handle_app_errors(e):
        """Captura e formata todos os erros personalizados da aplicação."""
        return jsonify(e.description), e.code
    
    @app.errorhandler(Exception)
    def handle_generic_errors(e):

        """Captura erros inesperados."""
        return jsonify({
            "statusCode": 500,
            "message": "Erro interno do servidor",
            "error": str(e)
        }), 500