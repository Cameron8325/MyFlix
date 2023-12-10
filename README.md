# MyFlix Server Side Application

This is the server side application for MyFlix, a movie database application. It includes the backend API for managing users, movies, and user interactions.

## Technologies Used

- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework for Node.js
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling for Node.js
- **Passport.js**: Authentication middleware for Node.js
- **JWT (JSON Web Tokens)**: Authentication strategy
- **Cors**: Cross-Origin Resource Sharing middleware
- **Body-parser**: Request body parsing middleware
- **Morgan**: HTTP request logger middleware

## Installation

1. Clone the repository.
2. Install dependencies using `npm install`.
3. Set up your MongoDB connection URI in the `process.env.CONNECTION_URI` variable.
4. Run the application with `npm start`.

## API Endpoints

### Movies

#### Get All Movies

- **Endpoint**: `GET /movies`
- Retrieves a list of all movies.

#### Get Movie by Title

- **Endpoint**: `GET /movies/:title`
- Retrieves data about a single movie by its title.

### Users

#### Register a New User

- **Endpoint**: `POST /register`
- Allows users to register by providing their information in the request body.

#### Update User Information

- **Endpoint**: `PUT /users/:Username`
- Allows users to update their information. Provide the updated user data in the request body.

#### Add Movie to User's Favorites

- **Endpoint**: `POST /users/:Username/movies/:MovieID`
- Allows users to add a movie to their list of favorite movies.

#### Remove Movie from User's Favorites

- **Endpoint**: `DELETE /users/:Username/movies/:MovieID`
- Allows users to remove a movie from their list of favorite movies.

#### Deregister User

- **Endpoint**: `DELETE /users/:Username`
- Allows users to deregister. No request body is required.

### Other Endpoints

- **Homepage**: `GET /`
  - Returns a welcome message.

## Error Handling

In case of errors, the server will respond with appropriate error messages and status codes. Additionally, detailed error logs are available in the `log.txt` file.

## Authentication

Authentication is implemented using JWT (JSON Web Tokens). Users can log in using the `/login` endpoint, and subsequent requests requiring authentication should include the JWT token in the authorization header.

## HTML Documentation

For a more visual representation of the API, you can check the documentation.html provided.

## Author

Micahel Cameron Smith

---

Feel free to customize the documentation further based on your preferences and additional information. Good luck with your MyFlix application!

---

## Contributing

If you would like to contribute to my knowledge and help me learn, I welcome your input and suggestions. Feel free to reach out and share your insights, feedback, or ideas for improvement. Together, we can enhance this project and continue to learn and grow in the field of web development.

---
