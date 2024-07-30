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

app.get("/google", async (req, res) => {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();

  const url = await google.createAuthorizationURL(state, codeVerifier);

  // store state verifier as cookie
  res.cookie("state", state, {
    secure: true, // set to false in localhost
    path: "/",
    httpOnly: true,
    maxAge: 60 * 10, // 10 min
  });
  // store code verifier as cookie
  res.cookie("code_verifier", codeVerifier, {
    secure: true, // set to false in localhost
    path: "/",
    httpOnly: true,
    maxAge: 60 * 10, // 10 min
  });
  res.redirect(url);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
