const { EmbedBuilder } = require('@discordjs/builders'); 
const fs = require('fs');
const path = require('path');

module.exports = (client) => {
    client.on('messageDelete', async message => {
        if (message.partial) await message.fetch();
        logMessageAction(message, 'deleted');
    });

    client.on('messageUpdate', async (oldMessage, newMessage) => {
        if (oldMessage.partial) await oldMessage.fetch();
        if (newMessage.partial) await newMessage.fetch();
        logMessageAction(oldMessage, 'updated', newMessage);
    });

    async function logMessageAction(message, action, newMessage = null) {
        const dataPath = path.resolve(__dirname, '../data/data.json');
        const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

        const msgLogChannelId = data.msgLogChannelId;
        if (!msgLogChannelId) return;

        const embed = new EmbedBuilder()
            .setFooter({ text: `${message.guild.name}`, iconURL: message.guild.iconURL() })
            .setTimestamp()
            .setColor(action === 'deleted' ? 0x3a69cb: 0x3a69cb)
            .setThumbnail(message.author.displayAvatarURL());

        if (action === 'deleted') {
            embed.setTitle('Mensaje eliminado')
                .setDescription(`**Autor:** ${message.author.tag}\n**Canal:** ${message.channel}\n**Mensaje:**\n\`\`\`${message.content}\`\`\``);
        } else if (action === 'updated') {
            embed.setTitle('Mensaje editado')
                .setFields({
                    name: 'Mensaje editado',
                    value: `**Autor:** ${message.author.tag}\n**Canal:** ${message.channel}\n**Mensaje original:**\n\`\`\`${message.content}\`\`\`\n**Mensaje nuevo:**\n\`\`\`${newMessage.content}\`\`\``,
                })
                .setURL(newMessage.url);
        }

        const msgLogChannel = message.guild.channels.cache.get(msgLogChannelId);
        if (!msgLogChannel) return;

        msgLogChannel.send({ embeds: [embed] });
    }
};
