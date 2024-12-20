import jwt from "jsonwebtoken";
import User from "../model/UserModel.js";
import EnvVars from "../config/EnvVars.js";

const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies["social"];
        if (!token) {
            return res.status(401).json({ success: false, message: "Authentication token is required." });
        }
        const decoded = jwt.verify(token, EnvVars.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ success: false, message: "Invalid or expired token." });
        }
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }
        req.user = user;
        next();
    } catch (error) {
        console.error("Error in Protect Route Middleware:", error.message);
        return res.status(500).json({ success: false, message: "Internal server error. Please try again later." });
    }
};

export default protectRoute;
