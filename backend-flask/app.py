import os
import sys

from flask import Flask
from flask import request, g
from flask_cors import cross_origin

from lib.rollbar import init_rollbar
from lib.xray import init_xray
from lib.honeycomb import init_honeycomb
from lib.cors import init_cors
#from lib.cloudwatch import init_cloudwatch
from lib.helpers import model_json
from lib.cognito_jwt_token import jwt_required

import routes.activities
import routes.users
import routes.messages
import routes.debugging

app = Flask(__name__)

init_xray(app)
with app.app_context():
  g.rollbar = init_rollbar(app)
init_honeycomb(app)
init_cors(app)

routes.activities.load(app)
routes.debugging.load(app)
routes.users.load(app)
routes.messages.load(app)

if __name__ == "__main__":
  app.run(debug=True)