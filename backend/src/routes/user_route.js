import { Router } from 'express';
import { matchedData,validationResult,checkSchema } from 'express-validator';
import { user } from '../model/schemas/user.js';
import { user_schema } from '../utils/validation_schema.js';
import passport from 'passport';

const route = Router();

// global middleware for authentication the user. all router are accesed after authentication
route.use(
    passport.authenticate('jwt', { session: false })

);

// get contact data
route.get('/', (req, res) => {
    // get user data from the database
    const { search } = req.query;
    try {
        user.getAll(search, (err, data) => {
            if (err) {
                res.status(400).json({ result: false, message: err.message, data: null });
            }
            else {
                console.log(data);
                res.status(200).json({ result: true, message: "successfully get the data", data: data });
            }
        });
    } catch (error) {
        res.status(500).json({ result: false, message: error.message, data: null });
    }
});


// add contact data
route.post('/', checkSchema(user_schema), (req, res) => {
    // the result will be set after valiating the data
    const result = validationResult(req);

    if (!result.isEmpty()) {
        res.status(400).json({ result: false, message: result, data: null });
        return;
    }

    // get the validated data
    const data = matchedData(req);
    console.log(data);
    
    try {
        user.add(data, (err) => {
            if (err) {
                res.status(400).json({ result: false, message: err.message, data: null });
            }
            else {
                res.status(201).json({ result: true, message: "contact added successfully", data: data });
            }
        });
    } catch (error) {
        res.status(500).json({ result: false, message: error.message, data: null });
    }
});


// update contact data
route.put('/:id', checkSchema(user_schema), (req, res) => {
    // the result will be set after valiating the data
    const result = validationResult(req);

    if (!result.isEmpty()) {
        res.status(400).json({ result: false, message: result, data: null });
        return;
    }

    // get the validated data
    const data = matchedData(req);
    const { id } = req.params;
    console.log(data);
    
    try {
        user.get(`select * from ${user.name} where id=?`,id, (err,get) => {
            console.log("check");
            if (err) {
                res.status(400).json({ result: false, message: err.message, data: null });
            }

            console.log(get);

            if (get != undefined) {
                user.update(data, id, (err) => {
                    if (err) {
                        res.status(400).json({ result: false, message: err.message, data: null });
                    }
                    else {
                        console.log("success");
                        res.status(200).json({ result: true, message: "contact updated successfully", data: null });
                    }
                });
            }
            else { res.status(400).json({ result: false, message: "Invalid id", data: null }); }
        });

    } catch (error) {
        res.status(500).json({ result: false, message: error.message, data: null });  
    }
});

// delete contact data
route.delete('/:id', (req, res) => {
    const { id } = req.params;

    try {
        user.get(`select * from ${user.name} where id= ?`,id, (err, get) => {
            console.log("check");
            if (err) {
                res.status(400).json({ result: false, message: err.message, data: null });
            }

            if (get != undefined) {
                user.delete(id, (err) => {
                    if (err) {
                        res.status(400).json({ result: false, message: err.message, data: null });
                    }
                    else {
                        res.status(200).json({ result: true, message: "contact deleted successfully", data: null });
                    }
                });
            }
            else { res.status(400).json({ result: false, message: "Invalid id", data: null }); }
        });
    } catch (error) {
        res.status(500).json({ result: false, message: err.message, data: null });
    }
});

export default route;