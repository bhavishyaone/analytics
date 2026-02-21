import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const hashPassword = async (password) => {
    return bcrypt.hash(password, 10)
}

export const comparePassword = async (password, hash) => {
    return bcrypt.compare(password, hash)
}

export const generateToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    )
}

export const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET)
}
