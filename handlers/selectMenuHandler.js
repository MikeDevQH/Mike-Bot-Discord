const fs = require('fs');
const path = require('path');

const loadSelectMenus = (client) => {
    client.selectMenuHandlers = new Map();

    const selectMenuFiles = fs.readdirSync(path.join(__dirname, '../selectMenuHandlers')).filter(file => file.endsWith('.js'));

    for (const file of selectMenuFiles) {
        try {
            const selectMenuHandler = require(path.join(__dirname, `../selectMenuHandlers/${file}`));
            if (selectMenuHandler && selectMenuHandler.id) {
                client.selectMenuHandlers.set(selectMenuHandler.id, selectMenuHandler);
            } else {
                console.error(`Error al cargar el handler de menú desplegable en ${file}`);
            }
        } catch (error) {
            console.error(`Error al cargar el handler de menú desplegable en ${file}:`, error);
        }
    }

    console.log(`Loaded ${client.selectMenuHandlers.size} select menu handlers.`);
};

module.exports = {
    loadSelectMenus,
};
