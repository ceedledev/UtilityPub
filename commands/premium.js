const Discord = require('discord.js');
const path = require('path');
const fs = require('fs');
const config = require('../config.json')
const moment = require('moment');

module.exports.run = async (client, message, args) => {
    if(message.author.id != `${config.OWNERID}` && message.author.id != `${config.OWNERID_2}`){
        return message.channel.send(
            new Discord.MessageEmbed()
                .setTitle('<:erreur:793859889444945970>・Erreur...')
                .setColor('#2f3136')
                .setDescription(`Seuls ${config.OWNERID} et ${config.OWNERID_2} peuvent ajouter, ou retirer le premium à un utilisateur.`)
                .setFooter(`${config.FOOTER}`)
        )
    }

    if(!args[0]){
        return message.channel.send(
            new Discord.MessageEmbed()
                .setTitle('<:erreur:793859889444945970>・Erreur...')
                .setColor('#2f3136')
                .setDescription(`Veuillez entrer un argument supplémentaire. __Exemple de commande__ : \`${config.PREFIX}premium add/info/remove @mention/id\``)
                .setFooter(`${config.FOOTER}`)
        )
    }

    if(!args[1]){
        return message.channel.send(
            new Discord.MessageEmbed()
                .setTitle('<:erreur:793859889444945970>・Erreur...')
                .setColor('#2f3136')
                .setDescription(`Veuillez préciser l'utilisateur. __Exemple de commande__ : \`${config.PREFIX}premium add/info/remove @mention/id\``)
                .setFooter(`${config.FOOTER}`)
        )
    }

    let user = message.mentions.users.first() || client.users.cache.get(args[1]);

    if(!user){
        return message.channel.send(
            new Discord.MessageEmbed()
                .setTitle('<:erreur:793859889444945970>・Erreur...')
                .setColor('#2f3136')
                .setDescription(`Cet utilisateur est introuvable. Assurez vous qu'il ait au moins un serveur en commun avec le bot.`)
                .setFooter(`${config.FOOTER}`)
        )
    }

    if(args[0] === 'add'){
        let premiums = require(path.resolve(path.join('..', 'container/database/premium.json')));
        premiums[user.id] = {
            hasPremium: 'true',
            depuis: moment(new Date()).format('DD/MM/YY'),
            par: message.author.tag
        }
        fs.writeFile(path.resolve(path.join('..', 'container/database/premium.json')), JSON.stringify(premiums, null, 2), (err) => {
            if(err) console.log(err)
        });

        if(premiums[user.id] === true){
            return message.channel.send(
                new Discord.MessageEmbed()
                    .setTitle('<:erreur:793859889444945970>・Erreur...')
                    .setColor('#2f3136')
                    .setDescription('Cette utlisateur à déjà le premium.')
                    .setFooter(`${config.FOOTER}`)
            )
        }

        user.send(
            new Discord.MessageEmbed()
                .setAuthor(user.tag, user.displayAvatarURL({format: 'png', dynamic: 'true'}))
                .setColor('#2f3136')
                .setDescription(`Merci pour l'aide précieuse que vous nous offrez, nous vous offrons des avantages sur le bot, pour pouvoir modifier plus de choses.\n\nSi ce n'est pas déjà fait, je vous invite à rejoindre le serveur support en cliquant [ici](https://discord.gg/nbtcRnSZdU).\n\n**__Bonne journée !__**`)
                .setFooter(`${config.FOOTER}`)
        )

        message.channel.send(
            new Discord.MessageEmbed()
                .setTitle('<a:fleche:782582461510582312>・Succès')
                .setColor('#2f3136')
                .setDescription(`L'utilisateur \`${user.tag}\` à correctement reçu les avantages premiums.`)
                .setFooter(`${config.FOOTER}`)
        )

        let supportGuild = client.guilds.cache.get(`${config.GUILDID}`);
        let userIsInSupportGuild = supportGuild.members.cache.find(u => u.id === user.id);
        let role = supportGuild.roles.cache.find(r => r.id === `${config.PREMIUMIDROLE}`)
        if(userIsInSupportGuild){
            userIsInSupportGuild.roles.add(role.id)
        }
    } else if(args[0] === 'remove'){
        let premiums = require(path.resolve(path.join('..', 'container/database/premium.json')));
        premiums[user.id] = {
            hasPremium: false,
            depuis: 'Aucun grade premium',
            par: message.author.tag
        }
        fs.writeFile(path.resolve(path.join('..', 'container/database/premium.json')), JSON.stringify(premiums, null, 2), (err) => {
            if(err) console.log(err)
        });

        if(premiums[user.id] === false){
            return message.channel.send(
                new Discord.MessageEmbed()
                    .setTitle('<:erreur:793859889444945970>・Erreur...')
                    .setColor('#2f3136')
                    .setDescription('Cette utlisateur n\'a pas le premium.')
                    .setFooter(`${config.FOOTER}`)
            )
        }

        user.send(
            new Discord.MessageEmbed()
                .setAuthor(user.tag, user.displayAvatarURL({format: 'png', dynamic: 'true'}))
                .setColor('#2f3136')
                .setDescription(`Un administrateur du bot vous à retiré les avantages premium. Si vous pensez que c'est une erreur, veuillez vous rendre sur le serveur support en cliquant [ici](https://discord.gg/nbtcRnSZdU) et faire une demande.\n\n**__Bonne journée !__**`)
                .setFooter(`${config.FOOTER}`)
        )

        message.channel.send(
            new Discord.MessageEmbed()
                .setTitle('<a:fleche:782582461510582312>・Succès')
                .setColor('#2f3136')
                .setDescription(`L'utilisateur \`${user.tag}\` à correctement perdu les avantages premiums.`)
                .setFooter(`${config.FOOTER}`)
        )

        let supportGuild = client.guilds.cache.get(`${config.GUILDID}`);
        let userIsInSupportGuild = supportGuild.members.cache.find(u => u.id === user.id);
        let role = supportGuild.roles.cache.find(r => r.id === `${config.PREMIUMIDROLE}`)
        if(userIsInSupportGuild){
            userIsInSupportGuild.roles.remove(role.id)
        }
    } else if(args[0] === 'info'){
        let premiums = require(path.resolve(path.join('..', 'container/database/premium.json')));
        message.channel.send(
            new Discord.MessageEmbed()
                .setAuthor(user.tag, user.displayAvatarURL({format: 'png', dynamic: 'true'}))
                .setColor('#2f3136')
                .setDescription(`**Voici les informations concernant le premium de** <@${user.id}>\n\n> Premium : \`${premiums[user.id].hasPremium}\`;\n> Depuis le : \`${premiums[user.id].depuis}\`\n> Ajouté/Retiré par : \`${premiums[user.id].par}\``)
                .setFooter(`${config.FOOTER}`)
        )
        
    }
}

module.exports.help = {
    name: 'premium',
    description: 'Ajoute, retire, ou permet de voir le statut du premium de quelqu\'un',
    usage: 'premium add/remove/info @utilisateur'
}