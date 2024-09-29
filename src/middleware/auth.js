require('dotenv').config()
const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization']
        console.log(`authorize jwt: ${authHeader}`)
        const token = authHeader?.split(' ')[1]

        const userData = jwt.verify(token, process.env.JWT_SECRET)
        console.log(`token authorized for user ${userData.sub} ${userData.name}`)

        req.userData = userData

        next()

    } catch (error) {
        console.log(error.message)

        res.status(401).send({
            message: "Authorization error",
            error: error.message
        })

    }

}