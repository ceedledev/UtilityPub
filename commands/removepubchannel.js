const Discord = require('discord.js');
const path = require('path');
const fs = require('fs');

module.exports.run = async (client, message, args) => {
    if(!message.member.hasPermission('ADMINISTRATOR')){
        return message.channel.send(
            new Discord.MessageEmbed()
                .setTitle('<:erreur:793859889444945970>・Erreur...')
                .setColor('#2f3136')
                .setDescription("Il vous faut la permissions ``ADMINISTRATOR`` pour faire cette commande.")
                .setFooter('🛡️・Rezz#0001')
        )
    }

    let removePubChannelMessageEmbed = await message.channel.send(
        new Discord.MessageEmbed()
            .setTitle('<:load:782586939705393193>・Ajout d\'un salon')
            .setColor('#2f3136')
            .setDescription('Hey ! Bienvenue dans le menu de suppression d\'un salon publicitaire. Pour supprimer le salon souhaité, envoyer ci-dessous la mention du salon voulu.\n\n*`Si vous souhaitez quittez, écrivez cancel à la place.`*')
            .setFooter('🛡️・Rezz#0001')
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
            .setFooter('🛡️・Rezz#0001')
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
                .setFooter('🛡️・Rezz#0001')
        )
    }

    let server = require(path.resolve(path.join('..', 'container/database/main.json')));
    let ch = server[message.guild.id][salon.id];

    if(!ch){
        return removePubChannelMessageEmbed.edit(
            new Discord.MessageEmbed()
                .setTitle('<:erreur:793859889444945970>・Erreur...')
                .setColor('#2f3136')
                .setDescription('Ce salon n\'est pas défini en tant que salon publicitaire.')
                .setFooter('🛡️・Rezz#0001')
        )
    }

    removepubchannel(message.guild.id, salon.id);
    removePubChannelMessageEmbed.edit(
        new Discord.MessageEmbed()
            .setTitle('<a:fleche:782582461510582312>・Succès')
            .setColor('#2f3136')
            .setDescription('Le salon <#' + salon.id + '> à correctement été supprimé !')
            .setFooter('🛡️・Rezz#0001')
    )

    // Fonctions

    async function removepubchannel(serverID, channelID) {
        let server = require(path.resolve(path.join('..', 'container/database/main.json')));
        delete server[serverID][channelID];
        fs.writeFile(path.resolve(path.join('..', 'container/database/main.json')), JSON.stringify(server, null, 2), (err) => {
            if(err) console.log(err)
        });
    
    }
}

module.exports.help = {
    name: 'removepubchannel',
    description: 'Enlève un salon de la liste des salons de publicité',
    usage: 'removepubchannel'
}