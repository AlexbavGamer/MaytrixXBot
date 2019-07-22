import * as mongoose from 'mongoose';
import { Strategy, Profile } from 'passport-discord';
import IUser from './User.interface';

var UserSchema: mongoose.Schema<IUser> = new mongoose.Schema<IUser>
({
    id: { type : String, required: true, unique: true},
    username: {type : String, unique: true},
    email: {type : String, unique: true},
    tag: {type: String, unique: true},
    accessToken: {type: String, unique: true},
    refreshToken: {type: String, unique: true}
})

export default mongoose.model<IUser>("User", UserSchema);
