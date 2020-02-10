from django.http import request
import json

def getJsonFromRequest(request):
    return json.loads(request.body.decode('utf-8'))