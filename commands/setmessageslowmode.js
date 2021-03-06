const Discord = require('discord.js');
const path = require('path');
const fs = require('fs');

module.exports.run = async (client, message, args) => {
    if(!message.member.hasPermission('ADMINISTRATOR')){
        return message.channel.send(
            new Discord.MessageEmbed()
                .setTitle('<:erreur:793859889444945970>・Erreur...')
                .setColor('#2f3136')
                .setDescription('Vous devez avoir la permission ``ADMINISTRATOR`` pour faire cette commande.')
                .setFooter('🛡️・Rezz#0001')
        )
    }

    let premiums = require(path.resolve(path.join('..', 'container/database/premium.json')));
    if(!premiums[message.author.id] || !premiums[message.author.id].hasPremium){
        return message.channel.send(
            new Discord.MessageEmbed()
                .setTitle('<:erreur:793859889444945970>・Erreur...')
                .setColor('#2f3136')
                .setDescription(`Seuls les \`Premium\` peuvent faire cette commande. Si vous souhaitez l'avoir rendez vous sur le serveur support en cliquant [ici](https://discord.gg/nbtcRnSZdU)`)
                .setFooter('🛡️・Rezz#0001')
        )
    }

    if(!args[0]){
        return message.channel.send(
            new Discord.MessageEmbed()
                .setTitle('<:erreur:793859889444945970>・Erreur...')
                .setColor('#2f3136')
                .setDescription(`Veuillez mentionner un salon publicitaire, ou mettre son identifiant.`)
                .setFooter('🛡️・Rezz#0001')
        )
    }

    let salon = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
    if(!salon){
        return message.channel.send(
            new Discord.MessageEmbed()
                .setTitle('<:erreur:793859889444945970>・Erreur...')
                .setColor('#2f3136')
                .setDescription(`Ce salon est introuvable. Assurez vous que j'y ai bien accès.`)
                .setFooter('🛡️・Rezz#0001')
        )
    }

    if(!args[1]){
        return message.channel.send(
            new Discord.MessageEmbed()
                .setTitle('<:erreur:793859889444945970>・Erreur...')
                .setColor('#2f3136')
                .setDescription(`Veuillez entrer la durée souhaitée entre chaque pub.`)
                .setFooter('🛡️・Rezz#0001')
        )
    }

    let main = require(path.resolve(path.join('..', 'container/database/main.json')));
    if(!main[message.guild.id]){
        return message.channel.send(
            new Discord.MessageEmbed()
                .setTitle('<:erreur:793859889444945970>・Erreur...')
                .setColor('#2f3136')
                .setDescription('Vous n\'avez aucun salon de publicité, ou vous les avez supprimés à l\'aide de la commande. Veuillez en ajouter pour pouvoir modifier le slowmode du salon.')
                .setFooter('🛡️・Rezz#0001')
        )
    }
    if(!main[message.guild.id][salon.id]) {
        return message.channel.send(
            new Discord.MessageEmbed()
                .setTitle('<:erreur:793859889444945970>・Erreur...')
                .setColor('#2f3136')
                .setDescription(`Ce salon n'est pas un salon publicitaire. Veuillez ré-éssayer en mentionnant un salon publicitaire, ou en ajoutant celui ci à l'aide de la commande \`&addpubchannel\`.`)
                .setFooter('🛡️・Rezz#0001')
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
            .setFooter('🛡️・Rezz#0001')
    )

}

module.exports.help = {
    name: 'setmessageslowmode',
    description: 'Modifie la durée d\'attente entre chaque pub pour le salon voulu',
    usage: 'setmessageslowmode #salon durée'
}