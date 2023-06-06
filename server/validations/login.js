import {body} from "express-validator";

export const loginValidation = [
    body("email", "Неверный формат электронной почты!").isEmail(),
    body("password", "В пароле доложно быть миниумм 8 символов, а максимум 16").isLength({min: 8, max: 16}),
]