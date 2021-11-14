import mongoose from 'mongoose';

const EngineSchema = new mongoose.Schema({
    manufacturerId: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    fuelType: {
        type: String,
        required: true
    },
    capacity: {
        type: String,
        required: true
    },
    condition: {
        type: Number,
        required: true
    },
    power: {
        type: Number,
        required: true,
    }
})

const EngineModel = mongoose.model('Engine', EngineSchema);

export default EngineModel;