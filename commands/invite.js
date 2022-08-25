const Discord = module.require('discord.js');
const moment = require('moment');
var os = require('os');
const config = require('../config.json');

module.exports.run = async(client, message, args) => {

        message.channel.send(
            new Discord.MessageEmbed()
                .setTitle("📌 Liens")
                .setDescription(`[**Serveur Discord**](${config.DISCORDLINK})\n[**Site internet**](https://bientôt.com)\n[**Invite UtilityPub**](https://discord.com/oauth2/authorize?client_id=791390314626809967&scope=bot&permissions=8)\n[Documentation](https://bientôt.com)\nPour en savoir plus sur UtilityPub, faites &about`)
        );
}

module.exports.help = {
    name: 'invite'
}
