import { Router } from 'express';
import cookieParser from 'cookie-parser';
import { body,validationResult,matchedData } from 'express-validator';
import { login } from '../model/schemas/login.js';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { hashPassword } from '../utils/helper.js';
import { comparePassword } from '../utils/helper.js';

const route = Router();

// enable cookie parsing
route.use(cookieParser());

// login user
route.post('/', [
    body('email').isEmail().withMessage("Enter valid email").notEmpty().withMessage("Email is required"),
    body('password').isStrongPassword({ minLength: 10, minLowercase: 1, minNumbers: 1, minSymbols: 1, minUppercase: 1 }).withMessage("password at least 10 digits include lower,upper letters,number,symbol")
], (req, res) => {
    console.log("Check Login")
    const result = validationResult(req);
    console.log(result);
    if (!result.isEmpty()) {
        res.status(400).json({ result: false, message: result, data: null });
        return;
    }
    const data = matchedData(req);
    try {
        login.get(`select * from ${login.name} where email = ?`, data.email, (err, get) => {
            if (err) {
                res.status(400).json({ result: false, message: err.message, data: null });
                return;
            }

            if (get == undefined) {
                res.status(400).json({ result: false, message: "Invalid Email", data: null })
                return;
            }
            
            if (comparePassword(data.password, get.password)) {
                const token = "Bearer " +jwt.sign({ id: get.id }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES
                });
                res.status(200).json({ result: true, message: "login success", data: token })
            }
            else {
                res.status(400).json({ result: false, message: "Invalid password", data: null })
            }
        });
    } catch (error) {
        res.status(500).json({ result: false, message: error.message, data: null });
    }
});

// create user
route.post('/createUser', [
    body('email').isEmail().withMessage("Enter valid email").notEmpty().withMessage("Email is required"),
    body('password').isStrongPassword({ minLength: 10, minLowercase: 1, minNumbers: 1, minSymbols: 1, minUppercase: 1 }).withMessage("password at least 10 digits include lower,upper letters,number,symbol")
], async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        res.status(400).json({ result: false, message: result, data: null });
        return;
    }

    let data = matchedData(req);
    try {
        data.password = await hashPassword(data.password);
        console.log(data.password);
        login.add(data, (err) => {
            if (err) {
                res.status(400).json({ result: false, message: err.message, data: null });
            }
            else {
                res.status(201).json({ result: true, message: "user added successfully", data: data });
            }
        });
    } catch (error) {
        res.status(500).json({ result: false, message: error.message, data: null });
    }
});

//get user
route.get('/getUser', (req, res) => {
    try {
        login.getAll('',(err,data) => {
            if (err) {
                res.status(400).json({ result: false, message: err.message, data: null });
                return;
            }

            res.status(200).json({ result: true, message: "data get successfully", data: data });
        })
    } catch (error) {
        
    }
})

// checkauth
route.get('/isAuth', passport.authenticate('jwt', { session: false }), (req, res) => {
    console.log("auth check")
    if (req.user?.id) {
        res.status(200).json({ result: true, message: "user is authenticates", data: null });
    }
    else {
        res.status(401).json({ result: false, message: "UnAuthorized user", data: null });
    }
})

export default route;