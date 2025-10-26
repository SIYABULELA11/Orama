const db = require("../config/db");

// Get all study plans for a specific student
const getAllPlans = (req, res) => {
  const { studentNumber } = req.query;
  
  if (!studentNumber) {
    return res.status(400).json({ error: "Student number is required" });
  }
  
  console.log('Fetching study plans for student:', studentNumber);
  
  db.query(
    "SELECT * FROM study_plan WHERE student_number = ? ORDER BY due_date ASC",
    [studentNumber],
    (err, results) => {
      if (err) {
        console.error('Error fetching study plans:', err);
        return res.status(500).json({ error: err.message });
      }
      console.log(`Found ${results.length} study plans for student ${studentNumber}`);
      res.json(results);
    }
  );
};

// Add a new study plan
const addPlan = (req, res) => {
  const { studentNumber, subject, topic, duration, priority, status, dueDate, notes } = req.body;
  
  console.log('Adding study plan - Received body:', req.body);
  
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
      INSERT INTO study_plan (student_number, subject, topic, duration, priority, status, due_date, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    db.query(
      query,
      [studentNumber, subject, topic, duration, priority, status, dueDate, notes],
      (err, results) => {
        if (err) {
          console.error('Error adding study plan:', err);
          return res.status(500).json({ error: err.message });
        }
        console.log('Study plan added successfully, ID:', results.insertId);
        res.json({ message: "Study plan added", id: results.insertId });
      }
    );
  });
};

// Update a study plan (status, or any field)
const updatePlan = (req, res) => {
  const { id } = req.params;
  const { studentNumber, subject, topic, duration, priority, status, dueDate, notes } = req.body;
  
  console.log('=== UPDATE STUDY PLAN DEBUG ===');
  console.log('Plan ID:', id);
  console.log('Student Number:', studentNumber);
  console.log('Received body:', req.body);
  
  if (!studentNumber) {
    return res.status(400).json({ error: "Student number is required" });
  }
  
  const query = `
    UPDATE study_plan
    SET subject = ?, topic = ?, duration = ?, priority = ?, status = ?, due_date = ?, notes = ?
    WHERE id = ? AND student_number = ?
  `;
  
  db.query(
    query,
    [subject, topic, duration, priority, status, dueDate, notes, id, studentNumber],
    (err, results) => {
      if (err) {
        console.error('Error updating study plan:', err);
        return res.status(500).json({ error: err.message });
      }
      
      console.log('Update results:', results);
      console.log('Rows affected:', results.affectedRows);
      console.log('=== END UPDATE DEBUG ===');
      
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "Study plan not found or unauthorized" });
      }
      
      res.json({ message: "Study plan updated", affectedRows: results.affectedRows });
    }
  );
};

// Delete a study plan
const deletePlan = (req, res) => {
  const { id } = req.params;
  const { studentNumber } = req.query;
  
  console.log('Deleting study plan ID:', id, 'for student:', studentNumber);
  
  if (!studentNumber) {
    return res.status(400).json({ error: "Student number is required" });
  }
  
  db.query("DELETE FROM study_plan WHERE id = ? AND student_number = ?", [id, studentNumber], (err, results) => {
    if (err) {
      console.error('Error deleting study plan:', err);
      return res.status(500).json({ error: err.message });
    }
    
    console.log('Delete results - Rows affected:', results.affectedRows);
    
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Study plan not found or unauthorized" });
    }
    
    res.json({ message: "Study plan deleted", affectedRows: results.affectedRows });
  });
};

module.exports = { getAllPlans, addPlan, updatePlan, deletePlan };