const db = require("../config/db");

// Get all reminders for a specific student
const getAllReminders = (req, res) => {
  const { studentNumber } = req.query;
  
  if (!studentNumber) {
    return res.status(400).json({ error: "Student number is required" });
  }
  
  console.log('Fetching reminders for student:', studentNumber);
  
  db.query(
    "SELECT * FROM reminders WHERE student_number = ? ORDER BY due_date ASC, due_time ASC",
    [studentNumber],
    (err, results) => {
      if (err) {
        console.error('Error fetching reminders:', err);
        return res.status(500).json({ error: err.message });
      }
      console.log(`Found ${results.length} reminders for student ${studentNumber}`);
      res.json(results);
    }
  );
};

// Add a new reminder
const addReminder = (req, res) => {
  const { studentNumber, title, description, dueDate, dueTime, priority, type, completed } = req.body;
  
  console.log('Adding reminder - Received body:', req.body);
  
  if (!studentNumber) {
    return res.status(400).json({ error: "Student number is required" });
  }
  
  // Check if profile exists
  db.query("SELECT student_number FROM profiles WHERE student_number = ?", [studentNumber], (err, profileResults) => {
    if (err) {
      console.error('Error checking profile:', err);
      return res.status(500).json({ error: err.message });
    }
    
    if (profileResults.length === 0) {
      return res.status(404).json({ error: "Profile not found. Please create a profile first." });
    }
    
    const query = `
      INSERT INTO reminders (student_number, title, description, due_date, due_time, priority, type, completed)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    db.query(
      query,
      [studentNumber, title, description, dueDate, dueTime, priority, type, completed || false],
      (err, results) => {
        if (err) {
          console.error('Error adding reminder:', err);
          return res.status(500).json({ error: err.message });
        }
        console.log('Reminder added successfully, ID:', results.insertId);
        res.json({ message: "Reminder added", id: results.insertId });
      }
    );
  });
};

// Update reminder by ID (full update)
const updateReminder = (req, res) => {
  const { id } = req.params;
  const { studentNumber, title, description, dueDate, dueTime, priority, type, completed } = req.body;
  
  console.log('=== UPDATE REMINDER DEBUG ===');
  console.log('Reminder ID:', id);
  console.log('Student Number:', studentNumber);
  console.log('Received body:', req.body);
  
  if (!studentNumber) {
    return res.status(400).json({ error: "Student number is required" });
  }
  
  const query = `
    UPDATE reminders 
    SET title=?, description=?, due_date=?, due_time=?, priority=?, type=?, completed=?
    WHERE id=? AND student_number=?
  `;
  
  db.query(
    query,
    [title, description, dueDate, dueTime, priority, type, completed, id, studentNumber],
    (err, results) => {
      if (err) {
        console.error('Error updating reminder:', err);
        return res.status(500).json({ error: err.message });
      }
      
      console.log('Update results:', results);
      console.log('Rows affected:', results.affectedRows);
      console.log('=== END UPDATE DEBUG ===');
      
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "Reminder not found or unauthorized" });
      }
      
      res.json({ message: "Reminder updated", affectedRows: results.affectedRows });
    }
  );
};

// Toggle completion (PATCH)
const toggleCompletion = (req, res) => {
  const { id } = req.params;
  const { studentNumber, completed } = req.body;
  
  console.log('Toggling completion for ID:', id, 'Student:', studentNumber, 'to:', completed);
  
  if (!studentNumber) {
    return res.status(400).json({ error: "Student number is required" });
  }
  
  const query = "UPDATE reminders SET completed=? WHERE id=? AND student_number=?";
  
  db.query(query, [completed, id, studentNumber], (err, results) => {
    if (err) {
      console.error('Error toggling completion:', err);
      return res.status(500).json({ error: err.message });
    }
    
    console.log('Toggle results - Rows affected:', results.affectedRows);
    
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Reminder not found or unauthorized" });
    }
    
    res.json({ message: "Completion status updated", affectedRows: results.affectedRows });
  });
};

// Delete reminder
const deleteReminder = (req, res) => {
  const { id } = req.params;
  const { studentNumber } = req.query;
  
  console.log('Deleting reminder ID:', id, 'for student:', studentNumber);
  
  if (!studentNumber) {
    return res.status(400).json({ error: "Student number is required" });
  }
  
  db.query("DELETE FROM reminders WHERE id=? AND student_number=?", [id, studentNumber], (err, results) => {
    if (err) {
      console.error('Error deleting reminder:', err);
      return res.status(500).json({ error: err.message });
    }
    
    console.log('Delete results - Rows affected:', results.affectedRows);
    
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Reminder not found or unauthorized" });
    }
    
    res.json({ message: "Reminder deleted", affectedRows: results.affectedRows });
  });
};

module.exports = { 
  getAllReminders, 
  addReminder, 
  updateReminder, 
  toggleCompletion, 
  deleteReminder 
};