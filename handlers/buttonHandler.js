const fs = require('fs');
const path = require('path');

const loadButtons = (client) => {
    client.buttonHandlers = new Map();

    const buttonFiles = fs.readdirSync(path.join(__dirname, '../ButtonHandlers')).filter(file => file.endsWith('.js'));

    for (const file of buttonFiles) {
        try {
            const buttonHandler = require(path.join(__dirname, `../ButtonHandlers/${file}`));
            if (buttonHandler && buttonHandler.id) {
                client.buttonHandlers.set(buttonHandler.id, buttonHandler);
            } else {
                console.error(`Error al cargar el handler de botón en ${file}`);
            }
        } catch (error) {
            console.error(`Error al cargar el handler de botón en ${file}:`, error);
        }
    }

    console.log(`Loaded ${client.buttonHandlers.size} button handlers.`);
};

module.exports = {
    loadButtons,
};
