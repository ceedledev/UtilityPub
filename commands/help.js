const { DiscordAPIError } = require("discord.js");
const config = require('../config.json');

const Discord = require('discord.js')

module.exports.run = (client, message, args) => {
    let texte = '📚 **Pour une aide plus complète, référez-vous à la [documentation](https://bientôt.com).**\n**Faites** `&about` **pour en savoir plus sur UtilityPub.**\n\n🔨 **Commandes de gestion**\n`&addpubchannel` **-** Pour configurer un salon de publicité.\n`&getpubchannels` **-** Affiche les salon enregistrer sur ce serveur.\n`&removeembed` **-** Pour configurer les message automatique ou les désactiver.\n`&removepubchannel` **-** Pour supprimer un salon publicitaire.\n`&setmessagedesc` **-** Pour modifier le message pour le système de message automatique. **(Avantage Premium Requis)**\n`&setmessagefooter` **-** Pour modifier le message pour le système de message automatique. **(Avantage Premium Requis)**\n`&setmessageslowmode` Pour configurer le slowmode personnalisable. **(Avantage Premium Requis)**\n`&setverifchannel` **-** Pour configurer le salon de accept/refus des publicité.\n\n🔥 **Commandes de modération**\n`&clear` **-** Pour supprimer un nombres de message. **(Bientôt)**\n`&ban` **-** Pour bannir une personne. **(Bientôt)**\n`&kick` **-** Pour expulser une personne. **(Bientôt)**\n\n📦 **Autres commandes**\n`&stats` **-** Affiche les différents liens en rapport avec UtilityPub.\n`&about` **-** Affiche les informations sur UtilityPub.\n`&premium` **-** Affiche les information premium d un utilisateur.\n`&invite` **-** Pour afficher les liens d invitations !' 
    client.commands.forEach(c => {
        texte + `\nTu veux m'aider ?\nNon\nOui`
    })
    message.channel.send(
        new Discord.MessageEmbed()
            .setTitle(`📌 **Aide**\n● Bonjour , je suis ${message.client.user.tag} et mon préfixe est \`${config.PREFIX}\` `)
            .setColor('#2f3136')
            .setDescription(texte + '\n\n📍 **Informations**\n[**Serveur Discord**](https://discord.gg/nbtcRnSZdU)')
    )
};
  
module.exports.help = {
    name: "help",
    description: "Donne la liste de toutes les commandes auxquelles vous avez accès.",
    usage: "help [command]"
};