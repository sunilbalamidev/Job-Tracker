import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = express.Router();

// Step 1: Start Google OAuth flow
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Step 2: Handle Google callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user._id, name: req.user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Redirect to deployed frontend
    res.redirect(
      `https://job-tracker-client-cqyn.onrender.com/login?token=${token}`
    );
  }
);

export default router;
