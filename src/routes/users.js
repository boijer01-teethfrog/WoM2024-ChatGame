const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const router = express.Router();
const prisma = new PrismaClient();

router.post("/register", async (req, res) => {
  console.log(req.body);

  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const existingUser = await prisma.users.findUnique({
    where: { username: req.body.name },
  });

  if (existingUser) {
    console.log("Username already exists");
    res.status(400).send({ msg: "Username already exists" });
  } else {
    try {
      const newUser = await prisma.users.create({
        data: {
          username: req.body.name,
          password: hashedPassword,
          hex: "#"+Math.floor(Math.random() * 16777215).toString(16),
        },
      });

      res.send({
        success: true,
        msg: "new user created!",
        username: newUser.username,
        hex: newUser.hex,
        role: newUser.role,
      });
    } catch (error) {
      console.log(error.message);
      res.status(500).send({ msg: "ERROR" });
    }
  }
});

router.post("/login", async (req, res) => {
  const user = await prisma.users.findUnique({
    where: { username: req.body.name },
  });

  if (user == null) {
    console.log("BAD USERNAME");
    return res.status(401).send({ msg: "Authentication failed" });
  }

  const match = await bcrypt.compare(req.body.password, user.password);

  if (!match) {
    console.log("BAD PASSWORD");
    return res.status(401).send({ msg: "Authentication failed" });
  }

  const token = await jwt.sign(
    {
      sub: user.id,
      username: user.username,
      hex: user.hex,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );

  // Generera WS_TOKEN separat
  const wsToken = await jwt.sign(
    {
      sub: user.id,
      username: user.username,
      role: user.role,
    },
    process.env.WS_SECRET, 
    { expiresIn: "7d" } 
  );

  res.send({
    success: true,
    msg: "Login OK",
    jwt: token,
    wsToken: wsToken,
    username: user.username,
    hex: user.hex,
    role: user.role,
  });
});

router.patch("/updateColor", async (req, res) => {
  const username = req.body.name;
  const newcolor = req.body.hex;

  try {
    const updatedUser = await prisma.users.update({
      where: { username },
      data: { hex: newcolor },
    });

    res.send({
      success: true,
      msg: "Color updated successfully",
      username: updatedUser.username,
      hex: updatedUser.hex,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ msg: "ERROR" });
  }
});

module.exports = router;
