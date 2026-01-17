export const cookieConfig = {
  maxAge: 60 * 60 * 24 * 3, // 5 days this for now
  path: "/",
  sameSite: "lax" as boolean | "lax" | "none" | "strict" | undefined,

  secure: process.env.NODE_ENV === "production", // Only use Secure in production,
  domain: process.env.NODE_ENV === "production" ? ".juvni.com" : "localhost",
};
