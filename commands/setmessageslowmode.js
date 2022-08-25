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
                .setDescription('Vous devez avoir la permission ``ADMINISTRATOR`` pour faire cette commande.')
                .setFooter(`${config.FOOTER}`)
        )
    }

    let premiums = require(path.resolve(path.join('..', 'container/database/premium.json')));
    if(!premiums[message.author.id] || !premiums[message.author.id].hasPremium){
        return message.channel.send(
            new Discord.MessageEmbed()
                .setTitle('<:erreur:793859889444945970>・Erreur...')
                .setColor('#2f3136')
                .setDescription(`Seuls les \`Premium\` peuvent faire cette commande. Si vous souhaitez l'avoir rendez vous sur le serveur support en cliquant [ici](https://discord.gg/nbtcRnSZdU)`)
                .setFooter(`${config.FOOTER}`)
        )
    }

    if(!args[0]){
        return message.channel.send(
            new Discord.MessageEmbed()
                .setTitle('<:erreur:793859889444945970>・Erreur...')
                .setColor('#2f3136')
                .setDescription(`Veuillez mentionner un salon publicitaire, ou mettre son identifiant.`)
                .setFooter(`${config.FOOTER}`)
        )
    }

    let salon = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
    if(!salon){
        return message.channel.send(
            new Discord.MessageEmbed()
                .setTitle('<:erreur:793859889444945970>・Erreur...')
                .setColor('#2f3136')
                .setDescription(`Ce salon est introuvable. Assurez vous que j'y ai bien accès.`)
                .setFooter(`${config.FOOTER}`)
        )
    }

    if(!args[1]){
        return message.channel.send(
            new Discord.MessageEmbed()
                .setTitle('<:erreur:793859889444945970>・Erreur...')
                .setColor('#2f3136')
                .setDescription(`Veuillez entrer la durée souhaitée entre chaque pub.`)
                .setFooter(`${config.FOOTER}`)
        )
    }

    let main = require(path.resolve(path.join('..', 'container/database/main.json')));
    if(!main[message.guild.id]){
        return message.channel.send(
            new Discord.MessageEmbed()
                .setTitle('<:erreur:793859889444945970>・Erreur...')
                .setColor('#2f3136')
                .setDescription('Vous n\'avez aucun salon de publicité, ou vous les avez supprimés à l\'aide de la commande. Veuillez en ajouter pour pouvoir modifier le slowmode du salon.')
                .setFooter(`${config.FOOTER}`)
        )
    }
    if(!main[message.guild.id][salon.id]) {
        return message.channel.send(
            new Discord.MessageEmbed()
                .setTitle('<:erreur:793859889444945970>・Erreur...')
                .setColor('#2f3136')
                .setDescription(`Ce salon n'est pas un salon publicitaire. Veuillez ré-éssayer en mentionnant un salon publicitaire, ou en ajoutant celui ci à l'aide de la commande \`${config.PREFIX}addpubchannel\`.`)
                .setFooter(`${config.FOOTER}`)
        )
    }
    
    let description = main[message.guild.id][salon.id].messageEmbed.description;
    let footer = main[message.guild.id][salon.id].messageEmbed.footer;

    main[message.guild.id][salon.id] = {
        slowmode: args[1],
        color: main[message.guild.id][salon.id].color,
        bypassRole: main[message.guild.id][salon.id].bypassRole,
        lastMessageID: main[message.guild.id][salon.id].lastMessageID
    }

    main[message.guild.id][salon.id].messageEmbed = {
        description: description,
        footer: footer
    }

    fs.writeFile(path.resolve(path.join('..', 'container/database/main.json')), JSON.stringify(main, null, 2), (err) => {
        if(err) console.log(err)
    });

    message.channel.send(
        new Discord.MessageEmbed()
            .setTitle('<a:fleche:782582461510582312>・Succès')
            .setColor('#2f3136')
            .setDescription('Le slowmode du salon <#' + salon.id + '> est désormais  de ``' + args[1] + '``')
            .setFooter(`${config.FOOTER}`)
    )

}

module.exports.help = {
    name: 'setmessageslowmode',
    description: 'Modifie la durée d\'attente entre chaque pub pour le salon voulu',
    usage: 'setmessageslowmode #salon durée'
}