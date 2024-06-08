# Mike 🤖

Mike es un bot de Discord que proporciona varias funcionalidades útiles para gestionar tu servidor de Discord. Este bot incluye comandos para gestionar entrenimiento, moderación, y más.

## ✨ Características

- 🔗 Integraciones con varias API.
- ⚙️ Responder a comandos personalizados(slash y prefix).
- 🎟️ Sistema de tickets y registros
- 🛡️ Sistema de moderación y registros.
- 🔒 Sistema de automoderación

## 📋 Requisitos

- 📦 Node.js v20 o superior.
- 📦 npm (Node Package Manager).
- 👤 Una cuenta de Discord y un servidor donde tengas permisos de administrador.
- 🛠️ Un bot de Discord configurado en el [Portal de Desarrolladores de Discord](https://discord.com/developers/applications).

## 🚀 Instalación

1. Clona este repositorio:
   ```bash
   git clone https://github.com/MichaelQhdez/Mike-Bot.git
   cd Mike-Bot
   ```
   
2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Crea un archivo .env en la raíz del proyecto y añade tu token de bot de Discord y la uri de MongoDB ya sea local o en la nube:
   ```env
   DISCORD_TOKEN=your-bot-token-here
   MONGO_URI=your-URI-here
   ```

4. Crea un archivo config.json en la carpeta `config` y configura tu ID de cliente:
   ```json
   {
      "clientId": "your-client-id-here",
   }
   ```

5. Inicia el bot:

   ```bash
   node index.js
   ```

## 🔗 Invitación 
- 🚀 Para invitar a **Mike** a tu servidor sigue estos sencillos pasos: 

1. Haz clic en el siguiente enlace para invitarlo: [Invitar Bot](https://discord.com/oauth2/authorize?client_id=1241620050683891752&permissions=8&integration_type=0&scope=applications.commands+bot)
2. Selecciona el servidor donde quieres agregar el bot.
3. Otorga los permisos necesarios y haz clic en "Autorizar".
4. ¡Listo! 🎉 Ahora **Mike** está en tu servidor y listo para usar.

## 🤝 Contribuciones
- Las contribuciones son bienvenidas. Por favor, abre un issue para discutir cualquier cambio importante antes de enviar un pull request.


### *¡Gracias por usar el bot! ❤️*
