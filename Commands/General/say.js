// Importar la clase SlashCommandBuilder de @discordjs/builders
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    // Definir el comando 'say' con su descripción y una opción de cadena (string)
    data: new SlashCommandBuilder()
        .setName('say') // Nombre del comando
        .setDescription('El bot dirá lo que desees.') // Descripción del comando
        .addStringOption(option =>
            option.setName('mensaje') // Nombre de la opción
                .setDescription('Mensaje que repetirá el bot') // Descripción de la opción
                .setMinLength(5) // Longitud mínima del mensaje
                .setMaxLength(100) // Longitud máxima del mensaje
                .setRequired(true)), // Esta opción es obligatoria
    
    // Función asíncrona que se ejecuta cuando se utiliza el comando
    async execute(interaction) {
        // Obtener el mensaje de la opción de cadena
        const text = interaction.options.getString('mensaje');
        // Responder a la interacción con el mensaje proporcionado
        await interaction.reply(text);
    },
};
