from fastapi.responses import JSONResponse, Response
import json
import uuid

class UUIDEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, uuid.UUID):
            return str(obj)
        return super().default(obj)

class BaseController:
    def sendSuccessWithoutBody(self, status: int):
        return Response(status_code=status)
  
    def sendSuccess(self, response: dict, status = 200):
        if hasattr(response, "to_json"):
            response = response.to_json()
        
        response_json = json.dumps(response, cls=UUIDEncoder)
        return JSONResponse(content=json.loads(response_json), status_code=status)

