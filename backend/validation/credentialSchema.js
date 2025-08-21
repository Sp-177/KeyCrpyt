const { z } = require("zod");

const credentialSchema = z.object({
  // Accept either full URL or just a site name
  website: z
    .string()
    .trim()
    .min(1, "Website is required")
    .refine(
      (value) => {
        try {
          // Try parsing as URL; if fails, accept as plain string
          new URL(value);
          return true;
        } catch {
          // Allow strings like 'Gmail', 'Facebook', etc.
          return true;
        }
      },
      { message: "Website must be a valid URL or site name" }
    ),

  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters long")
    .refine((value) => {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return !value.includes("@") || emailPattern.test(value);
    }, { message: "Invalid email format" }),

  password: z
    .string()
    .min(4, "Password must be at least 4 characters long"),

  keywords: z
    .array(z.string())
    .optional()
});

module.exports = credentialSchema;
