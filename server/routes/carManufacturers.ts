import express from 'express';

import CarManufacturerModel from '../database/models/carManufacturer';

const router = express.Router();

router.get('/:_id', (req, res) => {
    const { _id } = req.params;

    if(_id){
        CarManufacturerModel.findOne({ _id }, null, null, (err, docs) => {
            if(err){
                console.log(`Error ${new Date(Date.now()).toUTCString()}: Fetching car manufacturer - ${err}`);
                res.status(500).json({
                    code: 3,
                    codeText: "Error fetching document",
                    body: {
                        message: "Error fetching car manufacturer"
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
    CarManufacturerModel.find({}, (err, docs) => {
        if(err){
            console.log(`Error ${new Date(Date.now()).toUTCString()}: Fetching car manufacturers - ${err}`);
            res.status(500).json({
                code: 3,
                codeText: "Error fetching document",
                body: {
                    message: "Error fetching car manufacturers"
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
    const { name } = req.body;

    if(name){
        const newCarManufacturer = new CarManufacturerModel({
            name
        })

        newCarManufacturer.save((err: unknown) => {
            if(err){
                console.log(`[[ Error ]] ${new Date(Date.now()).toUTCString()}: Saving car manufacturer - ${err}`);
                res.status(500).json({
                    code: 2,
                    codeText: "Error saving new object",
                    body: {
                        message: err
                    }
                });
            }else{
                console.log(`[[ Info ]] ${new Date(Date.now()).toUTCString()}: Created car manufacturer ${name}`);
                res.status(200).json({
                    code: 0,
                    body: {
                        message: "Created car manufacturer succesfully"
                    }
                });
            }
        });
    }else{
        res.status(200).json({
            code: 1,
            codeText: "Invalid body content",
            body: {
                message: "*name* value undefined"
            }
        })
    }
})

export default router;