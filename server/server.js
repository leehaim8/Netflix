require("dotenv").config();
const express = require("express");
const app = express();
const cors = require('cors');
const path = require("path");
const port = process.env.PORT || 8080;

const { usersRouter } = require('./routers/usersRouter');
const { profilesRouter } = require('./routers/profilesRouter');
const { movieRouter } = require('./routers/movieRouter');

// app.use((req, res, next) => {
//     if (req.headers["x-forwarded-proto"] !== "https" && process.env.NODE_ENV === "production") {
//         return res.redirect(`https://${req.headers.host}${req.url}`);
//     }
//     next();
// });

app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = [
            "http://localhost:3000",
        ];
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("CORS policy violation"));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use('/api/users', usersRouter);
app.use('/api/profiles', profilesRouter);
app.use('/api/moviesAndTv', movieRouter);

app.use((req, res) => {
    res.status(400).send("Page wasn't found");
});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});