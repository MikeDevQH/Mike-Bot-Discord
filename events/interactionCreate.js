module.exports = (client) => {
    client.on('interactionCreate', async interaction => {
        if (interaction.isCommand()) {
            const command = client.commands.get(interaction.commandName);

            if (!command) return;

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'Hubo un error al ejecutar este comando.', ephemeral: true });
            }
        } else if (interaction.isButton()) {
            const buttonHandler = client.buttonHandlers.get(interaction.customId);

            if (!buttonHandler) return;

            try {
                await buttonHandler.execute(interaction);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'Hubo un error al manejar esta interacción.', ephemeral: true });
            }
        } else if (interaction.isStringSelectMenu()) {
            const selectMenuHandler = client.selectMenuHandlers.get(interaction.customId);

            if (!selectMenuHandler) return;

            try {
                await selectMenuHandler.execute(interaction);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'Hubo un error al manejar esta interacción.', ephemeral: true });
            }
        }
    });
};
