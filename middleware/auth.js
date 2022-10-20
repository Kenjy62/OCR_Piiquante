// Required
const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    try {
        console.log(req.headers.authorization)
        // Get Token Authorization
        const token = req.headers.authorization.split(' ')[1]
        const decodedToken = jwt.verify(token, process.env.PRIVATEKEY)
        const userId = decodedToken.userId

        // Verify if Token UserId = UserId
        if(req.body.userId && req.body.userId !== userId) {
            throw 'Invalid userId'
        } else {
            next()
        }
    } catch {
        res.status(403).json({
            error: new Error(': Request unauthorized!')
        })
        console.log('error')
    }
}