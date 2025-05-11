// What it does: A script to hash existing users' passwords and store them in the database,
// improving security even if existing users have plaintext passwords.

import mysql from "mysql2/promise"; // Import the MySQL library for promise-based database operations
import bcrypt from "bcrypt"; // Import bcrypt for hashing passwords
import dotenv from "dotenv"; // Import dotenv to load environment variables from a .env file

dotenv.config(); // Load environment variables from the .env file

// Create a connection pool for the MySQL database
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST, // MySQL host from environment variables
  user: process.env.MYSQL_USER, // MySQL user from environment variables
  password: process.env.MYSQL_PASSWORD, // MySQL password from environment variables
  database: process.env.MYSQL_DATABASE, // MySQL database name from environment variables
  waitForConnections: true, // Wait for connections to become available before rejecting
  connectionLimit: 10, // Maximum number of connections in the pool
  queueLimit: 0, // Unlimited queue length for waiting connections
});

// Function to hash user passwords
const hashUserPasswords = async () => {
  try {
    // Fetch all users from the database
    const [users] = await pool.query("SELECT * FROM users");

    // Iterate over each user
    for (const user of users) {
      // Hash the existing password using bcrypt with a salt rounds of 10
      const hashedPassword = await bcrypt.hash(user.password, 10);
      
      // Update the user's password in the database with the hashed password
      await pool.query("UPDATE users SET password = ? WHERE id = ?", [
        hashedPassword, // New hashed password
        user.id, // User ID for the update
      ]);
      // Log the email of the user whose password has been updated
      console.log(`Updated password for user ${user.email}`);
    }

    // Log a message indicating that all passwords have been updated
    console.log("All passwords have been updated.");
  } catch (error) {
    // Log any errors that occur during the process
    console.error("Error updating passwords:", error.message);
  } finally {
    // Close the database connection pool
    await pool.end();
  }
};

// Call the function to hash user passwords
hashUserPasswords();

