import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";

// Import your handlers
import login from "./api/auth/login.js";
import register from "./api/auth/register.js";
import tripsHandler from "./api/trips/index.js";
import tripHandler from "./api/trips/[id].js";
import rootHandler from "./api/index.js";

dotenv.config();
const app = express();
app.use(bodyParser.json());

// Routes
app.all("/", rootHandler);
app.all("/api/auth/login", login);
app.all("/api/auth/register", register);
app.all("/api/trips", tripsHandler);
app.all("/api/trips/:id", tripHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Express server running at http://localhost:${PORT}`);
});
