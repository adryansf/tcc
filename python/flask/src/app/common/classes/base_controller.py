from flask import make_response, jsonify

class BaseController:
  def sendSuccessWithoutBody(self, status: int):
    return "", status
  
  def sendSuccess(self, response: dict, status = 200):
    if(hasattr(response, "to_json")):
      response = response.to_json()
    

    return make_response(jsonify(response)), status

  