import mongoose from 'mongoose';
export class Connect
{
    constructor(connection_url : string)
    {
        mongoose.connect(connection_url, {useNewUrlParser: true, useCreateIndex: true});
    }
}