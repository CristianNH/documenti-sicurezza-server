require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { google } = require("googleapis");
const fs = require("fs");

const app = express();

app.use(cors({
  origin: ["http://localhost:3000", "https://documenti-sicurezza-server.onrender.com"],
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

const upload = multer({ dest: "uploads/" });

const SCOPES = ["https://www.googleapis.com/auth/drive.file"];
const KEYFILEPATH = "documenti-sicurezza.json"; // Il file JSON delle credenziali di Google Drive
const PARENT_FOLDER_ID = "1mcZHTcMKwKKltqL-XB5sDKAgLYUOCOol";
