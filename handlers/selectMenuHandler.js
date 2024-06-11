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
        }else if (fullPath.endsWith('.js')) {
            files.push(fullPath);
        }
    }

    return files;
}

const loadSelectMenus = (client) => {
    client.selectMenus = new Map();

    // Obtener todos los archivos de menu desplegable en las subcarpetas
    const selectMenuFiles = getFilesRecursively(path.join(__dirname, '../selectMenus'))

    for (const file of selectMenuFiles) {
        try {
            const selectMenuHandler = require(file);
            if (selectMenuHandler && selectMenuHandler.id) {
                client.selectMenus.set(selectMenuHandler.id, selectMenuHandler);
            } else {
                console.error(`Error al cargar el handler de menú desplegable en ${file}`);
            }
        } catch (error) {
            console.error(`Error al cargar el handler de menú desplegable en ${file}:`, error);
        }
    }

    console.log(`Loaded ${client.selectMenus.size} select menus.`);
};

module.exports = {
    loadSelectMenus,
};
