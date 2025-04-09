const User = require("../models/userModel");
const Profile = require("../models/profilesModel");
const jwt = require("jsonwebtoken");

const usersController = {
    async register(req, res) {
        const { emailOrPhone, password, role } = req.body;

        if (!emailOrPhone || !password) {
            return res.status(400).json({ message: "Missing email/phone or password." });
        }

        try {
            const existingUser = await User.findOne({ emailOrPhone });
            if (existingUser) {
                return res.status(400).json({ message: "Email or phone already registered." });
            }

            if (role && !['user', 'admin'].includes(role.toLowerCase())) {
                return res.status(400).json({ message: "Invalid role. Must be 'user' or 'admin'." });
            }

            const newUser = new User({
                emailOrPhone,
                password,
                role: role ? role.toLowerCase() : 'user'
            });

            await newUser.save();

            const avatars = ['avatar1.png', 'avatar2.png', 'avatar3.png', 'avatar4.png', 'avatar5.png'];
            const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
            const newProfile = new Profile({
                name: "New user",
                image: randomAvatar,
                userId: newUser._id,
            });

            await newProfile.save();

            res.status(201).json({
                message: "User registered successfully",
                user: { emailOrPhone: newUser.emailOrPhone, role: newUser.role }
            });
        } catch (error) {
            res.status(500).json({ message: "Server error", error });
        }
    }, async login(req, res) {
        const { emailOrPhone, password } = req.body;
        if (!emailOrPhone || !password) {
            return res.status(400).json({ message: "Missing email/phone or password." });
        }

        try {
            const user = await User.findOne({ emailOrPhone });
            if (!user) {
                return res.status(404).json({ message: "User not found." });
            }

            if (user.password !== password) {
                return res.status(401).json({ message: "Incorrect password." });
            }

            const payload = { id: user._id, role: user.role };
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.header('Authorization', `Bearer ${token}`);
            res.status(200).json({
                message: "Login successful",
                token,
                user: { id: user._id, emailOrPhone: user.emailOrPhone, role: user.role }
            });
        } catch (error) {
            res.status(500).json({ message: "Server error", error });
        }
    },
    async verify(req, res) {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ message: "No token" });

        const token = authHeader.split(' ')[1];
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id);
            if (!user) return res.status(404).json({ message: "User not found" });
            res.status(200).json({ user: { id: user._id, role: user.role } });
        } catch (error) {
            res.status(401).json({ message: "Invalid or expired token" });
        }
    }
};

module.exports = { usersController };
