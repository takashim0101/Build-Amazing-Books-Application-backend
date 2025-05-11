import express from 'express'; // Import the Express framework for building web applications
import bcrypt from 'bcrypt'; // Import bcrypt for hashing and comparing passwords securely
import mysql from 'mysql2/promise'; // Import the promise-based version of MySQL for database operations

const router = express.Router(); // Create a new router instance for handling routes

// Create a connection pool for the MySQL database
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST, // MySQL host from environment variables
  user: process.env.MYSQL_USER, // MySQL user from environment variables
  password: process.env.MYSQL_PASSWORD, // MySQL password from environment variables
  database: process.env.MYSQL_DATABASE, // MySQL database name from environment variables
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body; // Extract email and password from request body

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." }); // Return error if validation fails
  }

  try {
    // Fetch user from the database based on the provided email
    const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    const user = users[0]; // Get the first user from the result

    // If no user is found, return unauthorized status
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Compare the provided password with the hashed password stored in the database
    const isMatch = await bcrypt.compare(password, user.password);
    // If the password does not match, return unauthorized status
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // If login is successful, respond with success message
    res.status(200).json({ message: "Login successful!" });
  } catch (error) {
    // Log any errors that occur during the process
    console.error("Error during login:", error.message);
    // Return server error response
    res.status(500).json({ message: "Server error during login.", error: error.message });
  }
});

export default router; // Export the router for use in other parts of the application

