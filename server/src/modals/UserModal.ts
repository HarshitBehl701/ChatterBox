import mongoose, { Schema, Document, ObjectId } from 'mongoose';

export interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    picture?: string;
    email: string;
    username: string;
    password: string;
    status: 'online' | 'offline';
    friendsList: mongoose.Types.ObjectId[];
    is_active: 0 | 1;
}

const userSchema = new Schema<IUser>({
    name: {
        type: String,
        required: true
    },
    picture: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['online', 'offline'],
        default: 'offline'
    },
    friendsList: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }
    ],
    is_active: {
        type: Number,
        enum: [0, 1],
        default: 1
    }
}, { timestamps: true });

const UserModal = mongoose.model<IUser>('user', userSchema);
export default UserModal;