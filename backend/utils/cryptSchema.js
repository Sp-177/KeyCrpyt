const { encrypt, decrypt } = require("./encryption");

// Encrypt every field in the schema object
function encryptSchema(schema) {
    const encryptedSchema = {};
    Object.keys(schema).forEach((key) => {
        if (key === "keywords" && Array.isArray(schema[key])) {
            // Encrypt keywords array
            encryptedSchema[key] = schema[key].map((keyword) => encrypt(keyword));
        } else {
            encryptedSchema[key] = encrypt(schema[key]);
        }
    });
    return encryptedSchema;
}

// Decrypt every field in the schema object
function decryptSchema(schema) {
    const decryptedSchema = {};
    Object.keys(schema).forEach((key) => {
        if (key === "keywords" && Array.isArray(schema[key])) {
            // Decrypt keywords array
            decryptedSchema[key] = schema[key].map((encryptedKeyword) => decrypt(encryptedKeyword));
        } else {
            decryptedSchema[key] = decrypt(schema[key]);
        }
    });
    return decryptedSchema;
}

module.exports = { encryptSchema, decryptSchema };
