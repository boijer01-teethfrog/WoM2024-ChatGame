const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { PrismaClient } = require('@prisma/client')
const authorize = require('../middleware/auth')

const router = express.Router()
const prisma = new PrismaClient()

router