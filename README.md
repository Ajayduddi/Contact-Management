## Contact Management Application

This project provides a React application for managing contacts, allowing users to add, view, update, and delete contact information.

### Project Overview

This is a contact management application built with React for a user-friendly experience. It offers functionalities to:

- **Add New Contacts:** Users can create new contact entries by providing essential details like name, email, phone number, company, and job title.

- **View Contacts:**  A comprehensive table displays all contacts with sorting and pagination options, making it easier to navigate through large contact lists.
- **Edit Contact Information:** Users can update existing contact information to maintain accurate and up-to-date records.
- **Delete Contacts:**  Unnecessary or duplicate entries can be removed to keep the contact list clean and organized.


## Technical Decisions

The project utilizes the following technologies:

* **React and React Router DOM:** Popular choices for building frontend single-page web applications.

* **Axios:** Manages HTTP requests for interacting with the backend API.
* **Singleton Pattern (loginService.js):** Ensures a single instance exists for handling authentication-related operations.
* **Protected Routes (AuthGuard.js):** Utilizes the `AuthGuard` component to verify user authentication before rendering protected routes. 

### Technical Decisions for the Backend : 

* **Express:**  Express is a minimal and flexible Node.js web application framework that offers a robust set of features for building scalable web and mobile applications, including routing, middleware support, and a rich ecosystem of associated libraries.
* **JWT (JSON Web Tokens):** Used for secure and stateless authentication. JWTs are signed tokens containing user information, which helps to authenticate the user on HTTP requests.
* **Passport.js:** A flexible and extensible authentication middleware for Node.js. It's used to implement the JWT strategy and handle user authentication.
* **Express-Validator:** This library is used to validate user input and ensure data integrity. It provides a flexible way to define validation rules for different fields.

* **Password Hashing:** Strong password hashing algorithms like bcrypt are used to store hashed passwords securely.
* **Input Validation:** Validating user input helps prevent SQL injection and other security vulnerabilities.
* **JWT Security:** JWTs are signed with a secret key to ensure their authenticity and integrity.


## Components


* **App.js:** The main application component that sets up routing using `BrowserRouter` from React Router DOM.
* **loginService.js:** A singleton class handling user login, signup, and authentication checks through API interactions.
* **contactService.js:** A singleton class handling adding new contacts, updating contacts, deleting contacts etc through API interactions.
* **api.js:** Defines constants for the backend API base URL and endpoint names.
* **authGuard.js:** A component verifying user authentication status using `loginService.isAuth`. It redirects users to the login page if unauthenticated before rendering protected routes.
* **signIn.js (pages/login):** The login page component for users to enter credentials.

* **signUp.js (pages/signup):** The signup page component for user registration.
* **dashboard.js (pages/dashboard) :** The dashboard component for displaying contacts and performing operations on data

## Prerequisites

* **Node.js and npm (or yarn):** Ensure you have the latest versions installed on your system.
* **A code editor:** Choose your preferred editor like Visual Studio Code, Sublime Text, or Atom.


## Setup Instructions

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/your-username/contact-management.git
   ```

2. **Install Dependencies:**
   ```bash
   cd frontend
   npm install 
   ```

   for backend
   ```bash 
   cd backend
   npm install
   ```
3. **Set up environment variables for backend**

    Create a `.env` file in the root of the project and add the necessary environment variables. For example:

    ```env
    PORT = 4000
    SALT_ROUNDS = 10
    JWT_SECRET = "this is the secret key"
    JWT_EXPIRES = 10d
    ```

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   This will typically start the development server on port 400(http://localhost:400).
- Copy the frontend development URL and update the `origin` and `Access-Control-Allow-Origin` sections in the `./src/app.js` file of the backend. After that restart the server.
 - Copy the backend development URL and update the `BASE_URL` section in `./src/constants/constant.js`. After that restart the server.

5. **Demo Login**
    ```text
    Email : admin@gmail.com
    Password : Admin@1234
    ```


## Database Choice

Here we choose Sqlite as a Database because 

* **Lightweight:** SQLite is a serverless database engine, making it ideal for small to medium-sized applications. It doesn't require a separate server process, simplifying deployment.
* **Easy to Use:** SQLite uses a simple file-based format for data storage. There's no complex configuration or setup needed.
* **Embedded RDBMS:** SQLite is embedded with a relational database management system (RDBMS) in the application itself and offers good performance for read/write operations on small to medium datasets,
* **Sufficient for Project Needs:** This project manages user data in a structured way. So, SQLite is great for handling structured data & queries, constraints, and ACID compliance.

Consider a more robust database solution like PostgreSQL or MySQL for more complex projects with high data volume or demanding performance needs.

### Database Schema

The project uses two tables in the SQLite database:

* **login:** This table stores user login credentials, including email, password (hashed), timestamps for creation and update.
* **user:** This table stores detailed user information like firstname, lastname, phone number, company, job title, along with created and updated timestamps.
* Creating Index for faster query performance

**Schema Script:**

```sql
CREATE TABLE IF NOT EXISTS login (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  firstname TEXT NOT NULL,
  lastname TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone_no TEXT NOT NULL,
  company TEXT NOT NULL,
  job_title TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_login_id_email ON login (id, email);
CREATE INDEX IF NOT EXISTS idx_user_id_FirstName ON user (id, firstname);
```



## API Endpoints:

**Contact Management:**

* **POST /contacts:**
  - Accepts a JSON object containing contact details (name, email, phone, company, job title).
  - Stores the new contact in the database.
  - Returns a success message or error message.

* **GET /contacts:**
  - Retrieves all contact entries from the database.
  - Returns a JSON array of contact objects.

* **PUT /contacts/:id:**
  - Accepts a JSON object with updated contact details and an `id` parameter.
  - Updates the contact with the specified ID in the database.
  - Returns a success message or error message.

* **DELETE /contacts/:id:**
  - Deletes the contact with the specified ID from the database.
  - Returns a success message or error message.

**Authentication:**

* **POST /login:**
  - Accepts username and password credentials.
  - Authenticates the user and generates a JWT token.
  - Returns the JWT token on successful authentication.

* **GET /is-auth:**
  - Requires a valid JWT token in the request header.
  - Verifies the token and returns user information or an error message.

* **POST /createUser:**
  - Accepts username and password as data.
  - Validate the data and store it in the database.
  - Returns the success message.


### Challenges Faced

* **Connecting SQLite Database**: I used the `sqlite3` library for configuring and performing operations with an sqLite database. However, my SQLite database is not mounted to the Express application. I referred to many websites and articles regarding this issue, and finally, I found a solution using `node:path` library to join my database path to the application

* **Creating Indexes**: I run the query to create the indexes after creating the model. The issue arose because the table name was not included; I assigned the table name to `model.name` only after the table was successfully created. However, my index creation query was sent to the execution stack before the table creation was complete. I discovered this issue while debugging my application. I resolved it by ensuring that the index creation query runs only after the successful execution of the table creation and the assignment of the name to `model.name`.