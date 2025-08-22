// server.js

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const xlsx = require("xlsx");

const { db } = require("./config/firebaseConfig");
const credentialSchema = require("./validation/credentialSchema");
const { encryptSchema, decryptSchema } = require("./utils/cryptSchema");
const { authenticateUser } = require("./middlewares/authenticateUser");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Multer setup (for Excel uploads in memory)
const upload = multer({ storage: multer.memoryStorage() });

/* ==========================================================
   CREDENTIALS ROUTES
========================================================== */

// POST credentials
app.post("/post/credentials", authenticateUser, async (req, res) => {
  try {
    const validatedData = credentialSchema.parse(req.body);
    const encryptedData = encryptSchema(validatedData);

    const userId = req.user.uid;

    const docRef = await db
      .collection("credentials")
      .doc(userId)
      .collection("userCredentials")
      .add(encryptedData);

    res.status(201).json({
      message: "Credential stored successfully",
      id: docRef.id,
    });

  } catch (error) {
    if (error.errors) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.errors,
      });
    }

    console.error("POST /post/credentials error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


// GET credentials
app.get("/get/credentials", authenticateUser, async (req, res) => {
  try {
    const userId = req.user.uid;

    const snapshot = await db
      .collection("credentials")
      .doc(userId)
      .collection("userCredentials")
      .get();

    if (snapshot.empty) {
      return res.status(404).json({ message: "No credentials found" });
    }

    const credentials = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...decryptSchema(doc.data()),
    }));

    res.status(200).json(credentials);

  } catch (error) {
    console.error("GET /get/credentials error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


// PUT credentials
app.put("/put/credential/:id", authenticateUser, async (req, res) => {
  try {
    const userId = req.user.uid;
    const credentialId = req.params.id;

    const validatedData = credentialSchema.parse(req.body);
    const encryptedData = encryptSchema(validatedData);

    const docRef = db
      .collection("credentials")
      .doc(userId)
      .collection("userCredentials")
      .doc(credentialId);

    await docRef.update(encryptedData);

    res.status(200).json({ message: "Credential updated successfully" });

  } catch (error) {
    if (error.errors) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.errors,
      });
    }

    console.error("PUT /put/credential error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


// DELETE credentials
app.delete("/delete/credential/:id", authenticateUser, async (req, res) => {
  try {
    const userId = req.user.uid;
    const credentialId = req.params.id;

    const docRef = db
      .collection("credentials")
      .doc(userId)
      .collection("userCredentials")
      .doc(credentialId);

    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ message: "Credential not found" });
    }

    await docRef.delete();

    res.status(200).json({ message: "Credential deleted successfully" });

  } catch (error) {
    console.error("DELETE /delete/credential error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


/* ==========================================================
   ACTIVITY INFO ROUTES
========================================================== */

// POST activity info (expects JSON array)
app.post("/post/activity-info/:credential_id", authenticateUser, async (req, res) => {
  try {
    const userId      = req.user.uid;
    const credentialId = req.params.credential_id;
    const activityData = req.body;

    if (!Array.isArray(activityData)) {
      return res.status(400).json({ message: "Activity data must be an array" });
    }

    const docIds = [];

    for (const data of activityData) {
      const docRef = await db
        .collection("activity-info")
        .doc(userId)
        .collection("userActivityInfo")
        .doc(credentialId)       // nested under credentialId
        .collection("activities")
        .add(data);

      docIds.push(docRef.id);
    }

    res.status(201).json({
      message: "All activity data stored successfully",
      ids: docIds,
    });

  } catch (error) {
    console.error("POST /post/activity-info error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


// POST activity info (via Excel upload)
app.post(
  "/post/activity-info/excel/:credential_id",
  authenticateUser,
  upload.single("file"), 
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const userId      = req.user.uid;
      const credentialId = req.params.credential_id;

      // Parse Excel
      const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const sheet     = workbook.Sheets[sheetName];

      const activityData = xlsx.utils.sheet_to_json(sheet);

      if (!Array.isArray(activityData) || activityData.length === 0) {
        return res.status(400).json({ message: "No valid data found in Excel" });
      }

      const docIds = [];

      for (const data of activityData) {
        const docRef = await db
          .collection("activity-info")
          .doc(userId)
          .collection("userActivityInfo")
          .doc(credentialId)    // nested under credentialId
          .collection("activities")
          .add(data);

        docIds.push(docRef.id);
      }

      res.status(201).json({
        message: "Excel data stored successfully",
        count: docIds.length,
        ids: docIds,
      });

    } catch (error) {
      console.error("POST /post/activity-info/excel error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);


// GET activity info (for a specific credential)
app.get("/get/activity-info/:credential_id", authenticateUser, async (req, res) => {
  try {
    const userId      = req.user.uid;
    const credentialId = req.params.credential_id;

    const snapshot = await db
      .collection("activity-info")
      .doc(userId)
      .collection("userActivityInfo")
      .doc(credentialId)       // nested under credentialId
      .collection("activities")
      .get();

    if (snapshot.empty) {
      return res.status(404).json({ message: "No activity info found" });
    }

    const activityInfo = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(activityInfo);

  } catch (error) {
    console.error("GET /get/activity-info error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


// PUT activity info
app.put("/put/activity-info/:credential_id/:id", authenticateUser, async (req, res) => {
  try {
    const userId      = req.user.uid;
    const credentialId = req.params.credential_id;
    const activityId   = req.params.id;
    const activityData = req.body;

    const docRef = db
      .collection("activity-info")
      .doc(userId)
      .collection("userActivityInfo")
      .doc(credentialId)       // nested under credentialId
      .collection("activities")
      .doc(activityId);

    await docRef.update(activityData);

    res.status(200).json({ message: "Activity updated successfully" });

  } catch (error) {
    console.error("PUT /put/activity-info error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


/* ==========================================================
   START SERVER
========================================================== */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
