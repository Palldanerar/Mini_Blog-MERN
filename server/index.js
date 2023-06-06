import express from "express"
import bcrypt from "bcrypt"
import mongoose from "mongoose"
import jwt from "jsonwebtoken"

import {validationResult} from "express-validator";
import {registerValidation} from "./validations/auth.js"

import UserModel from "./models/User.js"
import CheakAuth from "./utils/CheakAuth.js";

mongoose.connect("mongodb+srv://admin:Premium14@cluster0.buwdzpn.mongodb.net/blog?retryWrites=true&w=majority")
    .then(() => {
        console.log("БАЗА ДАННЫХ ПОДКЛЮЧЕНА")
    })
    .catch((err) => {
        console.log(`БАЗА ДАННЫХ НЕ ПОДКЛЮЧЕНА. Ошибка: ${err}`)
    })

const app = express()

app.use(express.json())

app.post("/auth/login", async (req, res) => {
    try {
        const user = await UserModel.findOne({email: req.body.email})

        if (!user) {
            return res.status(404).json({
                message: "Пользователь не найден"
            })
        }

        const validPassword = await bcrypt.compare(req.body.password, user.passwordHash)

        if (!validPassword) {
            return res.status(404).json({
                message: "Неверный логин или пароль"
            })
        }

        const token = jwt.sign({
            id: user._id
        },"secret", {expiresIn: 14})

        res.json({
            message: "Авторизация успешна",
            token
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Не удалось авторизоваться!"
        })
    }
})

app.post("/auth/register", registerValidation, async (req, res) => {
    try {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array())
        }

        const password = req.body.password
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)

        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash
        })

        const user = await doc.save()

        const token = jwt.sign({
            id: user._id
        },"secret", {expiresIn: 14})

        res.json({
            token
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Не удалось зарегистрироваться!"
        })
    }

})

app.get("/auth/me", CheakAuth, async (req, res) => {
    try {
        const user = await UserModel.findOne(req.userId)

        if (!user) {
            return res.json({
                message: "Пользователь не найден"
            })
        }

        return res.json({
            ...user,
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Ошибка доступа"
        })
    }
})

app.listen(5600,(err) => {
    if (err) {
        console.log("Сервер не запустился!")
    } else {
        console.log("OK!")
    }
})