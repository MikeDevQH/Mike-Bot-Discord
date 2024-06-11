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

const loadModals = (client) => {
    client.modals = new Map();

    const modalFiles = getFilesRecursively(path.join(__dirname,'../modals'));

    for (const file of modalFiles) {
        try {
            const modalHandler = require(file)
            if (modalHandler && modalHandler.id) {
                client.modals.set(modalHandler.id, modalHandler);
            } else {
                console.error(`Error al cargar el handler de modal en ${file}`);
            }
        } catch (error) {
            console.error(`Error al cargar el handler de modal en ${file}:`, error);
        }
    }

    console.log(`Loaded ${client.modals.size} modals.`);
};

module.exports = {
    loadModals,
};
