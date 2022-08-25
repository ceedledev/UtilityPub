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

    let salon = message.mentions.channels.first() || message.guild.channels.get(args[0]);
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
                .setDescription(`Veuillez entrer le footer souhaitée pour l'embed.`)
                .setFooter(`${config.FOOTER}`)
        )
    }

    let main = require(path.resolve(path.join('..', 'container/database/main.json')));
    if(!main[message.guild.id]){
        return message.channel.send(
            new Discord.MessageEmbed()
                .setTitle('<:erreur:793859889444945970>・Erreur...')
                .setColor('#2f3136')
                .setDescription('Vous n\'avez aucun salon de publicité, ou vous les avez supprimés à l\'aide de la commande. Veuillez en ajouter pour pouvoir modifier les messages de chaques salons.')
                .setFooter(`${config.FOOTER}`)
        )
    }
    let configServer = main[message.guild.id][salon.id];
    if(!configServer) {
        return message.channel.send(
            new Discord.MessageEmbed()
                .setTitle('<:erreur:793859889444945970>・Erreur...')
                .setColor('#2f3136')
                .setDescription(`Ce salon n'est pas un salon publicitaire. Veuillez ré-éssayer en mentionnant un salon publicitaire, ou en ajoutant celui ci à l'aide de la commande \`${config.PREFIX}addpubchannel\`.`)
                .setFooter(`${config.FOOTER}`)
        )
    }

    configServer.messageEmbed = {
        description: configServer.messageEmbed.description,
        footer: args.slice(1).join(' ')
    }
    fs.writeFile(path.resolve(path.join('..', 'container/database/main.json')), JSON.stringify(main, null, 2), (err) => {
        if(err) console.log(err)
    });

    message.channel.send(
        new Discord.MessageEmbed()
            .setTitle('<a:fleche:782582461510582312>・Succès')
            .setColor('#2f3136')
            .setDescription('Le footer, se situant en dessous de chaques message dans le salon <#' + salon.id + '> est désormais : \n```' + args.slice(1).join(' ') + '```')
            .setFooter(`${config.FOOTER}`)
    )

}

module.exports.help = {
    name: 'setmessagefooter',
    description: 'Modifie le messag affiché en bas des embeds dans les salons de pub',
    usage: 'setmessagefooter #salon message'
}