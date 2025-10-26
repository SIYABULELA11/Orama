const db = require("../config/db");

// Get all deadlines
const getAllDeadlines = (req, res) => {
  db.query("SELECT * FROM deadlines ORDER BY due_date ASC, due_time ASC", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// Add a new deadline
const addDeadline = (req, res) => {
  const { title, subject, dueDate, dueTime, priority, type, status, description } = req.body;
  const query = `
    INSERT INTO deadlines (title, subject, due_date, due_time, priority, type, status, description)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(query, [title, subject, dueDate, dueTime, priority, type, status || 'pending', description || ''], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Deadline added", id: results.insertId });
  });
};

// Update a deadline (for status changes like accept/reschedule)
const updateDeadline = (req, res) => {
  const { id } = req.params;
  const { status, dueDate, dueTime } = req.body;
  
  let query = "UPDATE deadlines SET ";
  let params = [];
  
  if (status !== undefined) {
    query += "status = ?";
    params.push(status);
  }
  
  if (dueDate !== undefined) {
    if (params.length > 0) query += ", ";
    query += "due_date = ?";
    params.push(dueDate);
  }
  
  if (dueTime !== undefined) {
    if (params.length > 0) query += ", ";
    query += "due_time = ?";
    params.push(dueTime);
  }
  
  query += " WHERE id = ?";
  params.push(id);
  
  db.query(query, params, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Deadline updated" });
  });
};

// Delete a deadline
const deleteDeadline = (req, res) => {
  const { id } = req.params;
  
  db.query("DELETE FROM deadlines WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Deadline deleted" });
  });
};

module.exports = { getAllDeadlines, addDeadline, updateDeadline, deleteDeadline };