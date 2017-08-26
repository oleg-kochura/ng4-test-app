# server

Install dependencies:

    $ npm install

Run the app:

    $ npm start

## Usage

```
curl -v -X POST 'http://localhost:4042/api/v1/auth/token?grant_type=password&client_id=a823jkas87y3kjakjhsd&&client_secret=dksu287aokjfaouiusdia7127a5skd&username=email@example.com&password=password'
// 200 OK
// {
//     "access_token": "51f60ebc0e808c6f8574042a541e341e9d97257b93c5d2eb266a9be3ab541086",
//     "expires_in": 3600,
//     "refresh_token": "026400fc11279bcde98d019f49d1a7e056a65893f5372a581f2697f65edbaff6"
// }
//
// 401 Unauthorized
// {
//     "error": "access_denied",
//     "error_description": "The resource owner or authorization server denied the request."
// }

curl -v -X GET 'http://localhost:4042/api/v1/profile' -H "Authorization: Bearer 4dd2aeb9037177c7634b07d023fa20d8ec79b895b583eb3e8bf9d1cdab2113d8"
// 200 OK
// {
//     "id": "b1a6b22b-7f09-41f8-944d-e7f180b4cd4c",
//     "email": "email@example.com",
//     "firstName": "First",
//     "lastName": "Last",
//     "website": "http://example.com",
//     "address": {
//         "city": "City",
//         "state": "State",
//         "zip": "ZIP"
//     },
//     "phone": "123123123",
//     "stars": 4,
//     "reviewsCount": 5,
//     "followersCount": 14
// }
//
// 401 Unauthorized
// {
//     "error": "invalid_request",
//     "error_description": "The request is missing a required parameter, includes an invalid parameter value, includes a parameter more than once, or is otherwise malformed."
// }

curl -v -X PATCH 'http://localhost:4042/api/v1/profile' -H "Authorization: Bearer 4dd2aeb9037177c7634b07d023fa20d8ec79b895b583eb3e8bf9d1cdab2113d8" -H "Content-Type: application/json" -d '{
  "firstName": "First",
  "lastName": "Last",
  "typeOfWork": "Web design",
  "website": "http://example.com",
  "address": {
    "city": "City",
    "state": "State",
    "zip": "ZIP"
  },
  "phone": "123123123"
}'
// 204 No Content
//
// 401 Unauthorized
// {
//     "error": "invalid_request",
//     "error_description": "The request is missing a required parameter, includes an invalid parameter value, includes a parameter more than once, or is otherwise malformed."
// }

curl -v -X PUT 'http://localhost:4042/api/v1/profile/changepassword' -H "Authorization: Bearer 4dd2aeb9037177c7634b07d023fa20d8ec79b895b583eb3e8bf9d1cdab2113d8" -H "Content-Type: application/json" -d '{
  "oldPassword": "password",
  "newPassword": "123456"
}'
// 204 No Content
//
// 400 Bad Request
// {
//     "error": "old_password_required",
//     "error_description": "Old password is required."
// }
//
// 400 Bad Request
// {
//     "error": "new_password_required",
//     "error_description": "New password is required."
// }
//
// 400 Bad Request
// {
//     "error": "incorrect_old_password",
//     "error_description": "Old password is incorrect."
// }
//
// 401 Unauthorized
// {
//     "error": "invalid_request",
//     "error_description": "The request is missing a required parameter, includes an invalid parameter value, includes a parameter more than once, or is otherwise malformed."
// }
```
