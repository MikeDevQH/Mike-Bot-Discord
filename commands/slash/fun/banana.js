const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('banana')
    .setDescription('🍌 Mide tu banana')
    .addUserOption(option =>
      option.setName('usuario')
        .setDescription('Selecciona al usuario del que quieres ver la banana')
        .setRequired(false)),

  async execute(interaction) {
    try {
      // Verificar si interaction es undefined
      if (!interaction) {
        console.error("La interacción es indefinida.");
        return;
      }

      // Obtener el usuario seleccionado, o el usuario que inició la interacción si no se seleccionó ninguno
      const userOption = interaction.options?.getUser('usuario');
      const user = userOption || interaction.user;
      const displayName = user.username;

      // Puedes agregar más medidas si lo deseas
      const medidas = [
        { min: 1, max: 10, image: 'https://imgur.com/C7SIrCU.gif' },
        { min: 11, max: 20, image: 'https://imgur.com/AKIROow.gif' },
        { min: 21, max: 30, image: 'https://imgur.com/9b8BJuJ.gif' },
        { min: 31, max: 50, image: 'https://imgur.com/yspe88h.jpg' }
      ];

      // Obtener una medida aleatoria de la lista
      const medidaAleatoria = Math.floor(Math.random() * 50) + 1; // Genera un número aleatorio entre 1 y 50

      // Buscar el rango correspondiente a la medida aleatoria
      const rango = medidas.find(({ min, max }) => medidaAleatoria >= min && medidaAleatoria <= max);

      const embed = new EmbedBuilder()
        .setTitle(`La banana de ${displayName} mide...`)
        .setDescription(`${medidaAleatoria} cm 🍌`)
        .setColor(0xFFD700)
        .setImage(rango.image)
        .setFooter({
          text: `TamaInteractions`,
          iconURL: 'https://cdn.discordapp.com/avatars/1246959068883718165/d8b4894b32aa878981e719e6bf26ff88.png?size=1024'
      });
      interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error("Ocurrió un error:", error);
    }
  },
};