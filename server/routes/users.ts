import express from 'express';
import mongoose from 'mongoose'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import UserModel from '../database/models/user';
import serverKeyword from '../config/serverKeyword';

const router = express.Router();

router.get('/garage/:_id', (req, res) => {
    const { _id } = req.params;

    UserModel.findOne({ _id }, null, null, (err, user) => {
        if (err) {
            console.log(`Error ${new Date(Date.now()).toUTCString()}: Fetching user - ${err}`);
            res.status(500).json({
                code: 3,
                codeText: "Error fetching document",
                body: {
                    message: "Error fetching user"
                }
            });
        } else {
            res.status(200).json({
                code: 0,
                body: {
                    data: user.garage
                }
            })
        }
    })
})

router.get('/:_id', (req, res) => {
    const { _id } = req.params;

    if (_id) {
        UserModel.findOne({ _id }, null, null, (err, docs) => {
            if (err) {
                console.log(`Error ${new Date(Date.now()).toUTCString()}: Fetching user - ${err}`);
                res.status(500).json({
                    code: 3,
                    codeText: "Error fetching document",
                    body: {
                        message: "Error fetching user"
                    }
                });
            }

            if (docs) {
                res.status(200).json({
                    code: 0,
                    body: {
                        data: docs
                    }
                })
            }
        })
    }
})

// router.get('/', (req, res) => {
//     UserModel.find({}, (err, docs) => {
//         if (err) {
//             console.log(`Error ${new Date(Date.now()).toUTCString()}: Fetching users - ${err}`);
//             res.status(500).json({
//                 code: 3,
//                 codeText: "Error fetching document",
//                 body: {
//                     message: "Error fetching users"
//                 }
//             });
//         }

//         if (docs) {
//             res.status(200).json({
//                 code: 0,
//                 body: {
//                     data: docs
//                 }
//             })
//         }
//     })
// })

router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (email && password) {
        UserModel.findOne({ email }, null, null, (err, user) => {
            if (err) {
                console.log(`Error ${new Date(Date.now()).toUTCString()}: Fetching user - ${err}`);
                res.status(500).json({
                    code: 3,
                    codeText: "Error fetching document",
                    body: {
                        message: "Error fetching user"
                    }
                });
            }

            bcrypt.compare(password, user.password, (err, same) => {
                if (err) {
                    console.log(`Error ${new Date(Date.now()).toUTCString()}: Comparing passwords - ${err}`);
                    res.status(500).json({
                        code: 4,
                        codeText: "Error comparing hashes",
                        body: {
                            message: "Error comparing passwords"
                        }
                    });
                }
                if (same) {
                    const token = jwt.sign({
                        exp: Math.floor(Date.now() / 1000) + (60 * 60),
                        data: {
                            _id: user._id,
                            username: user.username,
                            email,
                            garage: user.garage,
                            verified: user.verified,
                            coords: user.coords
                        }
                    }, serverKeyword)

                    res.status(200).json({
                        code: 0,
                        body: {
                            token,
                            message: "Logged successfully"
                        }
                    })
                } else {
                    res.status(403).json({ msg: `Password of ${email} incorrect.` });
                }
            })
        })
    }
})

router.post('/register', (req, res) => {
    const { username, email, password } = req.body;

    if (username && email && password) {
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                res.status(500).send(err);
                throw err;
            }

            const newUser = new UserModel({
                username,
                email,
                password: hash
            })

            newUser.save().then(() => {
                if (err) {
                    console.log(`[[ Error ]] ${new Date(Date.now()).toUTCString()}: Saving user - ${err}`);
                    res.status(500).json({
                        code: 2,
                        codeText: "Error saving new object",
                        body: {
                            message: err
                        }
                    });
                } else {
                    console.log(`[[ Info ]] ${new Date(Date.now()).toUTCString()}: Created user`);
                    const token = jwt.sign({
                        exp: Math.floor(Date.now() / 1000) + (60 * 60),
                        data: {
                            _id: newUser._id,
                            username: newUser.username,
                            email: newUser.email,
                            garage: newUser.garage,
                            verified: newUser.verified,
                            coords: newUser.coords
                        }
                    }, serverKeyword)

                    res.status(200).json({
                        code: 0,
                        body: {
                            message: "Created user succesfully",
                            token
                        }
                    });
                }
            })
        })
    }
})

router.post('/:_id', (req, res) => {
    const { _id } = req.params;
    const { name, value } = req.body;

    if (_id) {
        UserModel.findOneAndUpdate({ _id }, { $set: { [name]: value } }, null, (err, doc) => {
            if (err) {
                console.log(`[[ Error ]] ${new Date(Date.now()).toUTCString()}: Updating user - ${err}`);
                res.status(500).json({
                    code: 5,
                    codeText: "Error updating object",
                    body: {
                        message: err
                    }
                });
            }

            if (doc) {
                res.status(200).json({
                    code: 0,
                    body: {
                        data: doc
                    }
                })
            }
        })
    }
})

export default router;