import mongoose from 'mongoose';

const ProducedCarSchema = new mongoose.Schema({
    carId: mongoose.Types.ObjectId
})

const CarManufacturerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    carNamesAvailable: {
        type: [String],
        required: true,
        default: []
    }
})

const CarManufacturerModel = mongoose.model('CarManufacturer', CarManufacturerSchema);

export default CarManufacturerModel;