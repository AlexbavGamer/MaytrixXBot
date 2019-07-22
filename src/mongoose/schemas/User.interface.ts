import { Document } from "mongoose";

export default interface IUser extends Document {
   id: String
   username: String
   email: String
   tag: String
   accessToken: String
   refreshToken: String
}