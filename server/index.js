import express from "express"
import mongoose from "mongoose"

import {registerValidation} from "./validations/register.js"
import {loginValidation} from "./validations/login.js";

import CheakAuth from "./utils/CheakAuth.js";
import {register, login, getMe} from "./controllers/UserController.js";
import {createPost, getAll, getOne} from "./controllers/PostController.js";
import {postCreateValidation} from "./validations/post.js";
import cheakAuth from "./utils/CheakAuth.js";

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

// Начальный запуск
app.get("/", (req, res) => {
    res.send("Work!")
})

// Запросы пользователя
app.post("/auth/login", loginValidation, login)
app.post("/auth/register", registerValidation, register)
app.get("/auth/me", CheakAuth, getMe)

//Запросы статей
app.post("/posts", cheakAuth, postCreateValidation, createPost)
app.get("/posts", cheakAuth, getAll)
app.get("/post/:id", cheakAuth, getOne)

app.listen(5600,(err) => {
    if (err) {
        console.log("Сервер не запустился!")
    } else {
        console.log("OK!")
    }
})