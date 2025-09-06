import { Router } from "express";
import { UserModel } from "../models/user.model.js";
import { isValidPassword } from "../utils/hash.js";
import jwt from "jsonwebtoken";
import passport from "passport";

const router = Router();

const SECRET = "claveSecretaJWT";

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user || !isValidPassword(user, password)) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/current", passport.authenticate("jwt", { session: false }), (req, res) => {
  res.json({ user: req.user });
});

export default router;