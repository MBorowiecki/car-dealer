import mongoose from 'mongoose';

const CarSchema = new mongoose.Schema({
    manufacturerId: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    model: {
        type: String,
        required: true
    },
    bodyCondition: {
        type: Number,
        required: true,
    },
    suspensionCondition: {
        type: Number,
        required: true,
    },
    interiorCondition: {
        type: Number,
        required: true,
    },
    distanceDriven: {
        type: Number,
        required: true,
    },
    engineId: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    productionPrice: {
        type: Number,
        required: true,
    },
    ownersCount: {
        type: Number,
        required: true
    },
    yearProduced: {
        type: Number,
        required: true
    }
})

const CarModel = mongoose.model('Car', CarSchema);

export default CarModel;