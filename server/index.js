import express from "express"
import mongoose from "mongoose"

import {registerValidation} from "./validations/auth.js"

import CheakAuth from "./utils/CheakAuth.js";
import {register, login, getMe} from "./controllers/UserController.js";

// Подключение к БД
mongoose.connect("mongodb+srv://admin:Premium14@cluster0.buwdzpn.mongodb.net/blog?retryWrites=true&w=majority")
    .then(() => {
        console.log("БАЗА ДАННЫХ ПОДКЛЮЧЕНА")
    })
    .catch((err) => {
        console.log(`БАЗА ДАННЫХ НЕ ПОДКЛЮЧЕНА. Ошибка: ${err}`)
    })

const app = express()

app.use(express.json())

// Запросы
app.post("/auth/login", login)
app.post("/auth/register", registerValidation, register)
app.get("/auth/me", CheakAuth, getMe)

app.listen(5600,(err) => {
    if (err) {
        console.log("Сервер не запустился!")
    } else {
        console.log("OK!")
    }
})