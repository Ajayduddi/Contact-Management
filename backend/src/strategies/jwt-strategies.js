import { Strategy, ExtractJwt } from 'passport-jwt';
import passport from 'passport';
import { login } from '../model/schemas/login.js';

// JWT options configuration
const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET, 
};


passport.use(new Strategy(options, (jwt_payload, done) => {
    console.log("passport");
    console.log(options.jwtFromRequest);
    console.log(jwt_payload);
    try {
        if (jwt_payload) {
            login.get(`select * from ${login.name} where id = ?`, jwt_payload.id, (err, data) => {
                if (err) {
                    throw new Error(err);
                }
                
                data == undefined ? done("user not found") : done(null, data);
            })
        }
        else {
            done(null, null);
        }

    } catch (error) {
        return done(error, null)
    }
}));