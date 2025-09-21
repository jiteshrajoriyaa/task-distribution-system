const jwt = require('jsonwebtoken')
async function adminMiddleWare(req, res, next) {
    try {
        const token = req.headers.token
        jwt.verify(token, process.env.JWT_STRING)
        next()
    } catch (e) {
        return res.status(401).json({
            msg: "admin is unauthenticated"
        })
    }
}

module.exports = adminMiddleWare