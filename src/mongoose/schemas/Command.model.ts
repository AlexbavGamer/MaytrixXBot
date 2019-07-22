import * as mongoose from 'mongoose';
import ICommand from './Command.interface'

var CommandSchema : mongoose.Schema<ICommand> = new mongoose.Schema<ICommand>({
    filename: {type: String, required: false, default: () => {}}, /** @note must be contain .ts at end */
    guildid: {type: String, required: true, unique: true},
    enabled: {type: Boolean, require: true},
    code: {type: [String]}
})

export default mongoose.model<ICommand>("Command", CommandSchema);