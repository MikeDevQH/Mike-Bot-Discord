// Importar las clases necesarias de las librerías discord.js y @discordjs/builders
const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    // Definir el comando 'avatar' con su descripción y una opción de usuario
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Muestra el avatar del usuario seleccionado.')
        .addUserOption(option => 
            option.setName('usuario')
                .setDescription('El usuario del cual deseas ver el avatar.')
                .setRequired(true)),
    
    // Función asíncrona que se ejecuta cuando se utiliza el comando
    async execute(interaction) {
        // Obtener el usuario seleccionado
        const user = interaction.options.getUser('usuario');
        
        // Si se obtuvo el usuario correctamente
        if (user) {
            // Obtener la URL del avatar del usuario en tamaño 1024 y formato dinámico (GIF si está disponible)
            const avatarURL = user.displayAvatarURL({ dynamic: true, size: 1024 });
            
            // Crear un EmbedBuilder para mostrar la información del avatar
            const avatarEmbed = new EmbedBuilder()
                .setColor(0x3a69cb) // Color del embed
                .setTitle(`Avatar de ${user.username}`) // Título del embed
                .setImage(avatarURL) // Imagen del avatar
                .setFooter({ text: `Solicitado por ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) }); // Pie de página con el nombre del solicitante y su avatar

            // Crear una fila de acción con un botón para ver el avatar en el navegador
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setLabel('Ver en el navegador') // Etiqueta del botón
                        .setStyle(ButtonStyle.Link) // Estilo del botón (enlace)
                        .setURL(avatarURL) // URL a la que redirige el botón
                );

            // Responder a la interacción con el embed y el botón
            await interaction.reply({ embeds: [avatarEmbed], components: [row] });
        } else {
            // Responder con un mensaje de error si no se pudo obtener el usuario
            await interaction.reply('No pude obtener el avatar del usuario.');
        }
    },
};
