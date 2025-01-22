User Routes

  POST /user/signup
  Description : Register a new user.
  Request Body:
   {
    "username": "string",
    "password": "string"
  }
Responses:
  - 201 Created: User registered successfully.
  - 400 Bad Request: Validation error or username already exists.
  - 500 Internal Server Error: An error occurred during registration.

  POST /user/login
Description: Authenticate user and return a JWT.
Request Body: {
  "username" : "string",
  "password" : "string"
}
Responses:
200 OK: User logged in successfully, returns a JWT token.
400 Bad Request: Validation error or incorrect username/password.
500 Internal Server Error: An error occurred during login.

GET /user/favorites
Description: Retrieve user's favorite medicines (protected).
Responses:
200 OK: List of user's favorite medicines.
401 Unauthorized: Access denied, please login or signup.
500 Internal Server Error: An error occurred while retrieving favorites.

POST /user/favorites/:medicineId
Description: Add a medicine to favorites (protected).
Parameters:
medicineId (path parameter): The ID of the medicine to add to favorites.
Responses:
200 OK: Medicine added to favorites.
400 Bad Request: Invalid medicineId format.
404 Not Found: User not found.
500 Internal Server Error: An error occurred while adding the medicine to favorites.

DELETE /user/favorites/:medicineId
Description: Remove a medicine from favorites (protected).
Parameters:
medicineId (path parameter): The ID of the medicine to remove from favorites.
Responses:
200 OK: Medicine removed from favorites.
400 Bad Request: Invalid medicineId format.
404 Not Found: User not found.
500 Internal Server Error: An error occurred while removing the medicine from favorites.

Medicine Routes

GET /medicine?name=xyz
Description: Fetch medicines matching the search query.
Query Parameters:
name (string): The name of the medicine to search for.
Responses:
200 OK: List of medicines matching the search query.
400 Bad Request: Invalid search query.
500 Internal Server Error: An error occurred while searching for medicines.

GET /medicine/:id
Description: Fetch detailed information about a specific medicine.
Parameters:
id (path parameter): The ID of the medicine.
Responses:
200 OK: Details of the specified medicine.
400 Bad Request: Invalid id format.
404 Not Found: Medicine not found.
500 Internal Server Error: An error occurred while retrieving the medicine details.

Pharmacy Routes
GET /pharmacy/?medicineId=xyz
Description: Fetch pharmacies offering the specified medicine along with prices.
Query Parameters:
medicineId (string): The ID of the medicine to search for.
Responses:
200 OK: List of pharmacies that have the specified medicine.
400 Bad Request: medicineId is required or invalid format.
500 Internal Server Error: An error occurred while searching for pharmacies.

Default Route
GET /
Description: Default route to check if the API is running.
Responses:
200 OK: Welcome message.

note: each response is in the form of json 
