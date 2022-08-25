const Discord = require('discord.js');
const path = require('path');
const fs = require('fs');
const config = require('../config.json');

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

    let addPubChannelMessageEmbed = await message.channel.send(
        new Discord.MessageEmbed()
            .setTitle('<:load:782586939705393193>・Ajout d\'un salon')
            .setColor('#2f3136')
            .setDescription('Hey ! Bienvenue dans le menu d\'ajout d\'un salon publicitaire. Pour ajouté le salon souhaité, envoyer ci-dessous la mention du salon voulu.\n\n*`Si vous souhaitez quittez, écrivez cancel à la place.`*')
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
        addPubChannelMessageEmbed.edit(
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
        return addPubChannelMessageEmbed.edit(
            new Discord.MessageEmbed()
                .setTitle('<:erreur:793859889444945970>・Erreur...')
                .setColor('#2f3136')
                .setDescription('Oops, on dirait que ce salon est introuvable. Assurez vous que je puisse voir le salon, ainsi que je puisse écrire dedans.')
                .setFooter(`${config.FOOTER}`)
        )
    }

    addpubchannel(message.guild.id, salon.id);
    addPubChannelMessageEmbed.edit(
        new Discord.MessageEmbed()
            .setTitle('<a:fleche:782582461510582312>・Succès')
            .setColor('#2f3136')
            .setDescription('Le salon <#' + salon.id + '> à correctement été ajouté !')
            .setFooter(`${config.FOOTER}`)
    )

    // Fonctions

    async function addpubchannel(serverID, channelID) {
        let server = require(path.resolve(path.join('..', 'container/database/main.json')));
        if(!server[serverID]){
            server[serverID] = {
                
            }
        }
        fs.writeFile(path.resolve(path.join('..', 'container/database/main.json')), JSON.stringify(server, null, 2), (err) => {
            if(err) console.log(err)
        });
    
        server = require(path.resolve(path.join('..', 'container/database/main.json')));
        let channel = server[serverID][channelID];
    
        if(!channel){
            server[serverID][channelID] = {
                slowmode: '',
                color: '#2f3136',
                bypassRole: 'Aucun',
                lastMessageID: 'Aucun'
            }
            server[serverID][channelID].messageEmbed = {
                description: '**»** [**Serveur Support**](${config.DISCORDLINK})\n**»** Si vous quittez, toutes vos pub seront supprimées.\n**»** Vous pouvez poster une pub toutes les **{slowmode}**.',
                footer: `${config.FOOTER}`
            }
        }
        fs.writeFile(path.resolve(path.join('..', 'container/database/main.json')), JSON.stringify(server, null, 2), (err) => {
            if(err) console.log(err)
        });
    
    }
}

module.exports.help = {
    name: 'addpubchannel',
    description: 'Ajoute un salon à la liste des salons publicitaires du serveur.',
    usage: 'addpubchannel'
}