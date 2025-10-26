const db = require("../config/db");

// Get accessibility settings by student number
const getAccessibilitySettings = (req, res) => {
  const { studentNumber } = req.params;
  
  if (!studentNumber) {
    return res.status(400).json({ error: "Student number is required" });
  }
  
  db.query("SELECT * FROM accessibility_settings WHERE student_number = ?", [studentNumber], (err, results) => {
    if (err) {
      console.error('Error fetching accessibility settings:', err);
      return res.status(500).json({ error: err.message });
    }
    
    if (results.length === 0) {
      // Return default settings if none exists
      return res.json({
        studentNumber: studentNumber,
        highContrast: false,
        textSize: "medium",
        reducedMotion: false,
        dyslexiaFont: false,
        focusOutline: true,
        screenReaderAnnouncements: true,
      });
    }
    
    // Map database columns to camelCase for frontend
    const settings = {
      studentNumber: results[0].student_number,
      highContrast: results[0].high_contrast === 1 || results[0].high_contrast === true,
      textSize: results[0].text_size || "medium",
      reducedMotion: results[0].reduced_motion === 1 || results[0].reduced_motion === true,
      dyslexiaFont: results[0].dyslexia_font === 1 || results[0].dyslexia_font === true,
      focusOutline: results[0].focus_outline === 1 || results[0].focus_outline === true,
      screenReaderAnnouncements: results[0].screen_reader_announcements === 1 || results[0].screen_reader_announcements === true,
    };
    
    res.json(settings);
  });
};

// Create or Update accessibility settings
const saveAccessibilitySettings = (req, res) => {
  const { 
    studentNumber,
    highContrast,
    textSize,
    reducedMotion,
    dyslexiaFont,
    focusOutline,
    screenReaderAnnouncements
  } = req.body;
  
  console.log('Saving accessibility settings - Received body:', req.body);
  
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
    
    // Check if accessibility settings exist
    db.query("SELECT student_number FROM accessibility_settings WHERE student_number = ?", [studentNumber], (err, results) => {
      if (err) {
        console.error('Error checking accessibility settings:', err);
        return res.status(500).json({ error: err.message });
      }
      
      if (results.length === 0) {
        // INSERT new settings
        const insertQuery = `
          INSERT INTO accessibility_settings 
          (student_number, high_contrast, text_size, reduced_motion, dyslexia_font, focus_outline, screen_reader_announcements)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        
        db.query(
          insertQuery, 
          [studentNumber, highContrast, textSize, reducedMotion, dyslexiaFont, focusOutline, screenReaderAnnouncements],
          (err, insertResults) => {
            if (err) {
              console.error('Error inserting accessibility settings:', err);
              return res.status(500).json({ error: err.message });
            }
            console.log('Accessibility settings created successfully for student:', studentNumber);
            res.json({ 
              message: "Accessibility settings created successfully", 
              studentNumber: studentNumber 
            });
          }
        );
      } else {
        // UPDATE existing settings
        const updateQuery = `
          UPDATE accessibility_settings 
          SET high_contrast=?, text_size=?, reduced_motion=?, dyslexia_font=?, focus_outline=?, screen_reader_announcements=?
          WHERE student_number=?
        `;
        
        db.query(
          updateQuery,
          [highContrast, textSize, reducedMotion, dyslexiaFont, focusOutline, screenReaderAnnouncements, studentNumber],
          (err, updateResults) => {
            if (err) {
              console.error('Error updating accessibility settings:', err);
              return res.status(500).json({ error: err.message });
            }
            console.log('Accessibility settings updated successfully, Rows affected:', updateResults.affectedRows);
            res.json({ 
              message: "Accessibility settings updated successfully", 
              affectedRows: updateResults.affectedRows 
            });
          }
        );
      }
    });
  });
};

module.exports = { getAccessibilitySettings, saveAccessibilitySettings };