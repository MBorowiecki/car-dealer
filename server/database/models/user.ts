import mongoose from 'mongoose';

const UserCoordsSchema = new mongoose.Schema({
    latitude: Number,
    longitude: Number
})

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    verified: {
        type: Boolean,
        default: false
    },
    garage: {
        type: [{
            carId: {
                type: mongoose.Types.ObjectId,
                unique: true
            }
        }],
        default: []
    },
    coords: {
        type: UserCoordsSchema
    },
    money: {
        type: Number,
        default: 0
    }
})

const UserModel = mongoose.model('User', UserSchema);

export default UserModel;