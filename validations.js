import { body } from 'express-validator';

export const loginValidation = [
    body('email').isEmail(), // проверка, является ли email самим емэйлом
    body('password').isLength({ min: 5 }),
];

export const registerValidation = [
    body('email').isEmail(), // проверка, является ли email самим емэйлом
    body('password').isLength({ min: 5 }),
    body('fullName', 'Укажите имя минимум из 3 символов').isLength({min: 3}),
    body('avatarUrl').optional().isURL(),
];

export const postCreateValidation = [
    body('title', 'Введите заголовок статьи').isLength({min: 3}).isString(),
    body('text', 'Введите текст статьи').isLength({min: 10}).isString(),
    body('tags', 'Неверный формат тегов (укажите список)').optional().isString(),
    body('imageUrl', 'Неверная ссылка на изображение').optional().isString(),
];