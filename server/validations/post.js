import {body} from "express-validator";

export const postCreateValidation = [
    body("title", "Введите заголовок статьи").isLength({ min: 4 }).isString(),
    body("text", "Введите  текст статьи").isLength({ min: 20 }).isString(),
    body("tags", "Неверный формат").optional().isString(),
    body("imageUrl", "Не URL").optional().isString()
]