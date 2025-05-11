// Role: This file is responsible for setting up an Express server and defining API endpoints,
// such as user registration, login, and information update.

// ===== Importing packages ===== //
import dotenv from "dotenv"; // Import dotenv for managing environment variables
dotenv.config(); // Load environment variables from .env file
import express from "express"; // Import the Express framework for building web applications
import cors from "cors"; // Import CORS middleware for handling Cross-Origin Resource Sharing
import mysql from "mysql2/promise"; // Import the promise-based version of MySQL for database operations
import bcrypt from "bcrypt"; // Import bcrypt for hashing passwords securely
import axios from "axios"; // Import axios for making HTTP requests
import authRoutes from "./routes/auth.js"; // Import authentication routes

const app = express(); // Create an instance of the Express application
app.use(express.json()); // Middleware to parse JSON request bodies

// ====== Middleware ====== //
app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from the frontend application at this origin
  })
);

app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded data

// Create a connection pool for the MySQL database
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST, // MySQL host from environment variables
  user: process.env.MYSQL_USER, // MySQL user from environment variables
  password: process.env.MYSQL_PASSWORD, // MySQL password from environment variables
  database: process.env.MYSQL_DATABASE, // MySQL database name from environment variables
  waitForConnections: true, // Enable waiting for connections to be available
  connectionLimit: 10, // Maximum number of connections in the pool
  queueLimit: 0, // Unlimited queue for waiting connections
});

// User registration API endpoint
app.post("/api/register", async (req, res) => {
  const { email, password } = req.body; // Extract email and password from request body

  // Validate input
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." }); // Return error if validation fails
  }

  try {
    // Check if the user already exists in the database
    const [existingUser] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (existingUser.length > 0) { // If user exists, return conflict status
      return res
        .status(409)
        .json({
          message: "Email already exists. Please use a different email.",
        });
    }

    // Hash the password using bcrypt
    const saltRounds = 10; // Define the number of salt rounds for hashing
    const hash = await bcrypt.hash(password, saltRounds); // Hash the password

    // Save the new user to the database
    await pool.query("INSERT INTO users (email, password) VALUES (?, ?)", [
      email,
      hash,
    ]);
    res.status(201).json({ message: "User registered successfully!" }); // Return success response
  } catch (error) {
    console.error("Error during registration:", error.message); // Log error message
    res.status(500).json({ message: "Server error during registration." }); // Return server error
  }
});

// User login API endpoint
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body; // Extract email and password from request body

    // Validate input
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
    }

    try {
        // Query the database for the user
        const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        
        if (users.length === 0) { // If no user found, return unauthorized status
            console.log(`Login attempt with invalid email: ${email}`);
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const user = users[0]; // Get the first user from the result
        const isPasswordValid = await bcrypt.compare(password, user.password); // Compare password with hashed password
        
        if (!isPasswordValid) { // If password does not match, return unauthorized status
            console.log(`Login attempt with invalid password for email: ${email}`);
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        // Return success response with user information
        res.json({ message: 'Login successful!', user: { id: user.id, email: user.email } });
    } catch (error) {
        console.error('Error during login:', error); // Log error message
        res.status(500).json({ message: 'Server error during login.' }); // Return server error
    }
});

// PATCH API endpoint for updating user information
app.patch("/api/users/:id", async (req, res) => {
  const userId = req.params.id; // Get user ID from URL parameters
  const { email, password } = req.body; // Extract email and password from request body

  // Validate input
  if (!email && !password) {
    return res
      .status(400)
      .json({
        message:
          "At least one field (email or password) is required for update.",
      });
  }

  try {
    const updates = []; // Array to hold update queries
    const parameters = []; // Array to hold parameters for the query

    if (email) { // If email is provided, add to updates
      updates.push("email = ?");
      parameters.push(email);
    }

    if (password) { // If password is provided, hash it and add to updates
      const saltRounds = 10;
      const hash = await bcrypt.hash(password, saltRounds); // Hash the new password
      updates.push("password = ?");
      parameters.push(hash);
    }

    // Update the user in the database
    parameters.push(userId); // Add user ID to parameters
    await pool.query(
      `UPDATE users SET ${updates.join(", ")} WHERE id = ?`,
      parameters
    );

    res.status(200).json({ message: "User updated successfully!" }); // Return success response
  } catch (error) {
    console.error("Error during user update:", error.message); // Log error message
    res.status(500).json({ message: "Server error during user update." }); // Return server error
  }
});

// Check if the MySQL server connection works
try {
  const connection = await pool.getConnection(); // Attempt to get a connection from the pool
  console.log("MySQL connected..."); // Log success message
  connection.release(); // Release the connection back to the pool
} catch (err) {
  console.error("MySQL connection error:", err); // Log connection error
}

// Load the external API URL from environment variables
const VITE_API_URL = process.env.VITE_API_URL;

//===== API Endpoint for Books ===== //
app.get("/api/books", async (req, res) => {
  try {
    const response = await axios.get(VITE_API_URL); // Make a request to the external API
    res.json(response.data); // Send the data back to the client
  } catch (error) {
    console.error("Error fetching books:", error.message); // Log error message
    res.status(500).json({ message: "Error fetching books." }); // Return server error
  }
});

//===== API Endpoint for Logo ===== //
app.get("/api/logo", (req, res) => {
  // Log the logo URL for debugging
  // console.log("Logo URL:", process.env.REACT_APP_LOGO_URL); // Debug log
  res.json({ logoUrl: process.env.REACT_APP_LOGO_URL }); // Return the logo URL as JSON
});

// Start the server and listen for incoming requests
app
  .listen(process.env.PORT, () => {
    console.log(`Server listening at http://localhost:${process.env.PORT}`); // Log server start message
  })
  .on("error", (error) => {
    console.log("Server error:", error); // Log server error if it occurs
  });
