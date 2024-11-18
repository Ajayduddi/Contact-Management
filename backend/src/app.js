import express from 'express';
import 'dotenv/config';
import user_route from './routes/user_route.js';
import login_route from './routes/login_route.js';
import passport from 'passport';
import cors from 'cors';
import './strategies/jwt-strategies.js';

// create a app server
const app = express();
const port = process.env.PORT || 3000;

// set-up cors
app.use(cors({
    origin:' http://localhost:5174',
    credentials: true,
    maxAge: 1 * 24 * 60 * 60, // 1 day
}));

// handle preflight requests
app.options('/',(req, res) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5174');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.sendStatus(204);
});

// accept json data from client
app.use(express.json());

// initilize passport
app.use(passport.initialize())

// main route
app.get('/', (req, res) => {
    res.status(200).send("welcome to server");
});

// contacts api end pont
app.use('/contacts', user_route);
app.use('/login', login_route);


// listen the server 
app.listen(port, () => {
    console.log(`server starts at http://127.0.0.1:${port}`);
})