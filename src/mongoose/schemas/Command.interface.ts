import { Document } from "mongoose";

export default interface ICommand extends Document
{
   filename: string
   guildid: string
   enabled: Boolean
   code: [string]
}