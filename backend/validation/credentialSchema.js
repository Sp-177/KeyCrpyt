const { z } = require("zod");

const credentialSchema = z.object({
  website: z
    .string()
    .trim()
    .url("Website must be a valid URL"),

  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters long")
    .refine((value) => {
      // Email regex
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      // If contains @, check if it's a valid email; otherwise allow it
      return !value.includes("@") || emailPattern.test(value);
    }, { message: "Invalid email format" }),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters long"),

  keywords: z
    .array(z.string()) // array of strings, can be empty or missing
    .optional()
});

module.exports = credentialSchema;
