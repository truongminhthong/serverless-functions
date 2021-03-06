# Serverless Nodejs Rest API with TypeScript And DynamoDB

This is simple REST API example for AWS Lambda By Serverless framework with TypeScript and DynamoDB.
  
## Use Cases

- Serverless Framework - Lamda

- CRUD

- Store data in DynamoDB

- Unit Test Jest.

- CI/CD and support multi-stage deployments with Serverless Dashboard

## Project structure
The project code base is mainly located within the `src` folder. This folder is divided in:

- `libs` - containing shared code base between your lambdas
- `functions` - containing the code base of each function and configuration for your lambda functions

```
.
├── src
│   ├── functions
│   │   └── users
|   |        ├── request            # Requests model
|   |        |     ├── get-user.request.ts
|   |        |     ├── register.request.ts
|   |        |     └── update.request.ts
|   |        |
│   │        ├── handler.ts         # `users` lambda function handler
│   │        ├── routing.yml        # `users` lambda routing
|   |        ├── user.model.ts      # `users` model
│   │        └── user.service.ts    # `users` service
│   └── libs                        # shared code base                 
│        ├── api-response.ts        # format response for functions
|        ├── base.model.ts          # base model
|        ├── dynamo-hepler.ts       # dynamodb helpler
|        ├── utils.ts               # util services
|        └── validate.ts            # validate object service
|   
|                                    
├── package.json
├── serverless.yml                     
├── README.md
├── tsconfig.build.json                       
└── tsconfig.json     
```

## Deploy

```
npm run deploy

```

### To Test It Locally

- Run `npm install` to install all the necessary dependencies.
- Run `npm run local` use serverless offline to test locally.

## Unitest

```
npm run test

npm run test:cov

```

## List enpoint

```
GET - https://qmpxz95yk5.execute-api.us-east-1.amazonaws.com/dev/users
GET - https://qmpxz95yk5.execute-api.us-east-1.amazonaws.com/dev/users/{id}
POST - https://qmpxz95yk5.execute-api.us-east-1.amazonaws.com/dev/users
PUT - https://qmpxz95yk5.execute-api.us-east-1.amazonaws.com/dev/users/{id}
DELETE - https://qmpxz95yk5.execute-api.us-east-1.amazonaws.com/dev/users/{id}

```

## CI/CD & multi-stage deployments
* Created 2 environments: `dev` and `prod`
![alt text](https://github.com/truongminhthong/serverless-functions/blob/dev/images/multi-stage.PNG)

* Auto deploy when push to `dev` or `prod` branch:
![alt text](https://github.com/truongminhthong/serverless-functions/blob/dev/images/ci-cd.PNG)
