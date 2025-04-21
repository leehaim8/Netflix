require('dotenv').config();
const jwt = require("jsonwebtoken");

const authMiddleware = {
    async authToken(req, res, next) {
        const token = req.headers['authorization'].split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: "Token is required" });
        }
        jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
            if (err) {
                return res.status(401).json({ message: "Your token has expired. Please log in again." });
            }

            req.user = decoded;
            next();
        });
    },
    authRole(role) {
        return (req, res, next) => {
            if (req.user.role !== role) {
                console.log("req.user.role");
                return res.status(403).json({ message: `Access denied: ${role}s only` });
            }
            next();
        };
    }
};

module.exports = { authMiddleware };
