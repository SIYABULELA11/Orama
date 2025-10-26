const db = require("../config/db"); // relative path, CommonJS

// Get all users
const getAllUsers = (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// Add a new user
const addUser = (req, res) => {
  const { name, email } = req.body;
  const query = "INSERT INTO users (name, email) VALUES (?, ?)";
  db.query(query, [name, email], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "User added", id: results.insertId });
  });
};

module.exports = { getAllUsers, addUser }; // CommonJS export
