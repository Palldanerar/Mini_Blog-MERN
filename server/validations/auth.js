import {body} from "express-validator";

export const registerValidation = [
    body("email", "Неверный формат электронной почты!").isEmail(),
    body("password", "В пароле доложно быть миниумм 8 символов, а максимум 16").isLength({min: 8, max: 16}),
    body('fullName', "Поля имя не может быть пустым").isLength({min: 4}),
    body("avatar", "Нe URL").optional().isURL()
]