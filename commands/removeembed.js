const Discord = require('discord.js');
const db = require('quick.db');
const config = require('../config.json');

module.exports.run = async (client, message, args) => {
  if(!message.member.hasPermission('ADMINISTRATOR')) {
    return message.channel.send(
      new Discord.MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL({format: 'png', dynamic: 'true'}))
        .setColor('#2f3136')
        .setDescription("Vous avez besoin de la permission ``ADMINISTRATEUR`` pour faire cette commande.")
        .setFooter(`${config.FOOTER}`)
    )
  }

  let embed = await message.channel.send(
    new Discord.MessageEmbed()
      .setAuthor(message.author.tag, message.author.displayAvatarURL({format: 'png', dynamic: 'true'}))
      .setColor('#2f3136')
      .setDescription("Veuillez cocher la réaction souhaitée en fonction de code ci-dessous.\n\n> \`✅\` - Activer l'embed\n> \`❌\` - Retirer l'embed")
      .setFooter(`${config.FOOTER}`)
  )

  embed.react('✅')
  embed.react('❌')

  const filter = (reaction, user) => {
      return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id;
  };

  embed.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] }).then(async (collected) => {
      const reaction = collected.first();
    if(reaction.emoji.name === '✅'){
      embed.reactions.removeAll().catch("Je n'ai pas réussi à enlever les réactions.")
      db.set(`embedAfterPubs.${message.guild.id}`, true)
      embed.edit(
        new Discord.MessageEmbed()
          .setAuthor(message.author.tag, message.author.displayAvatarURL({format: 'png', dynamic: 'true'}))
          .setColor('#2f3136')
          .setDescription("Vous avez coorectement ``activé`` les embeds après les publicités.")
          .setFooter(`${config.FOOTER}`)
      )
    } else if(reaction.emoji.name === '❌'){
      embed.reactions.removeAll().catch("Je n'ai pas réussi à enlever les réactions.")
      db.set(`embedAfterPubs.${message.guild.id}`, false)
      embed.edit(
        new Discord.MessageEmbed()
          .setAuthor(message.author.tag, message.author.displayAvatarURL({format: 'png', dynamic: 'true'}))
          .setColor('#2f3136')
          .setDescription("Vous avez coorectement ``désactivé`` les embeds après les publicités.")
          .setFooter(`${config.FOOTER}`)
      )
    }
    }).catch(collected => {
    console.log(collected)
        embed.edit(
      new Discord.MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL({format: 'png', dynamic: 'true'}))
        .setColor('#2f3136')
        .setDescription("``" + message.author.tag + "``, vous avez mit trop de temps à cochez une réaction. La commande est annulée.")
        .setFooter(`${config.FOOTER}`)
    )
    });
}

module.exports.help = {
  name: 'removeembed',
  description: 'Supprime l\'embed après les messages.',
  usage: 'removeembed'
}