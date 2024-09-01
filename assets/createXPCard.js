const { createCanvas, loadImage } = require('@napi-rs/canvas');

// Registrar la fuente antes de crear el canvas
async function createXpCard(username, xp, level, nextLevelXP, rank, avatarURL, status) {
    const width = 886;
    const height = 210;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Crear un degradado lineal de azul a un azul más claro
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#0044cc'); // Azul oscuro
    gradient.addColorStop(1, '#66b3ff'); // Azul claro

    ctx.fillStyle = gradient; // Establecer el degradado como color de relleno
    ctx.beginPath();
    ctx.roundRect(0, 0, width, height, 20);
    ctx.fill();

    const avatar = await loadImage(avatarURL);
    ctx.save();
    ctx.beginPath();
    ctx.arc(97.5, 105.5, 80.5, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatar, 17, 25, 161, 161);
    ctx.restore();

    // Dibujar el borde del avatar
    ctx.lineWidth = 6; // Grosor del borde
    ctx.strokeStyle = '#ffffff'; // Color del borde blanco para buen contraste
    ctx.beginPath();
    ctx.arc(97.5, 105.5, 80.5, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.stroke();

    // Determinar el color del punto de estado según el estado del usuario
    let statusColor;
    switch (status) {
        case 'online':
            statusColor = '#43B581'; // Verde
            break;
        case 'idle':
            statusColor = '#FAA61A'; // Amarillo
            break;
        case 'dnd':
            statusColor = '#F04747'; // Rojo
            break;
        case 'offline':
        case 'invisible':
            statusColor = '#747F8D'; // Gris
            break;
        default:
            statusColor = '#747F8D'; // Por defecto gris si el estado es desconocido
    }

    ctx.fillStyle = statusColor;
    ctx.beginPath();
    ctx.arc(160.5, 158.5, 19.5, 0, Math.PI * 2, true);
    ctx.fill();

    // Estilizar el texto
    ctx.fillStyle = '#ffffff'; // Blanco para el texto sobre el fondo azul
    ctx.font = 'bold 39px Inter';
    ctx.fillText(username, 251, 122);

    ctx.font = '27px Inter';
    ctx.fillText(`${xp}/${nextLevelXP} XP`, 709, 133);

    ctx.fillText(`RANK #${rank}`, 597, 65);

    // Dibujar texto de Nivel
    ctx.fillText(`LEVEL ${level}`, 740, 65);

    // Estilizar la barra de nivel
    ctx.fillStyle = '#003366'; // Azul oscuro para el fondo de la barra de nivel
    ctx.beginPath();
    ctx.roundRect(234, 148, 632, 36, 18);
    ctx.fill();

    const minXPWidth = 40;
    const xpWidth = Math.max(minXPWidth, (xp / nextLevelXP) * 620);

    ctx.fillStyle = '#66b3ff'; // Azul claro para el progreso de la barra
    ctx.beginPath();

    if (xpWidth <= minXPWidth) {
        ctx.roundRect(234, 148, minXPWidth, 36, 18);
    } else {
        ctx.roundRect(234, 148, xpWidth, 36, 18);
    }

    ctx.fill();

    return canvas.toBuffer('image/png');
}

module.exports = { createXpCard };
