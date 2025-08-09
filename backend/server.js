const express = require("express");
const bodyParser = require("body-parser");
const { db } = require("./config/firebaseConfig");
const credentialSchema = require("./validation/credentialSchema");
const { encryptSchema, decryptSchema } = require("./utils/cryptSchema");

const app = express();
app.use(bodyParser.json());

// POST route to store credentials
app.post("/post/credentials", async (req, res) => {
  try {
    // Validate request body with Zod
    const validatedData = credentialSchema.parse(req.body);

    // Encrypt data before storing
    const encryptedData = encryptSchema(validatedData);

    // Add to Firestore (collection: credentials)
    const docRef = await db.collection("credentials").add(encryptedData);

    res.status(201).json({
      message: "Data stored successfully",
      id: docRef.id
    });
  } catch (error) {
    if (error.errors) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.errors
      });
    }
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// GET route to fetch and decrypt credentials
app.get("/get/credentials", async (req, res) => {
  try {
    const snapshot = await db.collection("credentials").get();

    if (snapshot.empty) {
      return res.status(404).json({ message: "No credentials found" });
    }

    const credentials = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...decryptSchema(data) // Decrypt each document
      };
    });

    res.status(200).json(credentials);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
