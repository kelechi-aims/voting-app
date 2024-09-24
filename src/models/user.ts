import { Schema, Model, model } from "mongoose";
import validator from 'validator';
import MUUID from 'uuid-mongodb';
import bcrypt from 'bcryptjs';


interface IUser {
    username: string;
    email: string;
    password: string;
    _id: string;
}

type UserModel = Model<IUser>;

const userSchema = new Schema<IUser, UserModel>({
    username: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value: string) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid');
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value: string) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"');
            }
        }
    },
    _id: {
        type: 'String',
        default: () => MUUID.v4().toString()
    }
});

// Pre-save middleware to hash the password
userSchema.pre('save', async function (next: (err?: Error) => void) {
    const user = this;
    if (user.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
    }
    next();
});

export const User: UserModel = model<IUser, UserModel>('User', userSchema);

export const getUser = async () => await User.find();

export const getUserById = async (id: string) => await User.findById(id);

export const getUserByEmail = async (email: string) => await User.findOne({ email });

export const deleteUser = async (id: string) => await User.findByIdAndDelete(id);

export const updateUserById = async (id: string, user: IUser) => await User.findByIdAndUpdate(id, user, { new: true });


