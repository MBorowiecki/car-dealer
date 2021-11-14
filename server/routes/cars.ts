import express from 'express';
import mongoose from 'mongoose'

import CarModel from '../database/models/car';

const router = express.Router();

router.get('/:_id', (req, res) => {
    const { _id } = req.params;

    if(_id){
        CarModel.findOne({ _id }, null, null, (err, docs) => {
            if(err){
                console.log(`Error ${new Date(Date.now()).toUTCString()}: Fetching car - ${err}`);
                res.status(500).json({
                    code: 3,
                    codeText: "Error fetching document",
                    body: {
                        message: "Error fetching car"
                    }
                });
            }

            if(docs){
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
        if(err){
            console.log(`Error ${new Date(Date.now()).toUTCString()}: Fetching cars - ${err}`);
            res.status(500).json({
                code: 3,
                codeText: "Error fetching document",
                body: {
                    message: "Error fetching cars"
                }
            });
        }

        if(docs){
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
        if(err){
            console.log(`[[ Error ]] ${new Date(Date.now()).toUTCString()}: Saving car - ${err}`);
            res.status(500).json({
                code: 2,
                codeText: "Error saving new object",
                body: {
                    message: err
                }
            });
        }else{
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