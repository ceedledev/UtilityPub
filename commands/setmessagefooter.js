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

    let salon = message.mentions.channels.first() || message.guild.channels.get(args[0]);
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
                .setDescription(`Veuillez entrer le footer souhaitée pour l'embed.`)
                .setFooter('🛡️・Rezz#0001')
        )
    }

    let main = require(path.resolve(path.join('..', 'container/database/main.json')));
    if(!main[message.guild.id]){
        return message.channel.send(
            new Discord.MessageEmbed()
                .setTitle('<:erreur:793859889444945970>・Erreur...')
                .setColor('#2f3136')
                .setDescription('Vous n\'avez aucun salon de publicité, ou vous les avez supprimés à l\'aide de la commande. Veuillez en ajouter pour pouvoir modifier les messages de chaques salons.')
                .setFooter('🛡️・Rezz#0001')
        )
    }
    let configServer = main[message.guild.id][salon.id];
    if(!configServer) {
        return message.channel.send(
            new Discord.MessageEmbed()
                .setTitle('<:erreur:793859889444945970>・Erreur...')
                .setColor('#2f3136')
                .setDescription(`Ce salon n'est pas un salon publicitaire. Veuillez ré-éssayer en mentionnant un salon publicitaire, ou en ajoutant celui ci à l'aide de la commande \`&addpubchannel\`.`)
                .setFooter('🛡️・Rezz#0001')
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
            .setFooter('🛡️・Rezz#0001')
    )

}

module.exports.help = {
    name: 'setmessagefooter',
    description: 'Modifie le messag affiché en bas des embeds dans les salons de pub',
    usage: 'setmessagefooter #salon message'
}