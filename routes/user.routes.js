const { Router } = require('express');
const router = Router();
const { hash, compare } = require('bcrypt')
const User = require('../model/userSchema.js');

const SALT = Number(process.env.SALT || 10);
const statusCode = {
    'ok': 200,
    'error': 400,
    'invalid-credentials': 610,
    'not-found': 608,
    'user-exist': 609,
    'server-fail': 500
}

router.post('/login', async (req, res) => {
    const {mail, password} = req.body;
    try {
        const userExit = await User.findOne({mail});
        if(userExit) {
            compare(password, userExit.password, function (error, result) {
                if(result) {
                    return res.status(statusCode.ok).json({ok: "User login successfully"});
                } else {
                    return res.status(statusCode['invalid-credentials']).json({error: "Invalid credentials"});
                }
            });
        } else {
            return res.status(statusCode['not-found']).json({error: "User not found"});
        }
    } catch (error) {
        return res.status(statusCode.error).json(error);
    }
})

router.post('/signin', async (req, res) => {
    const {userName, mail, password} = req.body;
    try {
        const userExit = await User.findOne({mail});
        if(userExit) {
            return res.status(statusCode['user-exist']).json({error: "User already exist"});
        }
        const hashPassword = await hash(password, SALT);
        const user = new User({userName, mail, password: hashPassword});
        const userAdded = await user.save();
        if(userAdded) {
            return res.status(statusCode.ok).json({ok: "User added successfully"});
        } else {
            return res.status(statusCode['server-fail']).json({error: "Failed to register user"});
        }
    } catch (error) {
        return res.status(statusCode.error).json(error);
    }
})

module.exports = router;