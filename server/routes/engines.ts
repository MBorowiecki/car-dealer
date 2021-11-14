import express from 'express';
import mongoose from 'mongoose';

import EngineModel from '../database/models/engine';

const router = express.Router();

router.get('/:_id', (req, res) => {
    const { _id } = req.params;

    if(_id){
        EngineModel.findOne({ _id }, null, null, (err, docs) => {
            if(err){
                console.log(`Error ${new Date(Date.now()).toUTCString()}: Fetching engine - ${err}`);
                res.status(500).json({
                    code: 3,
                    codeText: "Error fetching document",
                    body: {
                        message: "Error fetching engine"
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
    EngineModel.find({}, (err, docs) => {
        if(err){
            console.log(`Error ${new Date(Date.now()).toUTCString()}: Fetching engines - ${err}`);
            res.status(500).json({
                code: 3,
                codeText: "Error fetching document",
                body: {
                    message: "Error fetching engines"
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
    const { manufacturerId, fuelType, capacity, condition, power } = req.body;

    const newCar = new EngineModel({
        manufacturerId: new mongoose.Types.ObjectId(manufacturerId),
        fuelType, 
        capacity, 
        condition, 
        power
    })

    newCar.save((err: unknown) => {
        if(err){
            console.log(`[[ Error ]] ${new Date(Date.now()).toUTCString()}: Saving engine - ${err}`);
            res.status(500).json({
                code: 2,
                codeText: "Error saving new object",
                body: {
                    message: err
                }
            });
        }else{
            console.log(`[[ Info ]] ${new Date(Date.now()).toUTCString()}: Created engine`);
            res.status(200).json({
                code: 0,
                body: {
                    message: "Created engine succesfully"
                }
            });
        }
    });
})

export default router;