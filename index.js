const fs = require('fs');
const express = require('express');
let app = express();
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let dotenv = require('dotenv');
let cors = require('cors');
let port = process.env.PORT || 3333;

app.options('*', cors({
    origin:true,
    credentials:true,
    maxAge:50000
}));
// setting
dotenv.config();

mongoose.connect(process.env.DB_URL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}, (err) => {
    if (err) console.error(err);
    else console.log('Connected Database')
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
// app.use(cookieParser());
// app.use((req, res, next) => {
//     res.setHeader("Access-Control-Allow-Origin", ['*']);
//     res.setHeader("Access-Control-Allow-Headers", 'X-Requested-With,Origin,Content-Type,Authorization,authorization');
//     if (req.method === "OPTIONS") {
//         res.setHeader("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE');
//         return res.json({}).sendStatus(200)
//     }
//     return next();
// });


app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    );

    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }
    next();
});

// routes
const { authVerify } = require("./middelware/auth");



let authRouter = require('./routes/user/auth');
let userRouter = require('./routes/user/user');
let requestRouter = require('./routes/request/request');
let notificationRouter = require('./routes/notification/notification');
let transactionRouter = require('./routes/transaction/transaction');
let centerRouter = require('./routes/center/center');

app.use('/api/auth', authRouter);
app.use('/api/user', authVerify, userRouter);
app.use('/api/request', authVerify, requestRouter);
app.use('/api/notification', authVerify, notificationRouter);
app.use('/api/transaction', authVerify, transactionRouter);
app.use('/api/center', authVerify, centerRouter);

app.get('/', function(req, res) {
    return res.json({ message: "Welcome to our page" });
});
// app.get('/error', (req, res, next) => {
//     const error = new Error({ message: 'ERRORRR', statusCode: 300 })
//     return next(error)
// })

app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    const { data, message } = error;
    res.status(status).json({ message, data });
});

app.listen(port, () => {
    console.log('Web site is running in url : http://localhost:' + port)
});