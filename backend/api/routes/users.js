/*
    NOTES:
    - Database error handling should be handled more gracefully and specific based on the architecture of the application.
    - Attempted to make it as simple as possible.
*/

const bcrypt = require('bcrypt');
const db = require('../database/db');
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// CREATE
router.post('/create', (req, res) => {
    // NOTE: ID should be generated at the database layer, but this is used for demonstration purpose
    let id = '_' + Math.random().toString(36).substr(2, 9);
    let saltRounds = 10; // Default

    // Auto generate a salt and hash
    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
        if (err) {
            // API layer error
            res.send({
                code: 500,
                message: 'User could not be created. Internal server error has occured.',
                result: 'API ERROR',
                status: 'INTERNAL SERVER ERROR'
            });
        } else {
            let user = {
                id: id,
                email: req.body.email,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                password: hash
            };

            let sql = 'INSERT INTO user SET ?';

            // Database insertion
            let query = db.query(sql, user, (err, result) => {
                if (err) {
                    // Duplicate entry
                    if (err.code == 'ER_DUP_ENTRY') {
                        res.send({
                            code: 200,
                            message: 'User could not be created. The email already exists.',
                            result: 'DUPLICATE ENTRY',
                            status: 'OK'
                        });

                    } else if (err.code == 'ER_NO_DEFAULT_FOR_FIELD') {
                        // Required fields
                        res.send({
                            code: 200,
                            message: 'User could not be created. A required field(s) is either null or empty',
                            result: 'REQUIRED FIELD',
                            status: 'OK'
                        });
                    } else {
                        // Database layer error
                        res.send({
                            code: 500,
                            message: 'User could not be created. Internal server error has occured.',
                            result: 'DATABASE ERROR',
                            status: 'INTERNAL SERVER ERROR'
                        });
                    }
                } else {
                    // JWT token is not fully implemented, basic usage is used for demonstration
                    const token = jwt.sign({
                        id: id,
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        email: req.body.email
                    }, 'supersecretpassword');

                    // Successful creation
                    res.send({
                        code: 201,
                        message: 'User has been created.',
                        status: 'OK',
                        token: token
                    });
                }
            })
        }
    });
});

// RETRIEVE
router.get('/', (req, res) => {
    let sql = "SELECT * FROM user";

    // Database retrieval
    let query = db.query(sql, (err, result) => {
        if (err) {
            // Database layer error
            res.send({
                code: 500,
                message: 'Users could not be retrieved. Internal server error has occured.',
                result: 'DATABASE ERROR',
                status: 'INTERNAL SERVER ERROR'
            })
        } else {
            // Successful retrieval
            res.send({
                code: 200,
                data: result,
                message: 'Users has been retrieved.',
                result: 'RETRIEVE',
                status: 'OK'
            })
        }
    })
});

// RETRIEVE user by id
router.get('/:id', (req, res) => {
    let id = req.params.id;
    let sql = `SELECT * FROM user WHERE id = "${id}"`;

    // Database retrieval
    let query = db.query(sql, (err, result) => {
        if (err) {
            // Database layer error
            res.send({
                code: 500,
                message: `The user with the specified id:${id} could not be retrieved.`,
                result: 'DATABASE ERROR',
                status: 'INTERNAL SERVER ERROR'
            })
        } else {
            // Successful retrieval
            res.send({
                code: 200,
                data: result,
                message: `The user with the specified id:${id} has been retrieved.`,
                result: 'RETRIEVE',
                status: 'OK'
            })
        }
    })

});

// UPDATE
router.post('/update/:id', (req, res) => {
    // TODO: To be implemented
    let id = req.params.id;

    res.send({
        code: 200,
        message: `The user with the specified id:${id} has been updated.`,
        result: 'UPDATED',
        status: 'OK'
    });
});

// DELETE
router.delete('/:id', (req, res) => {
    let id = req.params.id;
    let sql = `DELETE FROM user WHERE id = "${id}"`;

    // Database deletion
    let query = db.query(sql, (err, result) => {
        if (err) {
            // Database layer error
            res.send({
                code: 500,
                message: `The user with the specified id:${id} could not be deleted.`,
                result: 'DATABASE ERROR',
                status: 'INTERNAL SERVER ERROR'
            })
        } else {
            // Successful deletion
            res.send({
                code: 200,
                message: `The user with the specified id:${id} has been deleted.`,
                result: 'DELETED',
                status: 'OK'
            })
        }
    })
});

module.exports = router;