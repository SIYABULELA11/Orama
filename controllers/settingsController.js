const db = require("../config/db");

// Get settings by student number
const getSettings = (req, res) => {
  const { studentNumber } = req.params;
  
  if (!studentNumber) {
    return res.status(400).json({ error: "Student number is required" });
  }
  
  db.query("SELECT * FROM settings WHERE student_number = ?", [studentNumber], (err, results) => {
    if (err) {
      console.error('Error fetching settings:', err);
      return res.status(500).json({ error: err.message });
    }
    
    if (results.length === 0) {
      // Return default settings if none exists
      return res.json({
        studentNumber: studentNumber,
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: true,
        reminderSound: true,
        reminderFrequency: "15",
        theme: "light",
        language: "en",
        dateFormat: "DD/MM/YYYY",
        timeFormat: "24h",
        defaultStudyDuration: "60",
        weekStartsOn: "monday",
        academicYear: "2025",
        semester: "1",
      });
    }
    
    // Map database columns to camelCase for frontend
    const settings = {
      studentNumber: results[0].student_number,
      emailNotifications: results[0].email_notifications === 1 || results[0].email_notifications === true,
      smsNotifications: results[0].sms_notifications === 1 || results[0].sms_notifications === true,
      pushNotifications: results[0].push_notifications === 1 || results[0].push_notifications === true,
      reminderSound: results[0].reminder_sound === 1 || results[0].reminder_sound === true,
      reminderFrequency: results[0].reminder_frequency || "15",
      theme: results[0].theme || "light",
      language: results[0].language || "en",
      dateFormat: results[0].date_format || "DD/MM/YYYY",
      timeFormat: results[0].time_format || "24h",
      defaultStudyDuration: results[0].default_study_duration || "60",
      weekStartsOn: results[0].week_starts_on || "monday",
      academicYear: results[0].academic_year || "2025",
      semester: results[0].semester || "1",
    };
    
    res.json(settings);
  });
};

// Create or Update settings
const saveSettings = (req, res) => {
  const { 
    studentNumber,
    emailNotifications,
    smsNotifications,
    pushNotifications,
    reminderSound,
    reminderFrequency,
    theme,
    language,
    dateFormat,
    timeFormat,
    defaultStudyDuration,
    weekStartsOn,
    academicYear,
    semester
  } = req.body;
  
  console.log('Saving settings - Received body:', req.body);
  
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
    
    // Check if settings exist
    db.query("SELECT student_number FROM settings WHERE student_number = ?", [studentNumber], (err, results) => {
      if (err) {
        console.error('Error checking settings:', err);
        return res.status(500).json({ error: err.message });
      }
      
      if (results.length === 0) {
        // INSERT new settings
        const insertQuery = `
          INSERT INTO settings 
          (student_number, email_notifications, sms_notifications, push_notifications, reminder_sound, 
           reminder_frequency, theme, language, date_format, time_format, default_study_duration, 
           week_starts_on, academic_year, semester)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        db.query(
          insertQuery, 
          [studentNumber, emailNotifications, smsNotifications, pushNotifications, reminderSound,
           reminderFrequency, theme, language, dateFormat, timeFormat, defaultStudyDuration,
           weekStartsOn, academicYear, semester],
          (err, insertResults) => {
            if (err) {
              console.error('Error inserting settings:', err);
              return res.status(500).json({ error: err.message });
            }
            console.log('Settings created successfully for student:', studentNumber);
            res.json({ 
              message: "Settings created successfully", 
              studentNumber: studentNumber 
            });
          }
        );
      } else {
        // UPDATE existing settings
        const updateQuery = `
          UPDATE settings 
          SET email_notifications=?, sms_notifications=?, push_notifications=?, reminder_sound=?,
              reminder_frequency=?, theme=?, language=?, date_format=?, time_format=?,
              default_study_duration=?, week_starts_on=?, academic_year=?, semester=?
          WHERE student_number=?
        `;
        
        db.query(
          updateQuery,
          [emailNotifications, smsNotifications, pushNotifications, reminderSound,
           reminderFrequency, theme, language, dateFormat, timeFormat, defaultStudyDuration,
           weekStartsOn, academicYear, semester, studentNumber],
          (err, updateResults) => {
            if (err) {
              console.error('Error updating settings:', err);
              return res.status(500).json({ error: err.message });
            }
            console.log('Settings updated successfully, Rows affected:', updateResults.affectedRows);
            res.json({ 
              message: "Settings updated successfully", 
              affectedRows: updateResults.affectedRows 
            });
          }
        );
      }
    });
  });
};

module.exports = { getSettings, saveSettings };