const express = require("express");
const jwt = require("jsonwebtoken");

const authRouter = express.Router();

router.get("/check-auth", (req, res) => {
  const token = req.cookies.token; // Get token from cookie

  if (!token) {
    return res.status(401).json({ loggedIn: false, message: "Not logged in" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.json({ loggedIn: true, user: decoded });
  } catch (error) {
    return res.status(401).json({ loggedIn: false, message: "Invalid token" });
  }
});

module.exports = authRouter;
