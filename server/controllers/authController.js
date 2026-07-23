import prisma from "../prisma/client.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Clear old uploaded data for a fresh start
    await prisma.reconciliationResult.deleteMany({});
    await prisma.payment.deleteMany({});
    await prisma.order.deleteMany({});

    res.status(201).json({
      message: "Signup successful",
      user,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }

    // Clear old uploaded data for a fresh session
    await prisma.reconciliationResult.deleteMany({});
    await prisma.payment.deleteMany({});
    await prisma.order.deleteMany({});

    const token = jwt.sign(
      { id: user.id },
      "secretkey",
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};