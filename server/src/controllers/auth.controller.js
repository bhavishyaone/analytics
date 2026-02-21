import User from '../models/User.js'
import { hashPassword, comparePassword, generateToken } from '../utils/auth.js'

export const register = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password)
            return res.status(400).json({ message: "All fields are required." })

        const existingUser = await User.findOne({ email })
        if (existingUser)
            return res.status(400).json({ message: "User already exists." })

        const hashedPassword = await hashPassword(password)
        const user = await User.create({ email, password: hashedPassword })
        const token = generateToken(user._id)

        return res.status(201).json({
            message: "User created",
            token,
            user: { id: user._id, email: user.email, createdAt: user.createdAt }
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Server error." })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email })
        if (!user)
            return res.status(401).json({ message: "Invalid credentials" })

        const isMatch = await comparePassword(password, user.password)
        if (!isMatch)
            return res.status(401).json({ message: "Invalid credentials" })

        const token = generateToken(user._id)
        return res.json({ message: "Login successful", token })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Server error." })
    }
}




