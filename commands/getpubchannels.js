const Discord = require('discord.js');
const path = require('path');
const config = require('../config.json');

module.exports.run = async (client, message, args) => {
    if(!args[0]){
        let texte = '__Voici la liste des salons de publicité du serveur.__ Pour plus d\'informations concernant un salon spécifique, faites ``&getpubchannels #salon``.\n';
        const channels = require(path.resolve(path.join('..', 'container/database/main.json')));
        for(channel in channels[message.guild.id]){
            texte = texte + `\n> <#${channel}>, **ID**: ${channel}`;
        }
        message.channel.send(
            new Discord.MessageEmbed()
                .setTitle('<:load:782586939705393193>・Salons de publicité')
                .setColor('#2f3136')
                .setDescription(texte + '\n\nPour en ajouter, faites ``&addpubchannel`` et pour en enlever, ``&removepubchannel``.')
                .setFooter(`${config.FOOTER}`)
        )
    } else if(args[0]){
        let salon = message.mentions.channels.first();
        if(salon){
            let texte = '__Voici les informations sur le salon publicitaire__ <#' + salon + '>.\n';
            const channels = require(path.resolve(path.join('..', 'container/database/main.json')));
            const channel = channels[message.guild.id][salon.id];
            let bypassRole = channel.bypassRole;
            if(bypassRole === '[]'){
                bypassRole = 'Aucun'
            }
            return message.channel.send(
                new Discord.MessageEmbed()
                    .setTitle('<:load:782586939705393193>・Informations sur un salon de publicité')
                    .setColor('#2f3136')
                    .setDescription(texte + `\n> **Slowmode**: ${channel.slowmode}\n> **Rôle ignorés:** ${bypassRole}\n> **Messages:**\n> ・**Description** \n\`\`\`${channel.messageEmbed.description}\`\`\`\n> ・**Couleur:** ${channel.color}\n> ・**Footer:** ${channel.messageEmbed.footer}`)
                    .setFooter(`${config.FOOTER}`)
            )
        } else {
            return message.channel.send(
                new Discord.MessageEmbed()
                    .setTitle('<:erreur:793859889444945970>・Erreur...')
                    .setColor('#2f3136')
                    .setDescription('Ce salon est introuvable. Assurez vous que j\'y ai bien accès.')
                    .setFooter(`${config.FOOTER}`)
                )
        }
        
    }
    
}

module.exports.help = {
    name: 'getpubchannels',
    description: 'Donne la liste des salons de publicité du serveur',
    usage: 'getpubchannels <#salon>'
}