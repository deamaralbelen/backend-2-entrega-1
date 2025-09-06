import { Router } from "express";
import { UserModel } from "../models/user.model.js";
import { createHash } from "../utils/hash.js";

const router = Router();

// Registrar usuario
router.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;
    const exists = await UserModel.findOne({ email });
    if (exists) return res.status(400).json({ message: "Usuario ya existe" });

    const newUser = await UserModel.create({
      first_name,
      last_name,
      email,
      age,
      password: createHash(password)
    });

    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;