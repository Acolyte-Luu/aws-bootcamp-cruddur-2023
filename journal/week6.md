# Week 6 — Deploying Containers

### Create script to test connection to RDS
```
#!/usr/bin/env python3

import psycopg
import os
import sys

connection_url = os.getenv("CONNECTION_URL")

conn = None
try:
  print('attempting connection')
  conn = psycopg.connect(connection_url)
  print("Connection successful!")
except psycopg.Error as e:
  print("Unable to connect to the database:", e)
finally:
  conn.close()
  ```
  
### Create cloudwatch groups for `cruddur` cluster
```
aws logs create-log-group --log-group-name cruddur
aws logs put-retention-policy --log-group-name cruddur --retention-in-days 1
```

To log in into ECR run this command in terminal

```
aws ecr get-login-password --region $AWS_DEFAULT_REGION | docker login --username AWS --password-stdin "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com"
```
## Create ECR repo and push image for backend-flask 
[stream link] (https://www.youtube.com/watch?v=QIZx2NhdCMI&list=PLBfufR7vyJJ7k25byhRXJldB5AiwgNnWv&index=58)
We are going to create 3 repos:

### Base Image Python :white_check_mark:
1. create a repository for base python image
```
aws ecr create-repository \
  --repository-name cruddur-python \
  --image-tag-mutability MUTABLE
```
2. our backend container references python:3.10-slim-buster from DockerHub. We are going to pull this image and then push it to ECR
3. we keep tags mutable for easier life but we would not do this for real production app
4. we will login to ECR with this command:
```
aws ecr get-login-password --region $AWS_DEFAULT_REGION | docker login --username AWS --password-stdin "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com"
```
5 expected reult from the terminal:
```
gitpod /workspace/aws-bootcamp-cruddur-2023/backend-flask (main) $ aws ecr get-login-password --region $AWS_DEFAULT_REGION | docker login --username AWS --password-stdin "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com"
WARNING! Your password will be stored unencrypted in /home/gitpod/.docker/config.json.
Configure a credential helper to remove this warning. See
https://docs.docker.com/engine/reference/commandline/login/#credentials-store

Login Succeeded
```
6. next we need to map URI to ECR:
```
export ECR_PYTHON_URL="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/cruddur-python"
echo $ECR_PYTHON_URL
```
7. keep in in mind that our backend container uses Python 3.10
8. pull image: ```docker pull python:3.10-slim-buster```
9. terminal output:
```
gitpod /workspace/aws-bootcamp-cruddur-2023/backend-flask (main) $ docker pull python:3.10-slim-buster
3.10-slim-buster: Pulling from library/python
3689b8de819b: Already exists 
af8cd5f36469: Already exists 
74adefb035bf: Already exists 
7d3f13b19e92: Already exists 
ee5147252e65: Already exists 
Digest: sha256:7d6283c08f546bb7f97f8660b272dbab02e1e9bffca4fa9bc96720b0efd29d8e
Status: Downloaded newer image for python:3.10-slim-buster
docker.io/library/python:3.10-slim-buster
```
10. run ```docker images``` to see the image
11. tag image: ```docker tag python:3.10-slim-buster $ECR_PYTHON_URL:3.10-slim-buster```
12. push image: ```docker push $ECR_PYTHON_URL:3.10-slim-buster```
13. got to ECR console, navigate inside the cruddur repository and check that this image is present
14. next we need to set URI to pull the image in our Dockerfile like so ```FROM ${ECR_PYTHON_URL}:3.10-slim-buster```
15. ```docker compose up backend-flask db```
16. go to cruddur back-end container url and append with ```/api/health-check```. Health check shall be successful:
```
{
  "success": true
}
```

##Creating Repo for Flask
Create Repo
```
aws ecr create-repository \
  --repository-name backend-flask \
  --image-tag-mutability MUTABLE
  ```
  
  Set URL
  ```
  export ECR_BACKEND_FLASK_URL="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/backend-flask"
echo $ECR_BACKEND_FLASK_URL
```

Build Image
```
docker build -t backend-flask .
```

Tag Image
```
docker tag backend-flask:latest $ECR_BACKEND_FLASK_URL:latest
```

Push Image
```
docker push $ECR_BACKEND_FLASK_URL:latest
```

This was for the Backend

##For Frontend
create Repo
```
aws ecr create-repository \
  --repository-name frontend-react-js \
  --image-tag-mutability MUTABLE
  ```
  
  Set URL 
  ```
  export ECR_FRONTEND_REACT_URL="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/frontend-react-js"
echo $ECR_FRONTEND_REACT_URL
```

Build Image for Frontend 
```
docker build \
--build-arg REACT_APP_BACKEND_URL="https://4567-$GITPOD_WORKSPACE_ID.$GITPOD_WORKSPACE_CLUSTER_HOST" \
--build-arg REACT_APP_AWS_PROJECT_REGION="$AWS_DEFAULT_REGION" \
--build-arg REACT_APP_AWS_COGNITO_REGION="$AWS_DEFAULT_REGION" \
--build-arg REACT_APP_AWS_USER_POOLS_ID="$REACT_APP_AWS_USER_POOLS_ID" \
--build-arg REACT_APP_CLIENT_ID="$REACT_APP_CLIENT_ID" \
-t frontend-react-js \
-f Dockerfile.prod \
.
```

Tag Image 
```
docker tag frontend-react-js:latest $ECR_FRONTEND_REACT_URL:latest
```

Push Image
```
docker push $ECR_FRONTEND_REACT_URL:latest
```

##Register task definitions
For Backend
```
aws ecs register-task-definition --cli-input-json file://aws/task-definitions/backend-flask.json
```
For Frontend
```
aws ecs register-task-definition --cli-input-json file://aws/task-definitions/frontend-react-js.json
```

I created role policies for these services and created a Task Role and attached that to policies for CloudWatch and X-RAY.

**Permissions for CruddurServiceExecutionRole** (Full access)
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": [
                "ecr:GetAuthorizationToken",
                "ecr:BatchCheckLayerAvailability",
                "ecr:GetDownloadUrlForLayer",
                "ecr:BatchGetImage",
                "logs:CreateLogStream",
                "logs:PutLogEvents"
            ],
            "Resource": "*"
        },
        {
            "Sid": "VisualEditor1",
            "Effect": "Allow",
            "Action": [
                "ssm:GetParameters",
                "ssm:GetParameter"
            ],
            "Resource": "arn:aws:ssm:us-east-1:<accountID>:parameter/cruddur/backend-flask/*"
        }
    ]
}
```
For CloudWatch Permissions
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "autoscaling:Describe*",
                "cloudwatch:*",
                "logs:*",
                "sns:*",
                "iam:GetPolicy",
                "iam:GetPolicyVersion",
                "iam:GetRole",
                "oam:ListSinks"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": "iam:CreateServiceLinkedRole",
            "Resource": "arn:aws:iam::*:role/aws-service-role/events.amazonaws.com/AWSServiceRoleForCloudWatchEvents*",
            "Condition": {
                "StringLike": {
                    "iam:AWSServiceName": "events.amazonaws.com"
                }
            }
        },
        {
            "Effect": "Allow",
            "Action": [
                "oam:ListAttachedLinks"
            ],
            "Resource": "arn:aws:oam:*:*:sink/*"
        }
    ]
}
```

Then I created a `Dockerfile.prod` for Frontend Production environment

##Install Session Manager Plugin - for Ubuntu**
```
curl "https://s3.amazonaws.com/session-manager-downloads/plugin/latest/ubuntu_64bit/session-manager-plugin.deb" -o "session-manager-plugin.deb"
sudo dpkg -i session-manager-plugin.deb
```
To verify it's working 
```
session-manager-plugin
```

## Use ruby to generate out .env files for docker using erb templates

```for ```bin/backend``` folder
#!/usr/bin/env ruby
require 'erb'

template = File.read 'erb/backend-flask.env.erb'
content = ERB.new(template).result(binding)
filename = "backend-flask.env"
File.write(filename, content)
```
6. and for ```bin/frontend``` folder:
```bash
#!/usr/bin/env ruby

require 'erb'

template = File.read 'erb/frontend-react-js.env.erb'
content = ERB.new(template).result(binding)
filename = "frontend-react-js.env"
File.write(filename, content)
```

Edit docker run files to implement env file referencing:
frontend run script:
```bash
#! /usr/bin/bash

ABS_PATH=$(readlink -f "$0")
BACKEND_PATH=$(dirname $ABS_PATH)
BIN_PATH=$(dirname $BACKEND_PATH)
PROJECT_PATH=$(dirname $BIN_PATH)
ENVFILE_PATH="$PROJECT_PATH/frontend-react-js.env"

docker run --rm \
  --env-file $ENVFILE_PATH \
  --network cruddur-net \
  --publish 4567:4567 \
  -it frontend-react-js-prod
```
backend run script:
```bash
#! /usr/bin/bash

# I am using production RDS and DynamoDB, local databases are empty
#--env AWS_ENDPOINT_URL="http://dynamodb-local:8000" \

ABS_PATH=$(readlink -f "$0")
BACKEND_PATH=$(dirname $ABS_PATH)
BIN_PATH=$(dirname $BACKEND_PATH)
PROJECT_PATH=$(dirname $BIN_PATH)
ENVFILE_PATH="$PROJECT_PATH/backend-flask.env"

docker run --rm \
  --env-file $ENVFILE_PATH \
  --network cruddur-net \
  --publish 4567:4567 \
  -it backend-flask-prod
```
specify env files in docker-compose.yml:
```
....
  backend-flask:
    env_file:
      - backend-flask.env
....      
  frontend-react-js:
    env_file:
      - frontend-react-js.env
....
```
Create busybox script
```
#! /usr/bin/bash

docker run --rm \
  --network cruddur-net \
  --publish 4567:4567 \
  -it busybox
```

## Change Docker Compose to explicitly use a user-defined network
```
...
    build: ./backend-flask
    ports:
      - "4567:4567"
    volumes:
      - ./backend-flask:/backend-flask
    networks:
      - cruddur-net
 ...
 build: ./frontend-react-js
    ports:
      - "3000:3000"
    networks:
      - cruddur-net
 ...
 container_name: dynamodb-local
    ports:
      - "8000:8000"
    networks:
      - cruddur-net
 ...
 ports:
      - '5432:5432'
    networks:
      - cruddur-net
 ...
       - "xray -o -b xray-daemon:2000"
    ports:
      - 2000:2000/udp
    networks:
      - cruddur-net
# the name flag is a hack to change the default prepend folder
# name when outputting the image names
networks: 
  cruddur-net:
    driver: bridge
    name: cruddur-net
```    



  
  