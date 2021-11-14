import mongoose from 'mongoose';

const CarManufacturerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
})

const CarManufacturerModel = mongoose.model('CarManufacturer', CarManufacturerSchema);

export default CarManufacturerModel;