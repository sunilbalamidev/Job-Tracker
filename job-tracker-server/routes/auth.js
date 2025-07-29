import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = express.Router();

// 🌐 Start Google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// 🔁 Google OAuth callback
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

    // Replace this with your deployed frontend URL
    res.redirect(`https://your-frontend.vercel.app/login?token=${token}`);
    // Or: res.json({ token });
  }
);

export default router;
