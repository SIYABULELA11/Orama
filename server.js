const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes"); 
const chatRoutes = require("./routes/chatRoutes");
const studyPlanRoutes = require("./routes/studyPlanRoutes");
const reminderRoutes = require("./routes/reminderRoutes");
const deadlineRoutes = require("./routes/deadlineRoutes");
const profileRoutes = require("./routes/profileRoutes");
const accessibilityRoutes = require("./routes/accessibilityRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/study-plans", studyPlanRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api/deadlines", deadlineRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/accessibility", accessibilityRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/schedules", scheduleRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


