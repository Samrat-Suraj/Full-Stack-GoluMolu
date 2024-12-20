import jwt from "jsonwebtoken"
import EnvVars from "../config/EnvVars.js"

const GenCookieAndSetCookies = (userId, res) => {

    const token = jwt.sign({ userId }, EnvVars.JWT_SECRET, { expiresIn: "15d" })

    res.cookie("social", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict"
    })
    return token
}

export default GenCookieAndSetCookies