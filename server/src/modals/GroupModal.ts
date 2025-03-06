import mongoose, { Schema, Document } from 'mongoose';

export interface IGroup extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    adminUserId: mongoose.Types.ObjectId;
    picture?: string;
    members: mongoose.Types.ObjectId[];
    status: 'active' | 'inactive';
    is_active: 0 | 1;
}

const groupSchema = new Schema<IGroup>({
    name: {
        type: String,
        required: true
    },
    adminUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    picture: {
        type: String
    },
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }
    ],
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    is_active: {
        type: Number,
        enum: [0, 1],
        default: 1
    }
}, { timestamps: true });

const GroupModal = mongoose.model<IGroup>('group', groupSchema);
export default GroupModal;