const db = require("../config/db");

// Get profile by student number
const getProfile = (req, res) => {
  const { studentNumber } = req.params;
  
  if (!studentNumber) {
    return res.status(400).json({ error: "Student number is required" });
  }
  
  db.query("SELECT * FROM profiles WHERE student_number = ?", [studentNumber], (err, results) => {
    if (err) {
      console.error('Error fetching profile:', err);
      return res.status(500).json({ error: err.message });
    }
    
    if (results.length === 0) {
      // Return empty profile if none exists
      return res.json({
        studentNumber: studentNumber,
        fullName: "",
        email: "",
        phone: "",
        bio: "",
        profileVisibility: "private",
        shareStudyProgress: false,
        allowAnalytics: true,
      });
    }
    
    // Map database columns to camelCase for frontend
    const profile = {
      studentNumber: results[0].student_number,
      fullName: results[0].full_name || "",
      email: results[0].email || "",
      phone: results[0].phone || "",
      bio: results[0].bio || "",
      profileVisibility: results[0].profile_visibility || "private",
      shareStudyProgress: results[0].share_study_progress === 1 || results[0].share_study_progress === true,
      allowAnalytics: results[0].allow_analytics === 1 || results[0].allow_analytics === true,
    };
    
    res.json(profile);
  });
};

// Create or Update profile
const saveProfile = (req, res) => {
  const { 
    studentNumber,
    fullName, 
    email, 
    phone, 
    bio, 
    profileVisibility, 
    shareStudyProgress, 
    allowAnalytics 
  } = req.body;
  
  console.log('Saving profile - Received body:', req.body);
  
  if (!studentNumber) {
    return res.status(400).json({ error: "Student number is required" });
  }
  
  // Check if profile exists
  db.query("SELECT student_number FROM profiles WHERE student_number = ?", [studentNumber], (err, results) => {
    if (err) {
      console.error('Error checking profile:', err);
      return res.status(500).json({ error: err.message });
    }
    
    if (results.length === 0) {
      // INSERT new profile
      const insertQuery = `
        INSERT INTO profiles 
        (student_number, full_name, email, phone, bio, profile_visibility, share_study_progress, allow_analytics)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      db.query(
        insertQuery, 
        [studentNumber, fullName, email, phone, bio, profileVisibility, shareStudyProgress, allowAnalytics],
        (err, insertResults) => {
          if (err) {
            console.error('Error inserting profile:', err);
            return res.status(500).json({ error: err.message });
          }
          console.log('Profile created successfully for student:', studentNumber);
          res.json({ 
            message: "Profile created successfully", 
            studentNumber: studentNumber 
          });
        }
      );
    } else {
      // UPDATE existing profile
      const updateQuery = `
        UPDATE profiles 
        SET full_name=?, email=?, phone=?, bio=?, 
            profile_visibility=?, share_study_progress=?, allow_analytics=?
        WHERE student_number=?
      `;
      
      db.query(
        updateQuery,
        [fullName, email, phone, bio, profileVisibility, shareStudyProgress, allowAnalytics, studentNumber],
        (err, updateResults) => {
          if (err) {
            console.error('Error updating profile:', err);
            return res.status(500).json({ error: err.message });
          }
          console.log('Profile updated successfully, Rows affected:', updateResults.affectedRows);
          res.json({ 
            message: "Profile updated successfully", 
            affectedRows: updateResults.affectedRows 
          });
        }
      );
    }
  });
};

// Get all profiles (optional - for admin view)
const getAllProfiles = (req, res) => {
  db.query("SELECT * FROM profiles ORDER BY created_at DESC", (err, results) => {
    if (err) {
      console.error('Error fetching all profiles:', err);
      return res.status(500).json({ error: err.message });
    }
    
    const profiles = results.map(profile => ({
      studentNumber: profile.student_number,
      fullName: profile.full_name || "",
      email: profile.email || "",
      phone: profile.phone || "",
      bio: profile.bio || "",
      profileVisibility: profile.profile_visibility || "private",
      shareStudyProgress: profile.share_study_progress === 1 || profile.share_study_progress === true,
      allowAnalytics: profile.allow_analytics === 1 || profile.allow_analytics === true,
      createdAt: profile.created_at,
      updatedAt: profile.updated_at,
    }));
    
    res.json(profiles);
  });
};

module.exports = { getProfile, saveProfile, getAllProfiles };