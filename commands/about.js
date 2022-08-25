const Discord = module.require('discord.js');
const moment = require('moment');
var os = require('os');
const config = require('../config.json');

module.exports.run = async(client, message, args) => {

    
    var usedMemory = os.totalmem() -os.freemem(), totalMemory = os.totalmem();

    var  getpercentage = ((usedMemory/totalMemory) * 100).toFixed(2) + '%'

    usedMemory = (usedMemory/ Math.pow(1024, 3)).toFixed(2);
    totalMemory = (totalMemory/ Math.pow(1024, 3)).toFixed(2);

        message.channel.send(
            new Discord.MessageEmbed()
                .setTitle("📌 À propos de **UtilityPub**")
                .setDescription(`<a:info:782586293879963648> **Présentation**
                UtilityPub est l'un des **meilleurs bots qui gère automatiquement les publicité**. Sa mission est de **vous s'implifier la vie de votre serveur publicitaire** tout en étant accessible à tous.\nPour cela, il dispose de plusieurs cordes à son arc. Il utilise notamment **son mode refue/accept des publicité**.\nDe plus, il dispose d'un **systeme d'avantage premium pour débloquer des fonctionnalité**.\n\n<a:fleche:782582461510582312> **UtilityPub est en constante amélioration !** Rejoignez le serveur [support](https://discord.gg/bxEsAFa7Qq) pour être informé des dernières nouveautés.\n\n<a:load:782586939705393193> **Fonctionnalités**\n\n🛡️・Un **système de slowmode**.\n🔒・Un **système de refue/accept pour les publicité**.\n🚧・Un **système de message automatique**, personnalisable **(Premium requis)**.\n\n📍 **Liens**\n[**Serveur Discord**](https://discord.gg/bxEsAFa7Qq)\n[**Site internet**](https://bientôt.com)\n[Documentation](https://bientôt.com)`)
        );
}

module.exports.help = {
    name: 'about'
}
