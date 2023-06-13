import express from "express"
import mongoose from "mongoose"
import multer from "multer"
import cors from "cors"

import {registerValidation} from "./validations/register.js"
import {loginValidation} from "./validations/login.js";

import CheckAuth from "./utils/CheckAuth.js";
import {register, login, getMe} from "./controllers/UserController.js";
import {create, getAll, getOne, remove, update, getLastTags} from "./controllers/PostController.js";
import {postCreateValidation} from "./validations/post.js";
import handleErrors from "./utils/handleErrors.js";

// Подключение к БД
mongoose.connect("mongodb+srv://admin:Premium14@cluster0.buwdzpn.mongodb.net/blog?retryWrites=true&w=majority")
    .then(() => {
        console.log("БАЗА ДАННЫХ ПОДКЛЮЧЕНА")
    })
    .catch((err) => {
        console.log(`БАЗА ДАННЫХ НЕ ПОДКЛЮЧЕНА. Ошибка: ${err}`)
    })

const app = express()

const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, "uploads");
    },
    filename: (req, file, cb) =>{
        cb(null, file.originalname);
    }
});

const upload = multer({storage})

app.use(express.json())
app.use('/uploads', express.static("uploads"))
app.use(cors())

// Начальный запуск
app.get("/", (req, res) => {
    res.send("Work!")
})

// Запросы пользователя
app.post("/auth/login", loginValidation, handleErrors, login)
app.post("/auth/register", registerValidation, handleErrors, register)
app.get("/auth/me", CheckAuth, getMe)

//Запросы статей
app.post("/post", CheckAuth, postCreateValidation, handleErrors, create)
app.get("/posts", getAll)
app.get("/post/:id", getOne)
app.delete("/post/:id", CheckAuth, remove)
app.patch("/post/:id", CheckAuth, handleErrors, update)

// Запросы Multer
app.post("/upload", CheckAuth, upload.single('image'), (req, res) => {
    res.json({
        message: "Картинка загружена",
        URL: `/uploads/${req.file.originalname}`
    })
})

// Запрос тегов
app.get("/posts/tags", getLastTags)

app.listen(5600,(err) => {
    if (err) {
        console.log("Сервер не запустился!")
    } else {
        console.log("OK!")
    }
})