import mongoose, { mongo, Schema, Document } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URL!;
mongoose.connect(MONGO_URI);

const UserSchema = new mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    favorites: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Medicine'
    }]
});

const MedicineSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String, required: true}
})

const PharmacySchema = new mongoose.Schema({
    name :{type: String, required: true},
    location: {type: String},
    contact: {type: Number},
    medicines: [
        {
            medicineId: {type: mongoose.Schema.Types.ObjectId, ref: 'Medicine', required: true},
            price: {type: Number, required: true}
        }
    ]
})

export const User = mongoose.model('User', UserSchema);
export const Medicine = mongoose.model('Medicine', MedicineSchema);
export const Pharmacy = mongoose.model('Pharmacy', PharmacySchema);