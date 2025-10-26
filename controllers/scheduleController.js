const db = require("../config/db");

// Get all schedule events for a specific student
const getAllScheduleEvents = (req, res) => {
  const { studentNumber } = req.query;
  
  if (!studentNumber) {
    return res.status(400).json({ error: "Student number is required" });
  }
  
  console.log('Fetching schedule events for student:', studentNumber);
  
  db.query(
    "SELECT * FROM schedule_events WHERE student_number = ? ORDER BY year ASC, month ASC, date ASC",
    [studentNumber],
    (err, results) => {
      if (err) {
        console.error('Error fetching schedule events:', err);
        return res.status(500).json({ error: err.message });
      }
      console.log(`Found ${results.length} schedule events for student ${studentNumber}`);
      res.json(results);
    }
  );
};

// Add a new schedule event
const addScheduleEvent = (req, res) => {
  const { 
    studentNumber, 
    title, 
    date, 
    month, 
    year, 
    time, 
    type, 
    color, 
    location, 
    isRecurring, 
    recurringType 
  } = req.body;
  
  console.log('Adding schedule event - Received body:', req.body);
  
  if (!studentNumber) {
    return res.status(400).json({ error: "Student number is required" });
  }
  
  if (!title || date === undefined || month === undefined || year === undefined) {
    return res.status(400).json({ error: "Title, date, month, and year are required" });
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
      INSERT INTO schedule_events 
      (student_number, title, date, month, year, time, type, color, location, is_recurring, recurring_type)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    db.query(
      query,
      [studentNumber, title, date, month, year, time, type, color, location, isRecurring || false, recurringType],
      (err, results) => {
        if (err) {
          console.error('Error adding schedule event:', err);
          return res.status(500).json({ error: err.message });
        }
        console.log('Schedule event added successfully, ID:', results.insertId);
        res.json({ message: "Schedule event added", id: results.insertId });
      }
    );
  });
};

// Update schedule event by ID
const updateScheduleEvent = (req, res) => {
  const { id } = req.params;
  const { 
    studentNumber, 
    title, 
    date, 
    month, 
    year, 
    time, 
    type, 
    color, 
    location, 
    isRecurring, 
    recurringType 
  } = req.body;
  
  console.log('=== UPDATE SCHEDULE EVENT DEBUG ===');
  console.log('Event ID:', id);
  console.log('Student Number:', studentNumber);
  console.log('Received body:', req.body);
  
  if (!studentNumber) {
    console.log('ERROR: Student number is missing');
    return res.status(400).json({ error: "Student number is required" });
  }
  
  const query = `
    UPDATE schedule_events 
    SET title=?, date=?, month=?, year=?, time=?, type=?, color=?, location=?, is_recurring=?, recurring_type=?
    WHERE id=? AND student_number=?
  `;
  
  db.query(
    query,
    [title, date, month, year, time, type, color, location, isRecurring, recurringType, id, studentNumber],
    (err, results) => {
      if (err) {
        console.error('Error updating schedule event:', err);
        return res.status(500).json({ error: err.message });
      }
      
      console.log('Update results:', results);
      console.log('Rows affected:', results.affectedRows);
      console.log('=== END UPDATE DEBUG ===');
      
      if (results.affectedRows === 0) {
        console.log('ERROR: No rows were updated - event not found or student number mismatch');
        return res.status(404).json({ error: "Schedule event not found or unauthorized" });
      }
      
      res.json({ message: "Schedule event updated", affectedRows: results.affectedRows });
    }
  );
};

// Delete schedule event
const deleteScheduleEvent = (req, res) => {
  const { id } = req.params;
  const { studentNumber } = req.query;
  
  console.log('=== DELETE SCHEDULE EVENT DEBUG ===');
  console.log('Deleting event ID:', id, 'for student:', studentNumber);
  
  if (!studentNumber) {
    console.log('ERROR: Student number is missing from query');
    return res.status(400).json({ error: "Student number is required" });
  }
  
  db.query("DELETE FROM schedule_events WHERE id=? AND student_number=?", [id, studentNumber], (err, results) => {
    if (err) {
      console.error('Error deleting schedule event:', err);
      return res.status(500).json({ error: err.message });
    }
    
    console.log('Delete results - Rows affected:', results.affectedRows);
    console.log('=== END DELETE DEBUG ===');
    
    if (results.affectedRows === 0) {
      console.log('ERROR: No rows were deleted');
      return res.status(404).json({ error: "Schedule event not found or unauthorized" });
    }
    
    res.json({ message: "Schedule event deleted", affectedRows: results.affectedRows });
  });
};

// Get schedule events for a specific date range (optional - for optimization)
const getScheduleEventsByDateRange = (req, res) => {
  const { studentNumber, startYear, startMonth, endYear, endMonth } = req.query;
  
  if (!studentNumber) {
    return res.status(400).json({ error: "Student number is required" });
  }
  
  console.log('Fetching schedule events for date range:', { studentNumber, startYear, startMonth, endYear, endMonth });
  
  const query = `
    SELECT * FROM schedule_events 
    WHERE student_number = ? 
    AND ((year > ? OR (year = ? AND month >= ?))
    AND (year < ? OR (year = ? AND month <= ?)))
    ORDER BY year ASC, month ASC, date ASC
  `;
  
  db.query(
    query,
    [studentNumber, startYear, startYear, startMonth, endYear, endYear, endMonth],
    (err, results) => {
      if (err) {
        console.error('Error fetching schedule events by date range:', err);
        return res.status(500).json({ error: err.message });
      }
      console.log(`Found ${results.length} schedule events for date range`);
      res.json(results);
    }
  );
};

module.exports = { 
  getAllScheduleEvents, 
  addScheduleEvent, 
  updateScheduleEvent, 
  deleteScheduleEvent,
  getScheduleEventsByDateRange
};