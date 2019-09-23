import * as mongoose from 'mongoose';
import { Strategy, Profile } from 'passport-discord';
import IUser from './User.interface';

var UserSchema: mongoose.Schema<IUser> = new mongoose.Schema<IUser>
({
    id: {type : String},
    username: {type : String},
    email: {type : String},
    tag: {type: String},
    accessToken: {type: String},
    refreshToken: {type: String}
})

export default mongoose.model<IUser>("User", UserSchema);
