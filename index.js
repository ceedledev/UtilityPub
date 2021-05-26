const Discord = require('discord.js');
const client = new Discord.Client({disableEveryone: true});
client.commands = new Discord.Collection();
client.config = require('./config.json')
const fs = require('fs');
const keepAlive = require('./server')
const path = require('path')

fs.readdir('./commands/', (error, f) => {
    if (error) { return console.error(error); }
        let commandes = f.filter(f => f.split('.').pop() === 'js');
        if (commandes.length <= 0) { return console.log('Aucune commande trouvée !'); }

        commandes.forEach((f) => {
            let commande = require(`./commands/${f}`);
            console.log(`${f} commande chargée !`);
            client.commands.set(commande.help.name, commande);
        });
});

fs.readdir('./events/', (error, f) => {
    if (error) { return console.error(error); }
        console.log(`${f.length} events chargés`);

        f.forEach((f) => {
            let events = require(`./events/${f}`);
            let event = f.split('.')[0];
            client.on(event, events.bind(null, client));
        });
});

client.on('ready', () => {
    client.user.setActivity(`Chargement...`)
    console.log('Bot en ligne ')
})

client.on('message', message => {
    client.user.setActivity(`&help・Kziiz#0001 ❤️`, 'WATCHING')
})

//Ne marche pas !

client.on('guildMemberRemove', async (member) => {
  let salons = require(path.resolve(path.join('..', 'container/database/main.json')));
  salons = salons[member.guild.id];
  for(salon in salons){
    let s = member.guild.channels.cache.find(c => c.id === salon)
    s.messages.fetch().then(messages => {
      const msgs = messages.filter(m => m.author.id === member.id)
      msgs.forEach(m => {
        m.delete()
      })
    })
  }
})

client.on('guildCreate', async (guild) => {
    client.users.cache.get("769835325774102528").send("J'ai été ajouté au serveur " + guild.name + ". Je suis désormais sur " + client.guilds.cache.size + " serveurs.");

    let c = client.channels.cache.get('794241344070484019')

    let m = await c.send(
      new Discord.MessageEmbed()
        .setAuthor(guild.owner.user.tag, guild.owner.user.displayAvatarURL({format: 'png', dynamic: 'true'}))
        .setColor('#2f3136')
        .setDescription(`Un utilisateur m'a ajouté à son serveur. Grâce à lui, je suis sur **${client.guilds.cache.size}** serveurs, et je compte **${client.users.cache.size}** utilisateurs.`)
    )

    m.react('🧸')
});

client.on('guildDelete', async (guild) => {
  let c = client.channels.cache.get('794241344070484019')

    let m = await c.send(
      new Discord.MessageEmbed()
        .setAuthor(guild.owner.user.tag, guild.owner.user.displayAvatarURL({format: 'png', dynamic: 'true'}))
        .setColor('#2f3136')
        .setDescription(`Un utilisateur m'a retiré de son serveur. Je suis désormais sur **${client.guilds.cache.size}** serveurs, et je compte **${client.users.cache.size}** utilisateurs.`)
    )
    m.react('🧸')
})

keepAlive()
client.login(client.config.TOKEN)