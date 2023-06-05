import express from "express"
import bcrypt from "bcrypt"
import mongoose from "mongoose"
import {validationResult} from "express-validator";
import {registerValidation} from "./validations/auth.js"
import UserModel from "./models/User.js"

mongoose.connect("mongodb+srv://admin:@cluster0.buwdzpn.mongodb.net/?retryWrites=true&w=majority")
    .then(() => {
        console.log("БАЗА ДАННЫХ ПОДКЛЮЧЕНА")
    })
    .catch((err) => {
        console.log(`БАЗА ДАННЫХ НЕ ПОДКЛЮЧЕНА. Ошибка: ${err}`)
    })

const app = express()

app.use(express.json())

app.post("/auth/register", registerValidation, async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array())
    }

    const password = req.body.password
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)

    const doc = new UserModel({
        email: req.body.email,
        fullName: req.body.fullName,
        avatarUrl: req.body.avatarUrl,
        passwordHash
    })

    const user = await doc.save()

    res.json(user)
})

app.listen(5600, (err) => {
    if (err) {
        console.log("Сервер не запустился!")
    } else {
        console.log("OK!")
    }
})