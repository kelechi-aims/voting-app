import { Schema , model, Model } from 'mongoose';
import MUUID from 'uuid-mongodb';

// Poll option interface
interface IPollOption {
    option: string;
    votes: number;
    _id: string;
}

// Poll interface
interface IPoll {
    _id: string;
    title: string;
    options: IPollOption[];
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
    voters: string[];
}

type PollModel = Model<IPoll>;

const pollSchema = new Schema<IPoll, PollModel>({
    _id: {
        type: String,
        default: () => MUUID.v4().toString()
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    options: [{
        _id: {
            type: String,
            default: () => MUUID.v4().toString()
        },
        option: {
            type: String,
            required: true,
            trim: true
        },
        votes: {
            type: Number,
            default: 0
        }
    }],
    createdBy: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    voters: [{
        type: String,
        required: true,
        default: []
    }]
}, { timestamps : true });

export const Poll: PollModel = model<IPoll, PollModel>('Poll', pollSchema);