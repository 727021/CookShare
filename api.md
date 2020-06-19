# API Outline

The base path for all API requests is `/api`.

- [API Outline](#api-outline)
  - [Objects](#objects)
  - [Errors](#errors)
  - [Auth](#auth)
  - [User](#user)
  - [Recipe](#recipe)
  - [Cookbook](#cookbook)

## Objects

Some response data is in the form of an object, denoted by an object name enclosed in angled brackets, like `< Object >`.

| Object Name | Object Format                                                                                                                                                                                                                                                        |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| User        | `{_id: String, username: String, email: String, name: {first: String, last: String}, joined: Date, seen: Date, admin: Boolean}`                                                                                                                                      |
| Recipe      | `{_id: String, author: <User>, title: String, description: String, serving: {count: Number, size: Number, units: String}, ingredients: [{name: String, amount: Number, units: String}], steps: [String], images: [String]}`                                          |
| Unit        | `{measure: String, system: String, abbr: String, singular: String, plural: String}`                                                                                                                                                                                  |
| Cookbook    | `{_id: String, title: String, owner: <User>, shared: [{user: <User>, status: {requested: Boolean, invited: Boolean, accepted: Boolean, rejected: Boolean}}], recipes: [{recipe: <Recipe>, comments: [{_id: String, author: <User>, date: Date, message: String}]}]}` |

## Errors

Some response codes and responses are shared among different API endpoints:

| Status Code | Response Data     | Meaning                                               |
| ----------- | ----------------- | ----------------------------------------------------- |
| 422         | `{errors: Array}` | One or more problems with request parameters          |
| 409         | `{error: String}` | There was an error performing the requested action    |
| 401         | `{error: String}` | User isn't authorized to perform the requested action |
| 204         | None              | Requested action was performed, no data to return     |
| 501         | None              | API endpoint is not yet implemented                   |

## Auth

| Action                 | Method | Path                    | Params                                                  | Success Code | Response Data        | Comments                      |
| ---------------------- | ------ | ----------------------- | ------------------------------------------------------- | ------------ | -------------------- | ----------------------------- |
| Register an account    | POST   | `/auth`                 | email, username, firstname, lastname, password, confirm | 201          | `{username: String}` |                               |
| Login                  | PUT    | `/auth`                 | username, email, password                               | 200          | `<User>`             | May provide email or username |
| Logout                 | DELETE | `/auth`                 |                                                         | 204          |                      |                               |
| Request password reset | GET    | `/auth/password`        | email                                                   | 501          |                      | Not yet implemented           |
| Reset password         | PUT    | `/auth/password/:reset` | reset                                                   | 501          |                      | Not yet implemented           |

## User

| Action                       | Method | Path              | Params                    | Success Code | Response Data | Comments                      |
| ---------------------------- | ------ | ----------------- | ------------------------- | ------------ | ------------- | ----------------------------- |
| Get current user             | GET    | `/user`           |                           | 200          | `<User>`      |                               |
| Change password              | PUT    | `/user`           | password, confirm         | 204          |               |                               |
| List all users               | GET    | `/user/all`       |                           | 200          | `[<User>]`    |                               |
| List favorite recipes        | GET    | `/user/favorites` |                           | 200          | `[<Recipe>]`  |                               |
| Add favorite recipe          | POST   | `/user/favorites` | rid                       | 201          | `[<Recipe>]`  |                               |
| Remove favorite recipe       | DELETE | `/user/favorites` | rid                       | 200          | `[<Recipe>]`  |                               |
| Change a user's admin status | PUT    | `/user/admin`     | uid, admin                | 200          | `<User>`      |                               |
| Get user information         | GET    | `/user/:uid`      | uid                       | 200          | `<User>`      |                               |
| Delete user account          | DELETE | `/user`           | username, email, password | 204          |               | May provide email or username |

## Recipe

| Action                     | Method | Path            | Params                                                       | Success Code | Response Data | Comments                              |
| -------------------------- | ------ | --------------- | ------------------------------------------------------------ | ------------ | ------------- | ------------------------------------- |
| Get current user's recipes | GET    | `/recipe`       |                                                              | 200          | `[<Recipe>]`  |                                       |
| Get all recipes            | GET    | `/recipe/all`   |                                                              | 200          | `[<Recipe>]`  | Requires admin access                 |
| List all valid units       | GET    | `/recipe/units` |                                                              | 200          | `[<Unit>]`    |                                       |
| Get recipe information     | GET    | `/recipe/:rid`  | rid                                                          | 200          | `<Recipe>`    |                                       |
| Create a new recipe        | POST   | `/recipe`       | title, description, serving, ingredients, steps, images      | 201          | `<Recipe>`    | Expects images as multipart form data |
| Edit a recipe              | PUT    | `/recipe/:rid`  | rid, title, description, serving, ingredients, steps, images | 200          | `<Recipe>`    | Expects images as multipart form data |
| Delete a recipe            | DELETE | `/recipe/:rid`  | rid                                                          | 204          |               |                                       |

## Cookbook

| Action                               | Method | Path                                      | Params                 | Success Code | Response Data                                                                                            | Comments              |
| ------------------------------------ | ------ | ----------------------------------------- | ---------------------- | ------------ | -------------------------------------------------------------------------------------------------------- | --------------------- |
| List current user's cookbooks        | GET    | `/cookbook`                               |                        | 200          | `[<Cookbook>]`                                                                                           |                       |
| List all cookbooks                   | GET    | `/cookbook/all`                           |                        | 200          | `[<Cookbook>]`                                                                                           | Requires admin access |
| Get cookbook information             | GET    | `/cookbook/:cid`                          | cid                    | 200          | `<Cookbook>`                                                                                             |                       |
| Create a new cookbook                | POST   | `/cookbook`                               | title                  | 201          | `<Cookbook>`                                                                                             |                       |
| Edit cookbook title                  | PUT    | `/cookbook/:cid`                          | cid, title             | 200          | `<Cookbook>`                                                                                             |                       |
| Delete a cookbook                    | DELETE | `/cookbook/:cid`                          | cid                    | 204          |                                                                                                          |                       |
| Add a recipe to a cookbook           | POST   | `/cookbook/:cid/recipe/:rid`              | cid, rid               | 201          | `<Cookbook>`                                                                                             |                       |
| Remove a recipe from a cookbook      | DELETE | `/cookbook/:cid/recipe/:rid`              | cid, rid               | 200          | `<Cookbook>`                                                                                             |                       |
| Get recipe comments                  | GET    | `/cookbook/:cid/recipe/:rid/comment`      | cid, rid               | 200          | `[{_id: String, author: <User>, date: Date, message: String}]`                                           |                       |
| Add a comment to a recipe            | POST   | `/cookbook/:cid/recipe/:rid/comment`      | cid, rid, message      | 201          | `[{_id: String, author: <User>, date: Date, message: String}]`                                           |                       |
| Edit a comment on a recipe           | PUT    | `/cookbook/:cid/recipe/:rid/comment/:mid` | cid, rid, mid, message | 200          | `[{_id: String, author: <User>, date: Date, message: String}]`                                           |                       |
| Delete a comment on a recipe         | DELETE | `/cookbook/:cid/recipe/:rid/comment/:mid` | cid, rid, mid          | 204          |                                                                                                          |                       |
| Get cookbook sharing details         | GET    | `/cookbook/:cid/share`                    | cid                    | 200          | `[{user: <User>, status: {requested: Boolean, invited: Boolean, accepted: Boolean, rejected: Boolean}}]` |                       |
| Share a cookbook with another user   | POST   | `/cookbook/:cid/share/:uid`               | cid, uid, status       | 201          | `[{user: <User>, status: {requested: Boolean, invited: Boolean, accepted: Boolean, rejected: Boolean}}]` |                       |
| Change another user's sharing status | PUT    | `/cookbook/:cid/share/:uid`               | cid, uid, status       | 200          | `[{user: <User>, status: {requested: Boolean, invited: Boolean, accepted: Boolean, rejected: Boolean}}]` |                       |
| Remove another user from a cookbook  | DELETE | `/cookbook/:cid/share/:uid`               | cid, uid               | 204          |                                                                                                          |                       |
