# Simple Bookstore app using Node.js and MySQL

This repository contains files for a Node.js web application designed for managing a bookstore or library database. The application is built with Node.js and Express.js, and it utilizes MySQL for data storage. It includes functionality for user authentication, book CRUD operations, and dynamic page rendering using EJS templates.

## Features

- User Authentication: Users can sign up, log in, and log out securely.
- Book Management: Users can browse, search, add, update, and delete books from the database.
- Dynamic Page Rendering: EJS templates are used to render dynamic content on the client side.
- MySQL Integration: Data is stored and retrieved using a MySQL database.

## Installation

To run this application locally, follow these steps:

1. Clone this repository to your local machine: `git clone https://github.com/Hackhoven/bookstore-nodejs-mysql.git`
2. Navigate to the project directory: `cd bookstore-nodejs-mysql/`
3. Install dependencies: `npm install`
4. Set up your MySQL database:
- Ensure MySQL server is running on your machine.
- Run the `book.sql` script to create the database, necessary tables, and populate initial data. You can do this using MySQL command line or any MySQL client tool.
  ```sql
  mysql -u <username> -p < book.sql
  ```
  Replace `<username>` with your MySQL username.
5. Configure the database connection in the `.env` file.
6. Start the server: `npm start`
7. Open your web browser and visit `http://localhost:3000` to access the application.

## Usage

- Register a new user account or log in with existing credentials.
- Browse, search, add, update, and delete books from the bookstore inventory.
- Log out when finished.

## Contributing

Contributions are welcome! If you'd like to contribute to this project, please fork the repository and submit a pull request with your changes.

-- made by Hackhoven !




