const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const canvafy = require('canvafy');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ship")
        .setDescription("nivel de ship con una persona")
        .addUserOption(option => option
            .setName("user")
            .setDescription("Menciona a alguien")
            .setRequired(true)
        )
        .addUserOption(option => option
            .setName("member")
            .setDescription("Menciona a alguien")
            .setRequired(true)
        ),
    async execute(interaction, client) {
        try {
            await interaction.deferReply();

            const user = interaction.options.getUser("user");
            const member = interaction.options.getUser("member");

            const userAvatar = user.displayAvatarURL({
                forceStatic: true,
                size: 1024,
                extension: "png"
            });
            const memberAvatar = member.displayAvatarURL({
                forceStatic: true,
                size: 1024,
                extension: "png"
            });

            if (!member) {
                return interaction.editReply({ content: "Por favor menciona a alguien." });
            }

            const percentage = Math.floor(Math.random() * 101); // Genera un número aleatorio entre 0 y 100

            let titleMessage = "";
            if (percentage <= 10) {
                titleMessage = "Nulo amor 😡";
            } else if (percentage <= 20) {
                titleMessage = "No hay química 😔";
            } else if (percentage <= 40) {
                titleMessage = "Hay potencial😑";
            } else if (percentage <= 60) {
                titleMessage = "Buena combinación 😊";
            } else if (percentage <= 70) {
                titleMessage = "¡Algo puede surgir! 💗";
            } else if (percentage <= 80) {
                titleMessage = "¡Qué pareja! ❤️";
            } else if (percentage <= 90) {
                titleMessage = "¡Inseparables! 💞";
            } else {
                titleMessage = "¡Almas gemelas! 💖";
            }

            // Generar nombre del ship
            function combineUsernames(user, member) {
                const userPart = user.username.slice(0, Math.ceil(user.username.length / 2));
                const memberPart = member.username.slice(Math.floor(member.username.length / 2));
                return userPart + memberPart;
              }
              
              const shipName = combineUsernames(user, member);
            const shipImage = await new canvafy.Ship()
                .setAvatars(userAvatar, memberAvatar)
                .setBackground("image", "https://i.imgur.com/GieA8BG.jpg")
                .setBorder("#f0f0f0")
                .setOverlayOpacity(0.5)
                .setCustomNumber(percentage)
                .build();
                
                const embed = new EmbedBuilder()
    .setTitle(titleMessage)
    .setDescription(`El nivel de ship entre <@${user.id}> y <@${member.id}> es ${percentage}%\nNombre del ship: **${shipName}**`)
    .setColor("#FEA5FF")
    .setImage("attachment://ship.png")
    .setFooter({ text: "TamaInteractions", iconURL: "https://cdn.discordapp.com/avatars/1246959068883718165/d8b4894b32aa878981e719e6bf26ff88.png?size=1024" });


            await interaction.editReply({
                embeds: [embed.toJSON()],
                files: [{
                    attachment: shipImage,
                    name: `ship.png`
                }]
            });
        } catch (error) {
            console.error("Error al ejecutar el comando 'ship':", error);
            await interaction.editReply({ content: "Hubo un error al procesar tu solicitud." });
        }
    }
};