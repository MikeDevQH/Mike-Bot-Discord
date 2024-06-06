const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('chiste')
    .setDescription('¿Quieres leer un chiste divertido?😂'),

  async execute(interaction) {
    // Pueden agregar más si les gusta.
    const chistes = [
      '¿Qué hace una abeja en el gimnasio? ¡Zum-ba!',
      '¿Qué hace una impresora en el gimnasio? ¡Da muchos documentos en poco tiempo!',
      '¿Cuál es el animal más antiguo? La cebra, ¡porque está en blanco y negro!',
      '¿Cómo se dice pañuelo en japonés? Sakasnoto',
      '¿Por qué los pájaros no usan Facebook? Porque ya tienen Twitter.',
      '¿Cuál es el café más peligroso del mundo? ¡Ex-preso!',
      '¿Cómo maldice un pollito a otro pollito? ¡Cal-dito seas!',
      '¿Cuál es el colmo de Aladino? Tener mal genio.',
      '¿Cuál es el animal más antiguo? La cebra, ¡porque está en blanco y negro!',
      '¿Cuál es el colmo de un jardinero? Tener malas plantas.',
      '¿Cuál es el colmo de un electricista? No encontrar su corriente de trabajo.',
      '¿Cuál es el colmo de un jardinero? Tener malas plantas.',
      '¿Cuál es el colmo de un astronauta? Tener mal espacio.',
      '¿Cómo se dice pañuelo en japonés? Sakasnoto',
      '¿Por qué los pájaros no usan Facebook? Porque ya tienen Twitter.',
      'Me sacaron del grupo de WhatsApp de paracaidismo, Se ve que no caía bien',
'¿Sabes cuánta leche da una vaca en su vida? Pues la misma que en bajada',
'¿Cuál es el colmo de un peluquero? Descubrir que en la vida nada es permanente',
'¿Qué le dice un jardinero a otro? Seamos felices mientras podamos',
'Eliminar correos no deseados es muy fácil: spam comido',
'¿Cómo se llama el hermano vegano de Bruce Lee? Broco Lee',
'¿Qué dice una cereza mirándose al espejo? "¿Ceré eza?"',
'¿Cuál es el peinado favorito de los carteros? Los tirabuzones',
'¿Qué hace un tupper en el bosque? Tupperdío',
'Si los ciempiés tienen 100 pies, ¿entonces los piojos tienen 3,14 ojos?',
'¿Por qué las monjas no llevan sandalias? Porque son devotas',
'¿Por qué la gallina cuida tanto a sus pollitos? Porque le costó un huevo tenerlos',
'¿Qué le dice el 3 al 30? Para ser como yo debes ser sincero',
'¿Cuál es el superhéroe de los perros? El dóberman',
'Si los zombis llegan a la tercera edad, ¿zombiejitos?',
'¿Por qué la luna es más grande que el sol? Porque la dejan salir de noche',
'¿Cuál es el colmo de un puerco espín? Que le dé mala espina',
'Van 2 videntes en una moto y se cae el del médium',
'¿Qué le dice un semáforo en amarillo a los coches? "No me miren, que me estoy cambiando"',
'¿Cuál es el idioma de las tortugas? El tortugués',
'¿Por qué los gatos no van al baile? Porque les asusta el perreo',
'Ayer me caí y pensé que me había roto el peroné, Peronó',
'¿Qué hace un perro con un taladro? Ta ladrando',
'¿Por qué todo el mundo siempre habla con esa zapatilla? Porque dice converse',
'Conocí a mi novia en un ascensor, Dice que soy el amor de subida',
'¿Qué le dice un techo a otro? "Techo de menos"',
'Qué mal me caen los químicos: los sodio',
'En Hawái no te hospedan: te alohan',
'¿Qué tiene Papá Noel cuando le falta un reno? Insuficiencia renal',
'¿Qué hace Batman en el batmóvil cuando hace frío? Batiritando',
'¿Cuál es el colmo de una jirafa? Tener dolor de garganta',
'¿Qué guarda Darth Vader en su nevera? Helado oscuro',
'¿Por qué no se puede discutir con un DJ? Porque siempre cambia de tema',
'¿Cómo se emborrachan los pingüinos? Con Licor del Polo',
'¿Qué hace un pez en el cine? Nada: es un MERO espectador',
'¿Cuál es la planta que más miedo da? El bamBÚ',
'¿Qué pasa si te encuentras con la persona que te gusta por la calle? Que os habéis crushado',
'¿Qué le dice el 0 al 8? "Bonito cinturón"',
'¿Qué dice un pez mago? "Nada por aquí, nada por allá"',
'¿Cuál es el ave que siempre hace sus nidos en las iglesias? El Ave María',
'¿Cuál es el animal que libera al mono? El salmonete',
'¿Qué dice el pollito más listo? "3,14 3,14"',
'¿Sabes qué coche usa Papá Noel? Fácil: un Renol',
'¿Quién es el padre de ET? Donette',
'¿Cuál es el colmo de un oso panda? Que le saquen una foto a color y salga en blanco y negro',
'¿Qué le dice la foca a su madre? "I love you, mother foca"',
'¿Por qué Bob Esponja no va al gimnasio? Porque ya está cuadrado',
'¿Qué pasa si se va la luz en una escuela privada? Que no se ve ni un pijo',
'¿Qué le dice una morsa a otra morsa? "¿Almorsamos o qué?"',
'¿Sabes por qué los de Lepe plantan los naranjos de 3 en 3? Para hacer trinaranjus',
'¿Qué hace un boli Bic en el aire? AeroBic',
'Me han dado planton, ¿Como a las ballenas?',
'Doctor, doctor, auscúlteme, ¡Rápido, rápido, al armario!',
'¿Por qué los patos no tienen amigos? Porque son muy antipáticos',
'Había un tipo que era tan borracho, pero tan borracho que le llamaban "genio" porque cada vez que destapaban una botella aparecía',
'¿Cuál es el animal favorito de Drácula? El caballo de pura sangre',
'¿A qué actor se le da siempre el pésame? A Johnny DEP',
'Si somos vecinos, y yo vivo abajo y tu vives arriba, ¿podríamos decir que «techo de menos»?',
'¿Cuál es el animal más antiguo del mundo…? El pingüino, porque está en blanco y negro',
'¿Qué pasa si tiras un pato al agua? Nada',
'Gutiérrez, necesito el informe anual de resultados, para adjuntarlo al expediente de su despido, —¿PARA QUÉ? —Paraguayo',
'Hola, ¿está Conchita…? No, estoy con Tarzán',
'¿Cuál es la fruta más divertida? La naranja ja ja ja ja',
'Abuelo, ¿por qué estás delante del ordenador con los ojos cerrados? Es que Windows me ha dicho que cierre las pestañas',
'Señora, disculpe pero su vuelo se ha demorado, ¡Ay, que emoción, es mi color favorito!',
'Deme dos barras de pan, por favor, Y si tiene huevos, dos docenas, Y le dio 24 barras de pan',
'¿Cuál es el colmo de un arquitecto? Construir castillos en el aire',
'Soy celíaca, Encantado, yo Antoniaco',
'¿Por qué le dio un paro cardiaco a la impresora? Parece que tuvo una impresión muy fuerte',
'¿Qué le dice un espagueti a otro? ¡El cuerpo me pide salsa?',
'Dos leperos van al médico y ven un cartel: "CONSULTA DE 4 A 7", Así que uno de ellos le dice al otro: Oye, que solo somos dos, vamos a buscar otra pareja de enfermos',
'¿En qué se parece una suegra a un nubarrón? En que cuando se marchan se queda una buena tarde',
'¿Por qué el mar no se seca? Porque no tiene toalla',
'Doctor, creo que necesito gafas, Estoy de acuerdo, pero no puedo ayudarle, ¡esto es un banco!',
'¿Cuál es el colmo de una azafata? Enamorarse del piloto automático',
'¿Cómo se llama el hermano más limpio de Bruce Willis? Kevin Willis',
'¿Cuáles eran los dibujos animados preferidos del capitán del Titanic? Timón y PUMBA',
'¿De qué murió Jack Sparrow? De un disparrow',
'¿Cómo se les llama a 2 zombis que hablan distintas lenguas? Zombilingües',
'¿Cómo se despiden los químicos? Ácido un gusto',
'Una vez conté un chiste químico, pero no hubo reacción',
'¿Cómo queda un mago después de comer? Magordito',
'Un león se comió un jabón, Y ahora es puma',
'¿Por qué las focas del circo miran siempre hacia arriba? Porque es dónde están los focos',
'¿Sabes por qué el mar es azul? Porque los peces dicen "Blue, blue, blue blue"',
'¿Por qué un mago no sería bueno en el boxeo? Porque sería el magolpeado',
'¿Quién es el papá del príncipe azul? El Blu-ray',
'¿Cuál es el nombre del pez que cae de un cuarto piso? Aaaaaaaaaaaaaaaaaahhhhhh... ¡tún!',
'¿Qué hace un mudo bailando? Una mudanza',
'¿Cómo va Batman a su funeral? Batieso',
'Albino se perdió en el bosque, así que su papá disparó 2 tiros al aire porque al PAN PAN y albino vino',
'Van 2 soldados en una moto y no se pueden bajar nunca, ¿Sabes por qué? Ya te lo he dicho: porque van soldados',
'Se abre el telón, Acto 1: una piedra, Acto 2: la misma piedra, Acto 3: sigue siendo la misma piedra, Se cierra el telón, ¿Nombre de la obra? Rocky 3',
'¿De dónde sale la porcelana? De las porceovejas',
'Tengo un amigo otaku que estaba triste, así que lo animé',
'¿Cuál es el colmo de un gallo? Que se le ponga la piel de gallina',
'¿Cómo se llama un bumerán que no vuelve? Palo',
'Todo en la vida es pasajero, Menos el chófer',
'Ayer fui al McDonalds con 4 amigos, 3 eran de sagitario, Y el cuarto de libra',
'Hola, me llamo Joe, ¿Cómo es tu apellido? Lio: Joe Lio',
'Le dije a mi abuela que la tele estaba muy alta y se subió a una silla',
'He abierto un negocio de colchones, Y me ha ido tan bien, que he tenido que abrir otro para no dormir en este',
'Perdí mi reloj en un concurso de comedores de espaguetis, Ahora tengo un tiempo increíble',
'Una vez quise crear una palabra nueva y la conseguí, pero la RAE no me la aceptó, le faltó adeJEctivo',
'El otro día saqué la cuenta de las tazas de café que me he tomado, Y me salió descafeinada',
'¿Por qué los zapatos del espantapájaros siempre están nuevos? Porque nadie los pisa',
'¿Por qué el astronauta rompió con su pareja? Porque necesitaba espacio',
'¿Cuál es el pez más divertido? El pez payaso',
'¿Cuál es el mar más electrizante? El marcapasos',
'¿Qué le dice una iguana a su hermana gemela? Somos iguanitas',
'¿Qué hace un carpintero en el siglo XXI? Publica un tweet',
'¿Qué hace un pez en un gimnasio? Nada de nada',
'¿Cómo llaman a los hijos del pez payaso? Paquetes de risa',
'Doctor, doctor, tengo un problema, que nadie me hace caso, —El siguiente, por favor',
'No se puede vivir en un globo: ¡es muy globoroso!',
'¿Qué hace un cocodrilo en una autopista? Esperando un rato',
'¿Qué hace una abeja en el gimnasio? Zum-ba',
'¿Cómo llamas a un avión que pierde su vuelo? Avión perdido',
'¿Qué pasa si un día decides dejar de ir al gimnasio? Que tienes un día de reposo',
'Buenos días, busco trabajo, ¿Le interesa la jardinería? ¡Sí, lo tengo plantado!',
'¿Cuál es el país con mejor carácter? Ecuador',
'¿Por qué los peces no cantan? Porque desafinan',
'¿Qué hace un piojo en la cabeza de un calvo? Turismo',
'¿Qué hizo un pez después de haber visto una película de terror? No dormir nada',
      '¿Cuál es el café más peligroso del mundo? ¡Ex-preso!',
      '¿Qué hace una impresora en el gimnasio? ¡Da muchos documentos en poco tiempo!',
    ];

   
   try {
    // Obtener un chiste aleatorio de la lista
    const chisteAleatorio = chistes[Math.floor(Math.random() * chistes.length)];

    // Obtener el icono del servidor
    const serverIconURL = interaction.guild.iconURL();

    // Crear el embed del chiste
    const embed = new EmbedBuilder ()
      .setTitle ('¡Chiste Divertido!')
      .setDescription (chisteAleatorio + ' 😄') 
      .setColor (0x3498db) 
      .setImage ('https://imgur.com/mf1Hjt9.gif')
      .setFooter({ text: `${interaction.guild.name}`, iconURL: serverIconURL })
       .setTimestamp()
    
       // Mandar el embed del chiste
      await interaction.reply({ embeds: [embed] });
   
    } catch(error) {
      console.error(error);
      return interaction.reply({ content: 'Hubo un error al obtener el chiste', ephemeral: true });

    }
    // Simular risas después de 2 segundos
    setTimeout(() => {
      interaction.followUp('¡Ja, ja, ja! ¡Ese chiste fue genial!');
    }, 2000);
  },
}; 
