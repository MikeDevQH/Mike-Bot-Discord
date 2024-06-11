module.exports = {
    id: 'selectCategory',
    async execute(interaction) {
        if (interaction.isStringSelectMenu()) {
            const selectedCategory = interaction.values[0]; // Obtiene el valor seleccionado

            // Guardar la categoría seleccionada en una propiedad del cliente
            interaction.client.selectedCategory = selectedCategory;

            await interaction.reply({ content: `Categoría seleccionada: ${selectedCategory}`, components: [], ephemeral: true });
        }
    }
};
