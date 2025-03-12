require("dotenv").config();
const express = require("express");
const multer = require("multer");
const { google } = require("googleapis");
const fs = require("fs");

const app = express();
const upload = multer({ dest: "uploads/" });

const SCOPES = ["https://www.googleapis.com/auth/drive.file"];
const KEYFILEPATH = "documenti-sicurezza.json"; // Il file JSON delle credenziali
const PARENT_FOLDER_ID = "1mcZHTcMKwKKltqL-XB5sDKAgLYUOCOol"; // ID della cartella principale

const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES,
});

const drive = google.drive({ version: "v3", auth });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/api/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Nessun file caricato" });
  }

  try {
    const fileMetadata = {
      name: req.file.originalname,
      parents: [PARENT_FOLDER_ID],
    };

    const media = {
      mimeType: req.file.mimetype,
      body: fs.createReadStream(req.file.path),
    };

    const file = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: "id, webViewLink",
    });

    fs.unlinkSync(req.file.path); // Elimina il file temporaneo

    res.json({ fileUrl: file.data.webViewLink });
  } catch (error) {
    console.error("Errore nel caricamento:", error);
    res.status(500).json({ error: "Errore nel caricamento del file" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server in esecuzione su http://localhost:${PORT}`);
});
