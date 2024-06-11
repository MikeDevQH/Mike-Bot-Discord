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
            const buttonHandler = client.buttons.get(interaction.customId);

            if (!buttonHandler) return;

            try {
                await buttonHandler.execute(interaction);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'Hubo un error al manejar esta interacción.', ephemeral: true });
            }
        } else if (interaction.isStringSelectMenu()) {
            const selectMenuHandler = client.selectMenus.get(interaction.customId);

            if (!selectMenuHandler) return;

            try {
                await selectMenuHandler.execute(interaction);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'Hubo un error al manejar esta interacción.', ephemeral: true });
            }
        } else if (interaction.isModalSubmit()) {
            const modalHandler = client.modals.get(interaction.customId);

            if (!modalHandler) return;

            try {
                await modalHandler.execute(interaction);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'Hubo un error al manejar esta interacción.', ephemeral: true });
            }
        }
    });
};
