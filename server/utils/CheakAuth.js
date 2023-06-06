import jwt from "jsonwebtoken"

export default (req, res, next) => {
    const token = (req.header.authorization || "").replace(/Bearer\s?/, "")

    if (token) {
        try {
            const decode = jwt.decode(token, "secret")

            req.userId = decode._id

            next()
        } catch (err) {
            return res.status(403).json({
                message: "Ошибка"
            })
        }

    } else {
        return res.status(403).json({
            message: "Нет доступа"
        })
    }

    console.log(token)
}
