import { Google, generateCodeVerifier, generateState } from "arctic";
import express from "express";
import dotenv from "dotenv";
dotenv.config();
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const google = new Google(
  client_id,
  client_secret,
  "http://localhost:3000/google"
);

const app = express();
const codeverifier = generateCodeVerifier();
app.get("/login", async (req, res) => {
  const authUrl = await google.createAuthorizationURL(
    generateState(),
    codeverifier,
    ["profile", "email"]
  );

  res.redirect(authUrl);
});

app.get("/google", async (req, res) => {
  const code = req.query.code;

  try {
    const tokens = await google.validateAuthorizationCode(code, codeverifier);
    // Save the user and tokens to your database
    // Set session cookies or tokens as needed

    const response = await fetch(
      "https://openidconnect.googleapis.com/v1/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      }
    );
    const user = await response.json();
    console.log(user);
    res.send("Logged in successfully");
  } catch (error) {
    console.error("Authentication error:", error);
    res.redirect("/login");
  }
});
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
