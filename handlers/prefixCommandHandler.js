module.exports = (client, prefix) => {
    client.on('messageCreate', message => {
        if (!message.content.startsWith(prefix) || message.author.bot) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = client.prefixCommands.get(commandName);
        if (!command) return;

        try {
            command.execute(message, args);
        } catch (error) {
            console.error(`Error al ejecutar el comando ${commandName}:`, error);
            message.reply('Hubo un error al intentar ejecutar ese comando.');
        }
    });
};
