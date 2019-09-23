function getCommandName()
{
    var lines = editor.getModel().getLinesContent();

    var match = lines.filter(line => line.match(/export default class ([A-z]+) extends Command/g))[0];
    if(match)
    {
        match = match.replace("export default class", "");
        match = match.replace("extends Command", "");
        match = match.trim() + ".ts";
        return match;
    }
    
    return 'default_command.ts';
}