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
                .setTitle("📌 Liens")
                .setDescription(`[**Serveur Discord**](https://discord.gg/bxEsAFa7Qq)\n[**Site internet**](https://bientôt.com)\n[**Invite UtilityPub**](https://discord.com/oauth2/authorize?client_id=791390314626809967&scope=bot&permissions=8)\n[Documentation](https://bientôt.com)\nPour en savoir plus sur UtilityPub, faites &about`)
        );
}

module.exports.help = {
    name: 'invite'
}
