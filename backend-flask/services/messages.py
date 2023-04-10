from datetime import datetime, timedelta, timezone
from lib.dynamodb import Ddb
from lib.db import db
class Messages:
  def run(message_group_uuid,cognito_user_id):
    model = {
      'errors': None,
      'data': None
    }

    sql = db.template('users','uuid_from_cognito_user_id')
    my_user_uuid = db.query_value(sql,{'cognito_user_id': cognito_user_id})
    print(f"UUID: {my_user_uuid}")

    dynamodb = Ddb.client()
    data = Ddb.list_messages(dynamodb, message_group_uuid)
    print("list_messages",data)
    #now = datetime.now(timezone.utc).astimezone()
    #MomentoCounter.reset(f"msgs/{user_handle}")
    model['data'] = data
    return model
