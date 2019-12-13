const bcrypt = require('bcrypt');
const db = require('../database/db');
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();


// Login
router.post('/login', (req, res) => {
    let sql = `SELECT * FROM user WHERE email = "${req.body.email}"`;

    // Query database for the email passed
    let query = db.query(sql, (err, result) => {
        if (err) {
            // Database layer error handling
            res.send({
                code: 500,
                message: `The user with the specified email:${req.body.email} could not be retrieved.`,
                result: 'DATABASE ERROR',
                status: 'INTERNAL SERVER ERROR'
            })
        } else {
            // Handle successful query
            if (result.length > 0) {
                // Retrieve first result since email is a unique field
                const user = result[0];

                // Verify password
                bcrypt.compare(req.body.password, user.password, function (err, result) {
                    // Return token to client
                    if (result) {
                        const token = jwt.sign({
                            id: user.id,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            email: user.email
                        }, 'supersecretpassword');

                        res.send({
                            code: 200,
                            message: 'The credentials provided has been successfully logged in.',
                            result: 'AUTHENTICATED',
                            status: 'OK',
                            token: token
                        })
                    } else {
                        // Return unauthenticated error
                        res.send({
                            code: 200,
                            message: 'The credentials provided does not exists.',
                            result: 'UNAUTHENTICATED',
                            status: 'OK'
                        })
                    }
                });

            } else {
                // Return non-existance error
                res.send({
                    code: 200,
                    message: 'The credentials provided does not exists.',
                    result: 'UNAUTHORIZED',
                    status: 'OK'
                })
            }

        }
    })
});


// User Authentication
router.post('/', (req, res) => {
    // Verify jwt with the given secret password
    jwt.verify(req.body.token, 'supersecretpassword', function (err, decoded) {
        if (err) {
            // Return error if token is expired
            if (err.name == 'TokenExpiredError') {
                res.send({
                    code: 500,
                    message: `JWT has expired`,
                    result: 'EXPIRED',
                    status: 'TokenExpiredError'
                })
            } else {
                // Return error if the JWT is malformed
                res.send({
                    code: 500,
                    message: `JWT is malformed`,
                    result: 'MALFORMED',
                    status: 'JsonWebTokenError'
                })
            }
        } else {
            // Return decoded user on success
            res.send({
                code: 200,
                user: decoded,
                status: 'OK'
            })
        }
    });
});


module.exports = router;