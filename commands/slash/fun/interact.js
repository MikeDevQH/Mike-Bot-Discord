const { ChatInputCommandInteraction, SlashCommandBuilder, Client, EmbedBuilder, setPosition } = require('discord.js');
const anime = require('anime-actions');

// Estructura de datos para almacenar los contadores de interacciones
const interactionCounters = {
    kiss: {},
    hug: {},
    kill: {},
    pat: {},
    punch: {},
    slap: {},
    bite: {},
    wave: {},
    kick: {},
    handshake: {},
    nervous: {},
    blush: {},
    bang: {},
    dance: {},
    feed: {},
    cry: {},
    bye: {},
    highfive: {},
    bonk: {},
    bully: {},
    cuddle: {},
    wink: {},
    poke: {},
    stare: {},
    scream: {}
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('interact')
        .setDescription('Este comando permite hacer una gran variedad de interacciones con otros usuarios👥')
        .addSubcommand(option => option
            .setName('kiss')
            .setDescription('Besa a un usuario💋')
            .addUserOption(option => option
                .setName('usuario')
                .setDescription('Elige al usuario que quieras besar💋')
                .setRequired(true)))
        .addSubcommand(option => option
            .setName('hug')
            .setDescription('Abraza a un usuario🫂')
            .addUserOption(option => option
                .setName('usuario')
                .setDescription('Elige al usuario que quieras abrazar🫂')
                .setRequired(true)))
        .addSubcommand(option => option
            .setName('kill')
            .setDescription('Mata a un usuario🔪')
            .addUserOption(option => option
                .setName('usuario')
                .setDescription('Elige al usuario que quieras matar🔪')
                .setRequired(true)))
        .addSubcommand(option => option
            .setName('pat')
            .setDescription('Acaricia a un usuario🫶🏽')
            .addUserOption(option => option
                .setName('usuario')
                .setDescription('Elige al usuario que quieras acariciar🫶🏽')
                .setRequired(true)))
        .addSubcommand(option => option
            .setName('punch')
            .setDescription('Golpea a un usuario🥊')
            .addUserOption(option => option
                .setName('usuario')
                .setDescription('Elige al usuario que quieras golpear🥊')
                .setRequired(true)))
        .addSubcommand(option => option
            .setName('slap')
            .setDescription('Abofetea a un usuario💥')
            .addUserOption(option => option
                .setName('usuario')
                .setDescription('Elige al usuario que quieras abofetear💥')
                .setRequired(true)))
        .addSubcommand(option => option
            .setName('bite')
            .setDescription('Muerde a un usuario🦷')
            .addUserOption(option => option
                .setName('usuario')
                .setDescription('Elige al usuario que quieras morder🦷')
                .setRequired(true)))
        .addSubcommand(option => option
            .setName('wave')
            .setDescription('Saluda a un usuario👋')
            .addUserOption(option => option
                .setName('usuario')
                .setDescription('Elige al usuario que quieras saludar👋')
                .setRequired(true)))
        .addSubcommand(option => option
            .setName('kick')
            .setDescription('Patea a un usuario🦵')
            .addUserOption(option => option
                .setName('usuario')
                .setDescription('Elige al usuario que quieras patear🦵')
                .setRequired(true)))
        .addSubcommand(option => option
            .setName('handshake')
            .setDescription('Estrecha la mano con un usuario🤝')
            .addUserOption(option => option
                .setName('usuario')
                .setDescription('Elige al usuario que quieras estrechar la mano🤝')
                .setRequired(true)))
        .addSubcommand(option => option
            .setName('nervous')
            .setDescription('Un usuario te pone nervioso😬')
            .addUserOption(option => option
                .setName('usuario')
                .setDescription('Elige al usuario que te puso nervioso😬')
                .setRequired(true)))
        .addSubcommand(option => option
            .setName('blush')
            .setDescription('Te sonrojas por un usuario😊')
            .addUserOption(option => option
                .setName('usuario')
                .setDescription('Elige al usuario que te hizo sonrojar😊')
                .setRequired(true)))
        .addSubcommand(option => option
            .setName('bang')
            .setDescription('Dispara a un usuario🔫')
            .addUserOption(option => option
                .setName('usuario')
                .setDescription('Elige al usuario que quieras disparar🔫')
                .setRequired(true)))
        .addSubcommand(option => option
            .setName('dance')
            .setDescription('Baila con un usuario💃')
            .addUserOption(option => option
                .setName('usuario')
                .setDescription('Elige al usuario que quieras invitar a bailar💃')
                .setRequired(true)))
        .addSubcommand(option => option
            .setName('feed')
            .setDescription('Dale de comer a un usuario🍽️')
            .addUserOption(option => option
                .setName('usuario')
                .setDescription('Elige al usuario que quieras alimentar🍽️')
                .setRequired(true)))
        .addSubcommand(option => option
            .setName('cry')
            .setDescription('Un usuario te hace llorar😭')
            .addUserOption(option => option
                .setName('usuario')
                .setDescription('Elige al usuario que te hizo llorar😭')
                .setRequired(true)))
        .addSubcommand(option => option
            .setName('bye')
            .setDescription('Despidete de un usuario🫡')
            .addUserOption(option => option
                .setName('usuario')
                .setDescription('Elige al usuario de quien te quieras despedir🫡')
                .setRequired(true)))
        .addSubcommand(option => option
            .setName('highfive')
            .setDescription('Choca los cinco con un usuario🙌')
            .addUserOption(option => option
                .setName('usuario')
                .setDescription('Elige al usuario con quien quieras chocar los cinco🙌')
                .setRequired(true)))
        .addSubcommand(option => option
            .setName('bonk')
            .setDescription('Bonkea a un usuario🔨')
            .addUserOption(option => option
                .setName('usuario')
                .setDescription('Elige al usuario que quieras bonkear🔨')
                .setRequired(true)))
        .addSubcommand(option => option
            .setName('bully')
            .setDescription('Intimida a un usuario🤕')
            .addUserOption(option => option
                .setName('usuario')
                .setDescription('Elige al usuario que quieras intimidar')
                .setRequired(true)))
        .addSubcommand(option => option
            .setName('cuddle')
            .setDescription('Acurrucate con un usuario🤗')
            .addUserOption(option => option
                .setName('usuario')
                .setDescription('Elige al usuario con quien quieras acurrucarte🤗')
                .setRequired(true)))
        .addSubcommand(option => option
            .setName('wink')
            .setDescription('Guiñale a un usuario😉')
            .addUserOption(option => option
                .setName('usuario')
                .setDescription('Elige al usuario a quien quieras guiñar un ojo😉')
                .setRequired(true)))
        .addSubcommand(option => option
            .setName('poke')
            .setDescription('Pica a un usuario👉')
            .addUserOption(option => option
                .setName('usuario')
                .setDescription('Elige al usuario a quien quieras picar')
                .setRequired(true)))
        .addSubcommand(option => option
            .setName('stare')
            .setDescription('Mira fijamente a un usuario😐')
            .addUserOption(option => option
                .setName('usuario')
                .setDescription('Elige al usuario a quien quieras mirar fijamente😐')
                .setRequired(true)))
        .addSubcommand(option => option
            .setName('scream')
            .setDescription('Gritale a un usuario😱')
            .addUserOption(option => option
                .setName('usuario')
                .setDescription('Elige al usuario a quien quieras gritar😱')
                .setRequired(true))),

    /**
     * 
     * @param { ChatInputCommandInteraction } interaction
     * @param { Client } client
     */

    async execute(interaction, client) {
        const serverIconURL = interaction.guild.iconURL({ dynamic: true }); 
        const subcommand = interaction.options.getSubcommand();
        const member = interaction.options.getUser('usuario');
        if (interaction.member.id === member.id) return interaction.reply({ content: '¡No puedes interactuar contigo mismo!', ephemeral: true });
        if (member.bot) return interaction.reply({ content: '¡No puedes interactuar con bots!', ephemeral: true });

        // Incrementar el contador de interacciones
        if (!interactionCounters[subcommand][interaction.user.id]) {
            interactionCounters[subcommand][interaction.user.id] = 0;
        }
        interactionCounters[subcommand][interaction.user.id]++;

        switch (subcommand) {
            case 'kiss': {
                const url = await anime.kiss();
                const embed = new EmbedBuilder()
                    .setDescription(`💋Veces besado: ${interactionCounters.kiss[interaction.user.id]}`)
                    .setColor('#e9c874')
                    .setTitle(`¡**${interaction.user.globalName}** besó a **${member.globalName}**!💋`) // Título centrado
                    .setImage(url)
                    .setFooter({ text: `${interaction.guild.name}`, iconURL: serverIconURL })
                    .setTimestamp()
                interaction.reply({ embeds: [embed] });
            } break;

            case 'hug': {
                const url = await anime.hug(); // Suponiendo que hay una función 'hug' similar a 'kiss' que devuelve una URL de imagen
                const embed = new EmbedBuilder()
                    .setDescription(`🫂Veces abrazado: ${interactionCounters.hug[interaction.user.id]}`)
                    .setColor('#e9c874')
                    .setTitle(`¡**${interaction.user.globalName}** abrazó a **${member.globalName}**!🫂`) // Título centrado
                    .setImage(url)
                    .setFooter({ text: `${interaction.guild.name}`, iconURL: serverIconURL })
                    .setTimestamp()
                interaction.reply({ embeds: [embed] });
            } break;

            case 'kill': {
                const url = await anime.kill(); // Suponiendo que hay una función 'kill' similar a 'kiss' que devuelve una URL de imagen
                const embed = new EmbedBuilder()
                    .setDescription(`🔪Veces asesinado: ${interactionCounters.kill[interaction.user.id]}`)
                    .setColor('#e9c874')
                    .setTitle(`¡**${interaction.user.globalName}** asesinó a **${member.globalName}**!🔪`) // Título centrado
                    .setImage(url)
                    .setFooter({ text: `${interaction.guild.name}`, iconURL: serverIconURL })
                    .setTimestamp()
                interaction.reply({ embeds: [embed] });
            } break;

            case 'pat': {
                const url = await anime.pat(); // Suponiendo que hay una función 'pat' similar a las otras que devuelve una URL de imagen
                const embed = new EmbedBuilder()
                    .setDescription(`🫶🏽 Veces acariciado: ${interactionCounters.pat[interaction.user.id]}`)
                    .setColor('#e9c874')
                    .setTitle(`¡**${interaction.user.globalName}** acarició a **${member.globalName}**! 🫶🏽`) // Título centrado
                    .setImage(url)
                    .setFooter({ text: `${interaction.guild.name}`, iconURL: serverIconURL })
                    .setTimestamp()
                interaction.reply({ embeds: [embed] });
            } break;

            case 'punch': {
                const url = await anime.punch(); // Suponiendo que hay una función 'punch' similar a las otras que devuelve una URL de imagen
                const embed = new EmbedBuilder()
                    .setDescription(`🥊 Veces golpeado: ${interactionCounters.punch[interaction.user.id]}`)
                    .setColor('#e9c874')
                    .setTitle(`¡**${interaction.user.globalName}** golpeó a **${member.globalName}**! 🥊`) // Título centrado
                    .setImage(url)
                    .setFooter({ text: `${interaction.guild.name}`, iconURL: serverIconURL })
                    .setTimestamp()
                interaction.reply({ embeds: [embed] });
            } break;

            case 'slap': {
                const url = await anime.slap(); // Suponiendo que hay una función 'slap' similar a las otras que devuelve una URL de imagen
                const embed = new EmbedBuilder()
                    .setDescription(`💥 Veces abofeteado: ${interactionCounters.slap[interaction.user.id]}`)
                    .setColor('#e9c874')
                    .setTitle(`¡**${interaction.user.globalName}** abofeteó a **${member.globalName}**! 💥`) // Título centrado
                    .setImage(url)
                    .setFooter({ text: `${interaction.guild.name}`, iconURL: serverIconURL })
                    .setTimestamp()
                interaction.reply({ embeds: [embed] });
            } break;


            case 'bite': {
                const url = await anime.bite(); // Suponiendo que hay una función 'bite' similar a las otras que devuelve una URL de imagen
                const embed = new EmbedBuilder()
                    .setDescription(`🦷 Veces mordido: ${interactionCounters.bite[interaction.user.id]}`)
                    .setColor('#e9c874')
                    .setTitle(`¡**${interaction.user.globalName}** mordió a **${member.globalName}**! 🦷`) // Título centrado
                    .setImage(url)
                    .setFooter({ text: `${interaction.guild.name}`, iconURL: serverIconURL })
                    .setTimestamp()
                interaction.reply({ embeds: [embed] });
            } break;

            case 'wave': {
                const url = await anime.wave(); // Suponiendo que hay una función 'wave' similar a las otras que devuelve una URL de imagen
                const embed = new EmbedBuilder()
                    .setDescription(`👋 Veces saludado: ${interactionCounters.wave[interaction.user.id]}`)
                    .setColor('#e9c874')
                    .setTitle(`¡**${interaction.user.globalName}** saludó a **${member.globalName}**! 👋`) // Título centrado
                    .setImage(url)
                    .setFooter({ text: `${interaction.guild.name}`, iconURL: serverIconURL })
                    .setTimestamp()
                interaction.reply({ embeds: [embed] });
            } break;

            case 'kick': {
                const url = await anime.kick(); // Suponiendo que hay una función 'kick' similar a las otras que devuelve una URL de imagen
                const embed = new EmbedBuilder()
                    .setDescription(`🦵 Veces pateado: ${interactionCounters.kick[interaction.user.id]}`)
                    .setColor('#e9c874')
                    .setTitle(`¡**${interaction.user.globalName}** pateó a **${member.globalName}**! 🦵`) // Título centrado
                    .setImage(url)
                    .setFooter({ text: `${interaction.guild.name}`, iconURL: serverIconURL })
                    .setTimestamp()
                interaction.reply({ embeds: [embed] });
            } break;

            case 'handshake': {
                const url = await anime.handshake(); // Suponiendo que hay una función 'handshake' similar a las otras que devuelve una URL de imagen
                const embed = new EmbedBuilder()
                    .setDescription(`🤝 Veces estrechada: ${interactionCounters.handshake[interaction.user.id]}`)
                    .setColor('#e9c874')
                    .setTitle(`¡**${interaction.user.globalName}** estrechó la mano de **${member.globalName}**! 🤝`) // Título centrado
                    .setImage(url)
                    .setFooter({ text: `${interaction.guild.name}`, iconURL: serverIconURL })
                    .setTimestamp()
                interaction.reply({ embeds: [embed] });
            } break;

            case 'nervous': {
                const url = await anime.nervous(); // Suponiendo que hay una función 'nervous' similar a las otras que devuelve una URL de imagen
                const embed = new EmbedBuilder()
                    .setDescription(`😬 Veces nervioso: ${interactionCounters.nervous[interaction.user.id]}`)
                    .setColor('#e9c874')
                    .setTitle(`¡**${interaction.user.globalName}** se puso nervioso con **${member.globalName}**! 😬`) // Título centrado
                    .setImage(url)
                    .setFooter({ text: `${interaction.guild.name}`, iconURL: serverIconURL })
                    .setTimestamp()
                interaction.reply({ embeds: [embed] });
            } break;

            case 'blush': {
                const url = await anime.blush(); // Suponiendo que hay una función 'blush' similar a las otras que devuelve una URL de imagen
                const embed = new EmbedBuilder()
                    .setDescription(`😊 Veces sonrojado: ${interactionCounters.blush[interaction.user.id]}`)
                    .setColor('#e9c874')
                    .setTitle(`¡**${interaction.user.globalName}** se sonrojó por **${member.globalName}**! 😊`) // Título centrado
                    .setImage(url)
                    .setFooter({ text: `${interaction.guild.name}`, iconURL: serverIconURL })
                    .setTimestamp()
                interaction.reply({ embeds: [embed] });
            } break;

            case 'bang': {
                const url = await anime.shoot(); // Suponiendo que hay una función 'shoot' similar a las otras que devuelve una URL de imagen
                const embed = new EmbedBuilder()
                    .setDescription(`🔫 Veces disparado: ${interactionCounters.bang[interaction.user.id]}`)
                    .setColor('#e9c874')
                    .setTitle(`¡**${interaction.user.globalName}** disparó a **${member.globalName}**! 🔫`) // Título centrado
                    .setImage(url)
                    .setFooter({ text: `${interaction.guild.name}`, iconURL: serverIconURL })
                    .setTimestamp()
                interaction.reply({ embeds: [embed] });
            } break;

            case 'dance': {
                const url = await anime.dance(); // Suponiendo que hay una función 'dance' similar a las otras que devuelve una URL de imagen
                const embed = new EmbedBuilder()
                    .setDescription(`💃 Veces bailadas: ${interactionCounters.dance[interaction.user.id]}`)
                    .setColor('#e9c874')
                    .setTitle(`¡**${interaction.user.globalName}** bailó con **${member.globalName}**! 💃`) // Título centrado
                    .setImage(url)
                    .setFooter({ text: `${interaction.guild.name}`, iconURL: serverIconURL })
                    .setTimestamp()
                interaction.reply({ embeds: [embed] });
            } break;

            case 'feed': {
                const url = await anime.eating(); // Suponiendo que hay una función 'feed' similar a las otras que devuelve una URL de imagen
                const embed = new EmbedBuilder()
                    .setDescription(`🍽️ Veces alimentado: ${interactionCounters.feed[interaction.user.id]}`)
                    .setColor('#e9c874')
                    .setTitle(`¡**${interaction.user.globalName}** alimentó a **${member.globalName}**! 🍽️`) // Título centrado
                    .setImage(url)
                    .setFooter({ text: `${interaction.guild.name}`, iconURL: serverIconURL })
                    .setTimestamp()
                interaction.reply({ embeds: [embed] });
            } break;

            case 'cry': {
                const url = await anime.cry(); // Suponiendo que hay una función 'cry' similar a las otras que devuelve una URL de imagen
                const embed = new EmbedBuilder()
                    .setDescription(`😭 Veces llorado: ${interactionCounters.cry[interaction.user.id]}`)
                    .setColor('#e9c874')
                    .setTitle(`¡**${member.globalName}** hizo llorar a **${interaction.user.globalName}**! 😭`) // Título centrado
                    .setImage(url)
                    .setFooter({ text: `${interaction.guild.name}`, iconURL: serverIconURL })
                    .setTimestamp()
                interaction.reply({ embeds: [embed] });
            } break;

            case 'highfive': {
                const url = await anime.highfive(); // Suponiendo que hay una función 'highfive' similar a las otras que devuelve una URL de imagen
                const embed = new EmbedBuilder()
                    .setDescription(`🙌 Veces chocado: ${interactionCounters.highfive[interaction.user.id]}`)
                    .setColor('#e9c874')
                    .setTitle(`¡**${interaction.user.globalName}** chocó cinco con **${member.globalName}**! 🙌`) // Título centrado
                    .setImage(url)
                    .setFooter({ text: `${interaction.guild.name}`, iconURL: serverIconURL })
                    .setTimestamp()
                interaction.reply({ embeds: [embed] });
            } break;

            case 'bonk': {
                const url = await anime.bonk(); // Suponiendo que hay una función 'bonk' similar a las otras que devuelve una URL de imagen
                const embed = new EmbedBuilder()
                    .setDescription(`🔨 Veces bonkeado: ${interactionCounters.bonk[interaction.user.id]}`)
                    .setColor('#e9c874')
                    .setTitle(`¡**${interaction.user.globalName}** bonkeo a **${member.globalName}**! 🔨`) // Título centrado
                    .setImage(url)
                    .setFooter({ text: `${interaction.guild.name}`, iconURL: serverIconURL })
                    .setTimestamp()
                interaction.reply({ embeds: [embed] });
            } break;

            case 'bully': {
                const url = await anime.bully(); // Suponiendo que hay una función 'bully' similar a las otras que devuelve una URL de imagen
                const embed = new EmbedBuilder()
                    .setDescription(`🤕 Veces intimidado: ${interactionCounters.bully[interaction.user.id]}`)
                    .setColor('#e9c874')
                    .setTitle(`¡**${interaction.user.globalName}** intimidó a **${member.globalName}**! 🤕`) // Título centrado
                    .setImage(url)
                    .setFooter({ text: `${interaction.guild.name}`, iconURL: serverIconURL })
                    .setTimestamp()
                interaction.reply({ embeds: [embed] });
            } break;

            case 'cuddle': {
                const url = await anime.cuddle(); // Suponiendo que hay una función 'cuddle' similar a las otras que devuelve una URL de imagen
                const embed = new EmbedBuilder()
                    .setDescription(`🤗 Veces acurrucado: ${interactionCounters.cuddle[interaction.user.id]}`)
                    .setColor('#e9c874')
                    .setTitle(`¡**${interaction.user.globalName}** y **${member.globalName}** se acurrucaron! 🤗`) // Título centrado
                    .setImage(url)
                    .setFooter({ text: `${interaction.guild.name}`, iconURL: serverIconURL })
                    .setTimestamp()
                interaction.reply({ embeds: [embed] });
            } break;

            case 'wink': {
                const url = await anime.wink(); // Suponiendo que hay una función 'wink' similar a las otras que devuelve una URL de imagen
                const embed = new EmbedBuilder()
                    .setDescription(`😉 Veces guiñado: ${interactionCounters.wink[interaction.user.id]}`)
                    .setColor('#e9c874')
                    .setTitle(`¡**${interaction.user.globalName}** guiñó a **${member.globalName}**! 😉`) // Título centrado
                    .setImage(url)
                    .setFooter({ text: `${interaction.guild.name}`, iconURL: serverIconURL })
                    .setTimestamp()
                interaction.reply({ embeds: [embed] });
            } break;

            case 'poke': {
                const url = await anime.poke(); // Suponiendo que hay una función 'poke' similar a las otras que devuelve una URL de imagen
                const embed = new EmbedBuilder()
                    .setDescription(`👉 Veces picado: ${interactionCounters.poke[interaction.user.id]}`)
                    .setColor('#e9c874')
                    .setTitle(`¡**${interaction.user.globalName}** picó a **${member.globalName}**! 👉`) // Título centrado
                    .setImage(url)
                    .setFooter({ text: `${interaction.guild.name}`, iconURL: serverIconURL })
                    .setTimestamp()
                interaction.reply({ embeds: [embed] });
            } break;

            case 'stare': {
                const url = await anime.stare(); // Suponiendo que hay una función 'stare' similar a las otras que devuelve una URL de imagen
                const embed = new EmbedBuilder()
                    .setDescription(`😐 Veces mirado fijamente: ${interactionCounters.stare[interaction.user.id]}`)
                    .setColor('#e9c874')
                    .setTitle(`¡**${interaction.user.globalName}** miró fijamente a **${member.globalName}**! 😐`) // Título centrado
                    .setImage(url)
                    .setFooter({ text: `${interaction.guild.name}`, iconURL: serverIconURL })
                    .setTimestamp()
                interaction.reply({ embeds: [embed] });
            } break;

            case 'scream': {
                const url = await anime.scream();
                const embed = new EmbedBuilder()
                    .setDescription(`😱Veces Gritado: ${interactionCounters.scream[interaction.user.id]}`)
                    .setColor('#e9c874')
                    .setTitle(`¡**${interaction.user.globalName}** le gritó a **${member.globalName}**! 😱`) // Título centrado
                    .setImage(url)
                    .setFooter({ text: `${interaction.guild.name}`, iconURL: serverIconURL })
                    .setTimestamp()
                interaction.reply({ embeds: [embed] });
            } break;
        }
    }
};