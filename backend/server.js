// server.js

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const { db } = require("./config/firebaseConfig");
const credentialSchema = require("./validation/credentialSchema");
const { encryptSchema, decryptSchema } = require("./utils/cryptSchema");
const { authenticateUser } = require("./middlewares/authenticateUser");

const app = express();
app.use(bodyParser.json());

// POST route to store credentials (user-scoped)
app.post("/post/credentials", authenticateUser, async (req, res) => {
  try {
    // Validate request body with Zod
    const validatedData = credentialSchema.parse(req.body);

    // Encrypt data before storing
    const encryptedData = encryptSchema(validatedData);

    // Use user's UID to scope data
    const userId = req.user.uid;
    const docRef = await db
      .collection("credentials")
      .doc(userId)
      .collection("userCredentials")
      .add(encryptedData);

    res.status(201).json({
      message: "Data stored successfully",
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

// GET route to fetch and decrypt credentials (user-scoped)
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

    const credentials = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...decryptSchema(data), // Decrypt each document
      };
    });

    res.status(200).json(credentials);
  } catch (error) {
    console.error("GET /get/credentials error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Basic health check route
app.get("/", (req, res) => {
  res.send("KeyCrypt API running");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
