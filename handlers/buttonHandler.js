const fs = require('fs');
const path = require('path');

// Función para obtener todos los archivos en un directorio y sus subdirectorios
const getFilesRecursively = (directory) => {
    let files = [];
    const items = fs.readdirSync(directory);

    for (const item of items) {
        const fullPath = path.join(directory, item);
        if (fs.statSync(fullPath).isDirectory()) {
            files = files.concat(getFilesRecursively(fullPath));
        } else if (fullPath.endsWith('.js')) {
            files.push(fullPath);
        }
    }

    return files;
};

const loadButtons = (client) => {
    client.buttons = new Map();

    // Obtener todos los archivos de botones en las subcarpetas
    const buttonFiles = getFilesRecursively(path.join(__dirname, '../buttons'));

    for (const file of buttonFiles) {
        try {
            const buttonHandler = require(file);
            if (buttonHandler && buttonHandler.id) {
                client.buttons.set(buttonHandler.id, buttonHandler);
            } else {
                console.error(`Error al cargar el handler de botón en ${file}`);
            }
        } catch (error) {
            console.error(`Error al cargar el handler de botón en ${file}:`, error);
        }
    }

    console.log(`Loaded ${client.buttons.size} buttons.`);
};

module.exports = {
    loadButtons,
};
