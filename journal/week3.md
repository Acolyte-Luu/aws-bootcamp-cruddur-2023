# Week 3 — Decentralized Authentication

## Required Homework
1. [Setup Cognito User Pool](#setup-cognito-user-pool)
2. [Instrument Amplify](#instrument-amplify)
3. [Implement Custom Signin Page](#implement-custom-signin-page)
4. [Implement Custom Signup Page](#implement-custom-signup-page)
5. [Implement Custom Confirmation Page](#implement-custom-confirmation-page)
6. [Implement Custom Recovery Page](#implement-custom-recovery-page)
7. [Verify JWT token server side](#verify-jwt-token-server-side)
8. [Create Cruddur CSS theme](create-cruddur-css-theme)
9. [Watched Ashish's Week 3 - Decenteralized Authentication](https://www.youtube.com/watch?v=tEJIeII66pY&list=PLBfufR7vyJJ7k25byhRXJldB5AiwgNnWv&index=39)


## Setup Cognito User Pool
This part was completed by following along the [main lesson video for week 3](https://www.youtube.com/watch?v=9obl7rVgzJw&list=PLBfufR7vyJJ7k25byhRXJldB5AiwgNnWv&index=40):

Then create a test user that will be used to implement and test authentication and authorization for this stage of the Cruddur project

## Instrument Amplify
We use Amplify Identity SDK library to use Cognito User Pool.

1. add code in App.js as in Andrew's instructions but we don't need identity pool!
```js
import { Amplify } from 'aws-amplify';

Amplify.configure({
  "AWS_PROJECT_REGION": process.env.REACT_APP_AWS_PROJECT_REGION,
  "aws_cognito_identity_pool_id": process.env.REACT_APP_AWS_COGNITO_IDENTITY_POOL_ID,
  "aws_cognito_region": process.env.REACT_APP_AWS_COGNITO_REGION,
  "aws_user_pools_id": process.env.REACT_APP_AWS_USER_POOLS_ID,
  "aws_user_pools_web_client_id": process.env.REACT_APP_CLIENT_ID,
  "oauth": {},
  Auth: {
    // We are not using an Identity Pool
    // identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID, // REQUIRED - Amazon Cognito Identity Pool ID
    region: process.env.REACT_APP_AWS_PROJECT_REGION,           // REQUIRED - Amazon Cognito Region
    userPoolId: process.env.REACT_APP_AWS_USER_POOLS_ID,         // OPTIONAL - Amazon Cognito User Pool ID
    userPoolWebClientId: process.env.REACT_APP_CLIENT_ID,   // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
  }
});
```
2. add these env variables to frontend-js service in docker-compose.yml
```yml
      REACT_APP_AWS_PROJECT_REGION: "${AWS_DEFAULT_REGION}"
      REACT_APP_AWS_COGNITO_REGION: "${AWS_DEFAULT_REGION}"
      REACT_APP_AWS_USER_POOLS_ID: "<from AWS Console>"
      REACT_APP_CLIENT_ID: "<from AWS Console, App Intergration tab>"
```
3. set password for the created Cognito user in CLI:
```
aws cognito-idp admin-set-user-password \
  --user-pool-id <your-user-pool-id> \
  --username <username> \
  --password <password> \
  --permanent
```

## Implement Custom Signin Page

1. change cookie authentication to Amplify in SigninPage:

frontend-react-js/src/pages/SigninPage.js from 
```import Cookies from 'js-cookie'```
to
``` import { Auth } from 'aws-amplify'; ```

2. change block from this:
```python
    event.preventDefault();
    setErrors('')
    console.log('onsubmit')
    if (Cookies.get('user.email') === email && Cookies.get('user.password') === password){
      Cookies.set('user.logged_in', true)
      window.location.href = "/"
    } else {
      setErrors("Email and password is incorrect or account doesn't exist")
```
to this:
```python
    setErrors('')
    event.preventDefault();
    Auth.signIn(email, password)
    .then(user => {
      localStorage.setItem("access_token", user.signInUserSession.accessToken.jwtToken)
      window.location.href = "/"
    })
    .catch (error =>  { catch (error) {
      if (error.code == 'UserNotConfirmedException') {
        window.location.href = "/confirm"
      }
      setErrors(error.message)
```

## Implement Custom Signup Page
implementation in this [commit](https://github.com/Acolyte-Luu/aws-bootcamp-cruddur-2023/commit/5f51d387bef37efb49a0470d919bc2df8cd22a24)

## Implement Custom Confirmation Page
implementation in this [commit](https://github.com/Acolyte-Luu/aws-bootcamp-cruddur-2023/commit/5f51d387bef37efb49a0470d919bc2df8cd22a24)

## Implement Custom Recovery Page
implementation in this [commit](https://github.com/Acolyte-Luu/aws-bootcamp-cruddur-2023/commit/5f51d387bef37efb49a0470d919bc2df8cd22a24)

## Verify JWT token server side
implementation in this [commit] (https://github.com/Acolyte-Luu/aws-bootcamp-cruddur-2023/commit/e658cd1a2abdbbee7b738b916c8bfcb8b190a321)


## Create Cruddur CSS theme
Copied Andrew's changes from his repository
