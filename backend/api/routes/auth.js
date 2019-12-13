const bcrypt = require('bcrypt');
const db = require('../database/db');
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/login', (req, res) => {
    let sql = `SELECT * FROM user WHERE email = "${req.body.email}"`;

    let query = db.query(sql, (err, result) => {
        if (err) {
            // Database layer error
            res.send({
                code: 500,
                message: `The user with the specified email:${req.body.email} could not be retrieved.`,
                result: 'DATABASE ERROR',
                status: 'INTERNAL SERVER ERROR'
            })
        } else {
            // Successful retrieval
            if (result.length > 0) {
                // JWT token is not fully implemented, basic usage is used for demonstration
                const user = result[0];

                bcrypt.compare(req.body.password, user.password, function (err, result) {
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
                        res.send({
                            code: 200,
                            message: 'The credentials provided does not exists.',
                            result: 'VERIFICATION',
                            status: 'OK'
                        })
                    }
                });

            } else {
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


// AUTHENTICATION
router.post('/', (req, res) => {
    // Verify token
    jwt.verify(req.body.token, 'supersecretpassword', function (err, decoded) {
        if (err) {
            if (err.name == 'TokenExpiredError') {
                res.send({
                    code: 500,
                    message: `JWT has expired`,
                    result: 'EXPIRED',
                    status: 'TokenExpiredError'
                })
            } else {
                res.send({
                    code: 500,
                    message: `JWT is malformed`,
                    result: 'MALFORMED',
                    status: 'JsonWebTokenError'
                })
            }
        } else {
            res.send({
                code: 200,
                user: decoded,
                status: 'OK'
            })
        }
    });
});


module.exports = router;