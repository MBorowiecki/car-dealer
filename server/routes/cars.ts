import express from 'express';
import mongoose from 'mongoose'

import CarModel from '../database/models/car';
import UserModel from '../database/models/user';

const router = express.Router();

router.post('/buy', (req, res) => {
    const { carId, userId, price } = req.body;

    UserModel.findOne({ _id: userId }, null, null, (err, user) => {
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
            if (user.money >= price) {
                UserModel.findOneAndUpdate(
                    { _id: userId },
                    { $set: { money: user.money - price }, $push: { garage: { carId: new mongoose.Types.ObjectId(carId) } } },
                    null,
                    (userUpdatingErr, newUser) => {
                        if (userUpdatingErr) {
                            console.log(`Error ${new Date(Date.now()).toUTCString()}: Fetching user - ${userUpdatingErr}`);
                            res.status(500).json({
                                code: 5,
                                codeText: "Error updating object",
                                body: {
                                    message: err
                                }
                            });
                        } else {
                            CarModel.findOneAndUpdate({ _id: carId }, { $inc: { ownersCount: 1 } }, null, (carUpdatingErr, carModel) => {
                                if (carUpdatingErr) {
                                    console.log(`Error ${new Date(Date.now()).toUTCString()}: Fetching user - ${carUpdatingErr}`);
                                    res.status(500).json({
                                        code: 5,
                                        codeText: "Error updating object",
                                        body: {
                                            message: err
                                        }
                                    });
                                } else {
                                    res.status(200).json({
                                        code: 0,
                                        body: {
                                            data: newUser
                                        }
                                    })
                                }
                            })
                        }
                    })
            }
        }
    })
})

router.get('/starting', (req, res) => {
    CarModel.aggregate([{ $sort: { yearProduced: 1 } }, { $match: { ownersCount: 0 } }, { $limit: 3 }]).exec((err, carModels) => {
        if (err) {
            console.log(`Error ${new Date(Date.now()).toUTCString()}: Aggregating cars - ${err}`);
            res.status(500).json({
                code: 3,
                codeText: "Error fetching document",
                body: {
                    message: "Error fetching cars"
                }
            });
        } else {
            res.status(200).json({
                code: 0,
                body: {
                    data: carModels
                }
            })
        }
    })
})

router.get('/to-buy/:carManufacturerId', (req, res) => {
    const { carManufacturerId } = req.params;

    if (carManufacturerId.length > 0) {
        CarModel.find({ manufacturerId: new mongoose.Types.ObjectId(carManufacturerId), ownersCount: 0 }, null, null, (err, allCarModels) => {
            if (err) {
                console.log(`Error ${new Date(Date.now()).toUTCString()}: Fetching car - ${err}`);
                res.status(500).json({
                    code: 3,
                    codeText: "Error fetching document",
                    body: {
                        message: "Error fetching cars"
                    }
                });
            } else {
                let carsDesigned = allCarModels.filter(
                    (carModel, index) => carModel.model !== allCarModels[index + 1].model
                );

                res.status(200).json({
                    code: 0,
                    body: {
                        data: carsDesigned
                    }
                })
            }
        })
    }
})

router.get('/:_id', (req, res) => {
    const { _id } = req.params;

    if (_id) {
        CarModel.findOne({ _id }, null, null, (err, docs) => {
            if (err) {
                console.log(`Error ${new Date(Date.now()).toUTCString()}: Fetching car - ${err}`);
                res.status(500).json({
                    code: 3,
                    codeText: "Error fetching document",
                    body: {
                        message: "Error fetching car"
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

router.get('/', (req, res) => {
    CarModel.find({}, (err, docs) => {
        if (err) {
            console.log(`Error ${new Date(Date.now()).toUTCString()}: Fetching cars - ${err}`);
            res.status(500).json({
                code: 3,
                codeText: "Error fetching document",
                body: {
                    message: "Error fetching cars"
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
})

router.post('/', (req, res) => {
    const { manufacturerId, model, bodyCondition, suspensionCondition, interiorCondition, distanceDriven, engineId, productionPrice, ownersCount, yearProduced } = req.body;

    const newCar = new CarModel({
        manufacturerId: new mongoose.Types.ObjectId(manufacturerId),
        model,
        bodyCondition,
        suspensionCondition,
        interiorCondition,
        distanceDriven,
        engineId: new mongoose.Types.ObjectId(engineId),
        productionPrice,
        ownersCount,
        yearProduced
    })

    newCar.save((err: unknown) => {
        if (err) {
            console.log(`[[ Error ]] ${new Date(Date.now()).toUTCString()}: Saving car - ${err}`);
            res.status(500).json({
                code: 2,
                codeText: "Error saving new object",
                body: {
                    message: err
                }
            });
        } else {
            console.log(`[[ Info ]] ${new Date(Date.now()).toUTCString()}: Created car ${model}`);
            res.status(200).json({
                code: 0,
                body: {
                    message: "Created car succesfully"
                }
            });
        }
    });
})

export default router;