# Week X — Sync Tool for Static Website Hosting and CleanUp

This is the last week where I worked on deploying the Cruddur Application in production. 

### Setup Static Building for our application
So firstly, I created a [`static-built`](https://github.com/Acolyte-Luu/aws-bootcamp-cruddur-2023/blob/main/bin/frontend/static-build) script for frontend. Zipped the build file and uploaded that in S3 Bucket `acolyteluu.cloud`. To zip the build folder contents I ran the below command
zip -r build.zip build/
```

Created a new script [`sync`](https://github.com/Acolyte-Luu/aws-bootcamp-cruddur-2023/blob/main/bin/frontend/sync) to sync all the local code changes with prod environment and [`sync.env.erb`](https://github.com/Acolyte-Luu/aws-bootcamp-cruddur-2023/blob/main/erb/sync.env.erb).Add this path `/tmp/changeset.json` in front of output changeset `SYNC_OUTPUT_CHANGESET_PATH=<%=  ENV['THEIA_WORKSPACE_ROOT'] %>`, or else it will not sync. You need to keep a `tmp` folder in your root directory for this to work.

### Added Sync Tool
Created a [`generate.env`](https://github.com/Acolyte-Luu/aws-bootcamp-cruddur-2023/blob/main/bin/frontend/generate-env) script to generate the frontend env variables for the sync tool. Installed `dotenv` and ran the `sync` script.
```
gem install dotenv
```
### Sync Stack
Created a `github/workflow` folder which was not fully implemented.

### Reconnect DB & Post Confirmation Lambda
Re-deployed the Service Stack in CFN. 
To connect to prod database make sure you have set the DB_SG_ID nad DB_SG_RULE_ID envars correctly and ran the [`aws-rds-update-sg-rule`](https://github.com/Acolyte-Luu/aws-bootcamp-cruddur-2023/blob/main/bin/rds/aws-rds-update-sg-rule) script
```
Then you will be able to connect to Prod Databse 
```
./bin/db/connect prod
```
Then ran migration file for prod environment with this command 
```
CONNECTION_URL=$PROD_CONNECTION_URL ./bin/db/migrate
```
Edit the `cruddur-post-confirmation` lambda function's env var -> `CONNECTION_URL` (updated endpoint URL) then create a security group for the lambda function. Set this security group in the configuration.


### Refactored JWT decorator & flask routes, fixed CI/CD configuration
Edited `ReplyFrom.js` -> `app.py` & `cognito-jwt-token.py` and was able to close reply window after clicking outside of the window - fixed this feature. Fixed CI/CD `buildspec.yaml` path in `config.toml` file. 


### Implemented Replies working & Error handling features
insert screenshot

**Error Handling Feature**
insert screenshot

**Cruds working from Alt account**
insert screenshot

Then we fixed **Date & Timezone**, **added back button & some more UI changes** and **fixed migrations** as well for Prod Environment.

### Cleanup Part
Created a **machine user** for dynamoDB access. Though we have admin access but, it was not accepting. Possibilities are that the same credentials might have gone out of date and were not useful?! Maybe, because of this reason there was a need to create this Machine user and update the `access_key` & `secrete_access_key` in parameter store. As we are using DynamoDB in backend and to get required permissions for dynamodb, this machineuser was been created.

**DynamoDBFullAccessPolicy**
```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Action": [
                "dynamodb:PutItem",
                "dynamodb:GetItem",
                "dynamodb:Scan",
                "dynamodb:Query",
                "dynamodb:UpdateItem",
                "dynamodb:DeleteItem",
                "dynamodb:BatchWriteItem"
            ],
            "Resource": "*",
            "Effect": "Allow"
        }
    ]
}
```

After all the changes I did a New Pull request and waited until I get a successful built CI/CD piepline.

insert screenshot






















