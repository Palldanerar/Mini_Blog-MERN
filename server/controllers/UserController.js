import bcrypt from "bcrypt";
import UserModel from "../models/User.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {
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
        }, "secret")

        res.json({
            token
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Не удалось зарегистрироваться!"
        })
    }
}

export const login = async (req, res) => {
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

        console.log(user._id)

        const token = jwt.sign({
            id: user._id
        },"secret")

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
}

export const getMe = async (req, res) => {
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
}