  // server.js

  require("dotenv").config();
  const express = require("express");

  const cors = require("cors");


  const bodyParser = require("body-parser");
  const { db } = require("./config/firebaseConfig");
  const credentialSchema = require("./validation/credentialSchema");
  const { encryptSchema, decryptSchema } = require("./utils/cryptSchema");
  const { authenticateUser } = require("./middlewares/authenticateUser");

  const app = express();
  app.use(bodyParser.json());
  app.use(cors());

  //Credntials
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
  
  app.put("/put/credential/:id", authenticateUser, async (req, res) => {
  try {
    const userId = req.user.uid;
    const credentialId = req.params.id;

    // Validate request body
    const validatedData = credentialSchema.parse(req.body);

    // Encrypt data
    const encryptedData = encryptSchema(validatedData);

    // Update the document
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
    console.error("PUT /update/credential error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/delete/credential/:id", authenticateUser, async (req, res) => {
  try {
    const userId = req.user.uid;
    const credentialId = req.params.id;

    // Reference to the document
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


//Acitivity Info

app.post("/post/activity-info", authenticateUser, async (req, res) => {
    try {
      

      // Encrypt data before storing
      const encryptedData = encryptSchema(req.body);

      // Use user's UID to scope data
      
      const userId = req.user.uid;
      const docRef = await db
        .collection("activity-info")
        .doc(userId)
        .collection("userActvityInfo")
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
      console.error("POST /post/activity-info error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // GET route to fetch and decrypt credentials (user-scoped)
  app.get("/get/activity-info", authenticateUser, async (req, res) => {
    try {
      const userId = req.user.uid;
      const snapshot = await db
        .collection("activity-info")
        .doc(userId)
        .collection("userActvityInfo")
        .add(encryptedData);

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
      console.error("GET /get/activity-info error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.put("/put/activity-info/:id", authenticateUser, async (req, res) => {
  try {
    const userId = req.user.uid;
    const activityId = req.params.id;
    // Encrypt data
    const encryptedData = encryptSchema(validatedData);

    // Update the document
    const docRef = await db
        .collection("activity-info")
        .doc(userId)
        .collection("userActvityInfo")
        .add(activityId);

    await docRef.update(encryptedData);

    res.status(200).json({ message: "Credential updated successfully" });
  } catch (error) {
    if (error.errors) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.errors,
      });
    }
    console.error("PUT /put/activity-info error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
 

  // Start server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
