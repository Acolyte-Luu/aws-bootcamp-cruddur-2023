import os
import sys

from flask import current_app as app
from flask import request, g
from flask import Flask

from services.message_groups import *
from services.messages import *
from services.create_message import *

from lib.cognito_jwt_token import jwt_required
from lib.helpers import model_json
from aws_xray_sdk.core import xray_recorder
from flask_cors import cross_origin


def load(app):
  #@app.after_request
  #def after_request(response):
  #  init_cloudwatch(response)

  @app.route('/api/health-check')
  def health_check():
    return {'success': True, 'version':1}, 200
  
  @app.route('/rollbar/test')
  def rollbar_test():
    g.rollbar.report_message('Hello World!', 'warning')
    return "Hello World!"