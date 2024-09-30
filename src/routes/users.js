const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { PrismaClient } = require('@prisma/client')

const router = express.Router()
const prisma = new PrismaClient()

router.post('/register', async (req, res) => {
    console.log(req.body)

    const hashedPassword = await bcrypt.hash(req.body.password, 10)

    const existingUser = await prisma.users.findUnique({
        where: { username: req.body.name }
    });

    if (existingUser) {
        console.log("Username already exists")
        res.status(400).send({ msg: "Username already exists" });
    } else {
        try {
            const newUser = await prisma.users.create({
                data: {
                    username: req.body.name,
                    password: hashedPassword,
                    hex: Math.floor(Math.random()*16777215).toString(16)
                }
            })
    
            res.send(
                {
                    success: true,
                    msg: "new user created!"
                }
            )

        } catch (error) {
            console.log(error.message)
            res.status(500).send({msg: "ERROR"})
        }
    }
})

router.post('/login', async (req, res) => {
    const user = await prisma.users.findUnique({
        where: { username: req.body.name}
    })

    if (user == null) {
        console.log("BAD USERNAME")
        return res.status(401).send({msg: "Authentication failed"})
    }

    const match = await bcrypt.compare(req.body.password, user.password)

    if (!match) {
        console.log("BAD PASSWORD")
        return res.status(401).send({ msg: "Authentication failed" })
    }

    const token = await jwt.sign({
        sub: user.id,
        username: user.username,
        hex: user.hex,
        role: user.role
    }, process.env.JWT_SECRET, { expiresIn: '30d'})

    res.send(
        {
            success: true,
            msg: "Login OK", 
            jwt: token}
    )
})

module.exports = router;