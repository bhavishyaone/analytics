import { verifyToken } from '../utils/auth.js'

const authMiddleware = async (req, res, next) => {
    const authHeaders = req.headers.authorization

    if (!authHeaders || !authHeaders.startsWith("Bearer "))
        return res.status(401).json({ message: "Not authorized" })

    const token = authHeaders.split(" ")[1]

    try {
        const decoded = verifyToken(token)
        req.user = { id: decoded.id }
        next()
    } catch (err) {
        return res.status(401).json({ message: "Invalid Token." })
    }
}

export default authMiddleware