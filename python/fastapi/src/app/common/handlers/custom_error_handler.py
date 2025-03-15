from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse

def register_error_handlers(app: FastAPI):
    @app.exception_handler(HTTPException)
    async def http_exception_handler(request: Request, exc: HTTPException):
        return JSONResponse(
            status_code=exc.status_code,
            content=exc.detail,
        )