import { Document } from "mongoose";

export default interface IUser extends Document
{
   id: string
   username: string
   email: string
   tag: string
   accessToken: string
   refreshToken: string
}