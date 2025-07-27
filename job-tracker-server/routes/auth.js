const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");

// Start OAuth flow
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Callback after Google login
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  (req, res) => {
    // Generate JWT
    const token = jwt.sign(
      { id: req.user._id, name: req.user.name },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    // Send token as redirect or JSON (choose one)
    res.redirect(`http://localhost:5173/login?token=${token}`);
    // OR res.json({ token });
  }
);

module.exports = router;
