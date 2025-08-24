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

// Helper function to process and store credential data consistently
const storeCredentialData = async (userId, credentialData) => {
  const docIds = [];
  const errors = [];

  for (let i = 0; i < credentialData.length; i++) {
    try {
      // Validate each credential
      const validatedData = credentialSchema.parse(credentialData[i]);
      const encryptedData = encryptSchema(validatedData);

      const docRef = await db
        .collection("credentials")
        .doc(userId)
        .collection("userCredentials")
        .add(encryptedData);

      docIds.push(docRef.id);
    } catch (error) {
      errors.push({
        row: i + 1,
        data: credentialData[i],
        error: error.errors || error.message
      });
    }
  }

  return { docIds, errors };
};

// POST credentials (JSON)
app.post("/post/credential", authenticateUser, async (req, res) => {
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

    console.error("POST /post/credential error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST credentials (via Excel upload)
app.post(
  "/post/credentials/excel",
  authenticateUser,
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const userId = req.user.uid;

      // Parse Excel with options to handle data types properly
      const workbook = xlsx.read(req.file.buffer, {
        type: "buffer",
        cellDates: true,
        cellNF: false,
        cellText: false,
        raw: false
      });

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // Convert sheet to JSON with proper data type handling
      const rawData = xlsx.utils.sheet_to_json(sheet, {
        raw: false,
        dateNF: 'yyyy-mm-dd',
        defval: null
      });

      if (!Array.isArray(rawData) || rawData.length === 0) {
        return res.status(400).json({ message: "No valid data found in Excel" });
      }

      // Process the data to ensure it matches JSON structure exactly
      const credentialData = rawData.map(row => {
        const processedRow = {};

        for (const [key, value] of Object.entries(row)) {
          // Clean up the key (remove extra spaces, normalize)
          const cleanKey = key.trim();

          // Handle different data types consistently
          let processedValue = value;

          // Convert Excel number strings back to numbers if they should be numbers
          if (typeof value === 'string' && value.trim() !== '') {
            const numValue = Number(value.trim());
            if (!isNaN(numValue) && isFinite(numValue)) {
              processedValue = numValue;
            }
          }

          // Handle boolean values
          if (typeof value === 'string') {
            const lowerValue = value.toLowerCase().trim();
            if (lowerValue === 'true') processedValue = true;
            else if (lowerValue === 'false') processedValue = false;
          }

          // Convert empty strings to null for consistency
          if (processedValue === '') processedValue = null;

          processedRow[cleanKey] = processedValue;
        }

        return processedRow;
      });

      const { docIds, errors } = await storeCredentialData(userId, credentialData);

      // Return response with success and error details
      const response = {
        message: `Processed ${credentialData.length} credentials`,
        successful: docIds.length,
        failed: errors.length,
        ids: docIds
      };

      if (errors.length > 0) {
        response.errors = errors;
      }

      // If all failed, return 400; if partial success, return 207; if all success, return 201
      const statusCode = docIds.length === 0 ? 400 : 
                        errors.length > 0 ? 207 : 201;

      res.status(statusCode).json(response);

    } catch (error) {
      console.error("POST /post/credentials/excel error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);


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

// Helper function to process and store activity data consistently
const storeActivityData = async (userId, credentialId, activityData) => {
  const docIds = [];

  for (const data of activityData) {
    // Clean and normalize the data to ensure consistency
    const cleanedData = Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        key.trim(), // Remove whitespace from keys
        value === null || value === undefined || value === '' ? null : value
      ])
    );

    const docRef = await db
      .collection("activity-info")
      .doc(userId)
      .collection("userActivityInfo")
      .doc(credentialId)
      .collection("activities")
      .add(cleanedData);

    docIds.push(docRef.id);
  }

  return docIds;
};

// POST activity info (expects JSON array)
app.post("/post/activity-info/:credential_id", authenticateUser, async (req, res) => {
  try {
    const userId = req.user.uid;
    const credentialId = req.params.credential_id;
    const activityData = req.body;

    if (!Array.isArray(activityData)) {
      return res.status(400).json({ message: "Activity data must be an array" });
    }

    const docIds = await storeActivityData(userId, credentialId, activityData);

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
  "/post/activity-infos/excel/:credential_id",
  authenticateUser,
  upload.single("file"), 
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const userId = req.user.uid;
      const credentialId = req.params.credential_id;

      // Parse Excel with options to handle data types properly
      const workbook = xlsx.read(req.file.buffer, { 
        type: "buffer",
        cellDates: true,    // Convert Excel dates to JS dates
        cellNF: false,      // Don't format numbers as strings
        cellText: false,    // Don't convert everything to text
        raw: false          // Process cell values
      });
      
      
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // Convert sheet to JSON with proper data type handling
      const rawData = xlsx.utils.sheet_to_json(sheet, {
        raw: false,         // Don't keep raw values
        dateNF: 'yyyy-mm-dd', // Format dates consistently
        defval: null        // Use null for empty cells instead of undefined
      });

      if (!Array.isArray(rawData) || rawData.length === 0) {
        return res.status(400).json({ message: "No valid data found in Excel" });
      }

      // Process the data to ensure it matches JSON structure exactly
      const activityData = rawData.map(row => {
        const processedRow = {};
        
        for (const [key, value] of Object.entries(row)) {
          // Clean up the key (remove extra spaces, normalize)
          const cleanKey = key.trim();
          
          // Handle different data types consistently
          let processedValue = value;
          
          // Convert Excel number strings back to numbers if they should be numbers
          if (typeof value === 'string' && value.trim() !== '') {
            const numValue = Number(value.trim());
            if (!isNaN(numValue) && isFinite(numValue)) {
              processedValue = numValue;
            }
          }
          
          // Handle boolean values
          if (typeof value === 'string') {
            const lowerValue = value.toLowerCase().trim();
            if (lowerValue === 'true') processedValue = true;
            else if (lowerValue === 'false') processedValue = false;
          }
          
          // Convert empty strings to null for consistency
          if (processedValue === '') processedValue = null;
          
          processedRow[cleanKey] = processedValue;
        }
        
        return processedRow;
      });

      const docIds = await storeActivityData(userId, credentialId, activityData);

      res.status(201).json({
        message: "Excel data stored successfully",
        count: docIds.length,
        ids: docIds,
      });

    } catch (error) {
      console.error("POST /post/activity-infos/excel error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);


// GET activity info (for a specific credential)
app.get("/get/activity-infos/:credential_id", authenticateUser, async (req, res) => {
  try {
    const userId = req.user.uid;
    const credentialId = req.params.credential_id;

    const snapshot = await db
      .collection("activity-info")
      .doc(userId)
      .collection("userActivityInfo")
      .doc(credentialId)
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
    console.error("GET /get/activity-infos error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


// PUT activity info
app.put("/put/activity-info/:credential_id/:id", authenticateUser, async (req, res) => {
  try {
    const userId = req.user.uid;
    const credentialId = req.params.credential_id;
    const activityId = req.params.id;
    const activityData = req.body;

    const docRef = db
      .collection("activity-info")
      .doc(userId)
      .collection("userActivityInfo")
      .doc(credentialId)
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
   COMPROMISED INFO ROUTES
========================================================== */

// Helper function to process and store compromised info data consistently
const storeCompromisedInfoData = async (userId, compromisedData) => {
  const docIds = [];

  for (const data of compromisedData) {
    // Clean and normalize the data to ensure consistency
    const cleanedData = Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        key.trim(), // Remove whitespace from keys
        value === null || value === undefined || value === '' ? null : value
      ])
    );

    const docRef = await db
      .collection("compromised-info")
      .doc(userId)
      .collection("userCompromisedInfo")
      .add(cleanedData);

    docIds.push(docRef.id);
  }

  return docIds;
};

// POST compromised info (expects JSON array)
app.post("/post/compromised-info", authenticateUser, async (req, res) => {
  try {
    const userId = req.user.uid;
    const compromisedData = req.body;

    if (!Array.isArray(compromisedData)) {
      return res.status(400).json({ message: "Compromised data must be an array" });
    }

    const docIds = await storeCompromisedInfoData(userId, compromisedData);

    res.status(201).json({
      message: "All compromised data stored successfully",
      ids: docIds,
    });

  } catch (error) {
    console.error("POST /post/compromised-info error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST compromised info (via Excel upload)
app.post(
  "/post/compromised-infos/excel",
  authenticateUser,
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const userId = req.user.uid;

      // Parse Excel with options to handle data types properly
      const workbook = xlsx.read(req.file.buffer, {
        type: "buffer",
        cellDates: true,
        cellNF: false,
        cellText: false,
        raw: false
      });

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // Convert sheet to JSON with proper data type handling
      const rawData = xlsx.utils.sheet_to_json(sheet, {
        raw: false,
        dateNF: 'yyyy-mm-dd',
        defval: null
      });

      if (!Array.isArray(rawData) || rawData.length === 0) {
        return res.status(400).json({ message: "No valid data found in Excel" });
      }

      // Process the data to ensure it matches JSON structure exactly
      const compromisedData = rawData.map(row => {
        const processedRow = {};

        for (const [key, value] of Object.entries(row)) {
          // Clean up the key (remove extra spaces, normalize)
          const cleanKey = key.trim();

          // Handle different data types consistently
          let processedValue = value;

          // Convert Excel number strings back to numbers if they should be numbers
          if (typeof value === 'string' && value.trim() !== '') {
            const numValue = Number(value.trim());
            if (!isNaN(numValue) && isFinite(numValue)) {
              processedValue = numValue;
            }
          }

          // Handle boolean values
          if (typeof value === 'string') {
            const lowerValue = value.toLowerCase().trim();
            if (lowerValue === 'true') processedValue = true;
            else if (lowerValue === 'false') processedValue = false;
          }

          // Convert empty strings to null for consistency
          if (processedValue === '') processedValue = null;

          processedRow[cleanKey] = processedValue;
        }

        return processedRow;
      });

      const docIds = await storeCompromisedInfoData(userId, compromisedData);

      res.status(201).json({
        message: "Excel data stored successfully",
        count: docIds.length,
        ids: docIds,
      });

    } catch (error) {
      console.error("POST /post/compromised-infos/excel error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// GET compromised info (all datasets with compromised credentials)
app.get("/get/compromised-infos", authenticateUser, async (req, res) => {
  try {
    const userId = req.user.uid;

    const snapshot = await db
      .collection("compromised-info")
      .doc(userId)
      .collection("userCompromisedInfo")
      .get();

    if (snapshot.empty) {
      return res.status(404).json({ message: "No compromised info found" });
    }

    const compromisedInfo = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(compromisedInfo);

  } catch (error) {
    console.error("GET /get/compromised-info error:", error);
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