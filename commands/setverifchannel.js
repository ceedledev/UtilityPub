const Discord = require('discord.js');
const path = require('path');
const config = require('../config.json');
const fs = require('fs');

module.exports.run = async (client, message, args) => {
    if(!message.member.hasPermission('ADMINISTRATOR')){
        return message.channel.send(
            new Discord.MessageEmbed()
                .setTitle('<:erreur:793859889444945970>・Erreur...')
                .setColor('#2f3136')
                .setDescription("Il vous faut la permissions ``ADMINISTRATOR`` pour faire cette commande.")
                .setFooter(`${config.FOOTER}`)
        )
    }

    let removePubChannelMessageEmbed = await message.channel.send(
        new Discord.MessageEmbed()
            .setTitle('Ajout d\'un salon')
            .setColor('#2f3136')
            .setDescription('Hey ! Bienvenue dans le menu de setup du salon de vérification des publicité. Envoyer ci-dessous la mention du salon voulu.\n\n*`Si vous souhaitez quittez, écrivez cancel à la place.`*')
            .setFooter(`${config.FOOTER}`)
    )

    let error = false;
    let channel;
    await message.channel.awaitMessages(m => m.author.id === message.author.id, {
        max: 1,
        time: 30000,
        errors: ["time"]
    }).then(collected => {
        channel = collected.first().content;
        collected.first().delete();
    }).catch((err) => {
        error = true;
        removePubChannelMessageEmbed.edit(
            new Discord.MessageEmbed()
            .setTitle('<:erreur:793859889444945970>・Erreur...')
            .setColor('#2f3136')
            .setDescription("Vous n'avez pas entrer de salon. Annulation...")
            .setFooter(`${config.FOOTER}`)
        );
        return;
    });
    channel = channel.replace('<', '').replace('#', '').replace('>', '');
    if(channel === 'cancel'){
        return message.channel.send('Annulation...');
    }
    if(error) return;
    let salon = message.guild.channels.cache.find(c => c.id === channel);
    if(!salon){
        return removePubChannelMessageEmbed.edit(
            new Discord.MessageEmbed()
                .setTitle('<:erreur:793859889444945970>・Erreur...')
                .setColor('#2f3136')
                .setDescription('Oops, on dirait que ce salon est introuvable. Assurez vous que je puisse voir le salon, ainsi que je puisse écrire dedans.')
                .setFooter(`${config.FOOTER}`)
        )
    }

    let server = require(path.resolve(path.join('..', 'container/database/main.json')));
    if(!server[message.guild.id]){
        server[message.guild.id] = {

        }
    }
    let ch = server[message.guild.id][salon.id];

    if(ch){
        return removePubChannelMessageEmbed.edit(
            new Discord.MessageEmbed()
                .setTitle('<:erreur:793859889444945970>・Erreur...')
                .setColor('#2f3136')
                .setDescription('Ce salon ne peut pas être un salon publicitaire et un salon de pub en même temps.')
                .setFooter(`${config.FOOTER}`)
        )
    }

    setverifchannel(message.guild.id, salon.id);
    removePubChannelMessageEmbed.edit(
        new Discord.MessageEmbed()
            .setTitle('<a:fleche:782582461510582312>・Succès')
            .setColor('#2f3136')
            .setDescription('Le salon de vérification des publicité est désormais <#' + salon.id + '>')
            .setFooter(`${config.FOOTER}`)
    )
    salon.send(`**__Hey !__**\n\nVoici le salon de vérification des publicités. Pour vérifier une publicité, suivez le parterne de réaction ci-dessous.\n\n> \`✅\`・Accepter la publicité\n> \`❌\`・Refuser la publicité pour les raison suivantes :\n\n> \`1️⃣\`・**Contenue à caractère pornographique**\n> \`2️⃣\`・**Publicité pour un serveur invite reward.**\n> \`3️⃣\`・**Contenue à caractère raciste, haineux ou autre.**\n> \`4️⃣\`・**Lien d'invitation invalide.**\n> \`5️⃣\`・**Pub dans le mauvais salon.**\n> \`6️⃣\`・**Publicité sans description**\n> \`📛\`・**Mettre sa propre raison** *(Il faut avoir les mp ouverts)*\n\n:warning:・Si le bot ne met pas les réactions, c'est qu'il se fait rate limited *(Il en a mit trop)*. Vous devrez donc les ajouter à la main, mais pas d'inquiétude, ça marche pareil. Quand ça arrive, ça dure quelques dizaines de minutes.`)

    // Fonctions

    async function setverifchannel(serverID, channelID) {
        let server = require(path.resolve(path.join('..', 'container/database/verifchannel.json')));
        if(!server[serverID]){
            server[serverID] = {
                verifChannel: channelID
            }
        }else {
            server[serverID] = {
                verifChannel: channelID
            }
        }
        fs.writeFile(path.resolve(path.join('..', 'container/database/verifchannel.json')), JSON.stringify(server, null, 2), (err) => {
            if(err) console.log(err)
        });
    
    }
}

module.exports.help = {
    name: 'setverifchannel',
    description: 'Modifie le salon de vérification des publicités',
    usage: 'setverifchannel'
}