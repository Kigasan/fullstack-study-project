import express from 'express'; //import фреймворка express
import multer from 'multer';
import mongoose from 'mongoose';
import { registerValidation, loginValidation, postCreateValidation } from './validations.js';
import { UserController, PostController } from './controllers/index.js';
import {handleValidationErrors, checkAuth} from './utils/index.js';

mongoose
    .connect('mongodb+srv://daniilvofficial:Xyy3pEtBmYDoUVti@cluster0.qtxtgsy.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('DB is ok!'))
    .catch((err) => console.log('DB error', err));

const app = express(); // создали express-приложение, вся его логика хранится в "app"

// Создали хранилище storage при помощи библиотеки multer. Обозначили путь по которому будет сохраняться (uploads) и имя файла
const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});

// Создали переменную upload, чтобы работать со storage
const upload = multer({ storage });

app.use(express.json()); // подключает метод json в библиотеке express для добавления возможности работы с json
app.use('/uploads', express.static('uploads')); // Для express указываем, что если переходим по пути /uploads, то берем оттуда файл (?)
 
app.get('/', (req, res) => {
    res.send('app is done!');
})

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login)
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register)
app.get('/auth/me', checkAuth, UserController.getMe)

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    })
})

app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update);
app.delete('/posts/:id', checkAuth, PostController.remove);

app.listen(4444, (err) => { // запускаем сервер на порте 4444 и передаем параметр error
    if (err) { // ошибка есть - возвращаем вывод ошибки
        return console.log(err);
    } else { // ошибки нет - возвращаем сообщение
        console.log('Server OK');
    }
});