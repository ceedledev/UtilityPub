const Discord = require('discord.js');
const path = require('path');
const fs = require('fs');
const moment = require('moment');
const ms = require('ms')
const db = require('quick.db')

module.exports = async (client, message) => {
    if (message.channel.type === 'dm') return;
    if(message.author.bot) { return; }
    if (!message.channel.permissionsFor(client.user).has('SEND_MESSAGES')) { return; }
    let prefix = '&';
    if (message.content.startsWith(prefix)){
        let args = message.content.slice(prefix.length).trim().split(/ +/g);
            let commande = args.shift();
            let cmd = client.commands.get(commande);

            if (!cmd) { return; }
                cmd.run(client, message, args);
                let date = new Date();
                console.log(`${message.author.username} | ${date} | Commande : ${prefix}${commande} ${args.join(' ')}`)
    } else {
        const config = require(path.resolve(path.join('..', 'container/database/main.json')));
        if(config[message.guild.id]){
            if(config[message.guild.id][message.channel.id]){
                let messages = require(path.resolve(path.join('..', 'container/database/messages.json')));
                if(!messages[message.channel.id]){
                    messages[message.channel.id] = {
                        
                    }
                }
                if(!messages[message.channel.id][message.author.id]){
                    messages[message.channel.id][message.author.id] = {
                        lastMessageDate: new Date()
                    }
                    fs.writeFile(path.resolve(path.join('..', 'container/database/messages.json')), JSON.stringify(messages, null, 2), (err) => {
                        if(err) console.log(err)
                    });
                    if(db.get(`embedAfterPubs.${message.guild.id}`)){
                      if(config[message.guild.id][message.channel.id].lastMessageID != 'Aucun'){
                          message.channel.messages.fetch(config[message.guild.id][message.channel.id].lastMessageID).then(m => {
                              m.delete()
                          })
                      }
                      let msg = await message.channel.send(
                          new Discord.MessageEmbed()
                              .setAuthor(message.author.tag, message.author.displayAvatarURL({format: 'png', dynamic: 'true'}))
                              .setColor(config[message.guild.id][message.channel.id].color)
                              .setDescription(config[message.guild.id][message.channel.id].messageEmbed.description.replace('{slowmode}', config[message.guild.id][message.channel.id].slowmode))
                              .setFooter(config[message.guild.id][message.channel.id].messageEmbed.footer)
                      )
      
                      let description = config[message.guild.id][message.channel.id].messageEmbed.description;
                      let footer = config[message.guild.id][message.channel.id].messageEmbed.footer;
      
                      config[message.guild.id][message.channel.id] = {
                          slowmode: config[message.guild.id][message.channel.id].slowmode,
                          color: config[message.guild.id][message.channel.id].color,
                          bypassRole: config[message.guild.id][message.channel.id].bypassRole,
                          lastMessageID: msg.id
                      }
                      config[message.guild.id][message.channel.id].messageEmbed = {
                          description: description,
                          footer: footer
                      }
                      fs.writeFile(path.resolve(path.join('..', 'container/database/main.json')), JSON.stringify(config, null, 2), (err) => {
                          if(err) console.log(err)
                      });
                    }
                    

                    let guild = client.guilds.cache.get('792838064639705138');

                    let verifchannel = require(path.resolve(path.join('..', 'container/database/verifchannel.json')));
                    if(!verifchannel[message.guild.id]) return;
                    let channel = client.channels.cache.find(c => c.id === verifchannel[message.guild.id].verifChannel);
                
                    let messagemsg = await channel.send(message.content.replace('@everyone', '').replace('@here', '') + `\n\n**Auteur:** ${message.author.tag}\n**Salon:** <#${message.channel.id}>`);
                    messagemsg.react('✅');
                    messagemsg.react('❌');

                    const filtre = (reaction, user) => {
                        return ['✅', '❌'].includes(reaction.emoji.name) && user.id != client.user.id;
                    };

                    messagemsg.awaitReactions(filtre, { max: 1, time: 21600000, errors: ['time'] }).then(collected => {
                        let reaction = collected.first();
                        if (reaction.emoji.name === '✅') {
                            messagemsg.delete();
                            return;
                        } else if(reaction.emoji.name === '❌'){
                            messagemsg.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
                            messagemsg.react('1️⃣');
                            messagemsg.react('2️⃣');
                            messagemsg.react('3️⃣');
                            messagemsg.react('4️⃣');
                            messagemsg.react('5️⃣');
                            messagemsg.react('6️⃣');
                            messagemsg.react('📛');
                            const filter = (reaction, user) => {
                                return ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '📛'].includes(reaction.emoji.name) && user.id != client.user.id;
                            };
                            messagemsg.awaitReactions(filter, { max: 1, time: 21600000, errors: ['time'] }).then(async (collected) => {
                                reaction = collected.first();
                                message.delete();
                                messagemsg.delete();
                                if (reaction.emoji.name === '1️⃣') {
                                    message.author.send('Vôtre publicité a été refusée. Raison: ``Contenue à caractère pornographique.``')
                                } else if(reaction.emoji.name === '2️⃣'){
                                    message.author.send('Vôtre publicité a été refusée. Raison: ``Publicité pour un serveur invite reward.``')
                                } else if(reaction.emoji.name === '3️⃣') {
                                    message.author.send('Vôtre publicité a été refusée. Raison: ``Contenue à caractère raciste, haineux ou autre.``')
                                } else if(reaction.emoji.name === '4️⃣'){
                                    message.author.send('Vôtre publicité a été refusée. Raison: ``Lien d\'invitation invalide.``')
                                } else if(reaction.emoji.name === '5️⃣'){
                                    message.author.send('Vôtre publicité à été refusée. Raison: ``Pub dans le mauvais salon.``')
                                } else if(reaction.emoji.name === '6️⃣'){
                                    message.author.send('Vôtre publicité à été refusée. Raison: ``Publicité sans description.``')
                                } else if(reaction.emoji.name === '📛'){
                                    let user = reaction.users.cache.last();
                                    await user.send(
                                      new Discord.MessageEmbed()
                                        .setTitle(`__RAISON__`)
                                        .setColor('ORANGE')
                                        .setDescription("Vous avez choisis de mettre vôtre propre raison de suppressions. Veuillez l'entrer ci-dessous.")
                                        .setFooter('Waiting for reason')
                                    )
                                    let channel = user.dmChannel;
                                    if (!channel) channel = await user.createDM();
                                    let filterCustomReason = (msgReason) => msgReason.author.id === user.id;
                                    channel.awaitMessages(filterCustomReason, { max: 1, time: 10000, errors: ['time'] }).then((collected => {
                                      message.author.send(`Vôtre publicité à été refusée. Raison: \`${collected.first().content}\``)
                                      user.send(`La publicité de **${message.author.tag}** a bien été supprimée.`)
                                    })).catch(collected => {
                                      console.log(collected)
                                    })
                                }
                            })
                            .catch(collected => {
                                console.log(collected);
                            });
                        }
                        return;
                    })
                    .catch(collected => {
                        messagemsg.delete();
                        message.author.send('Aucun modérateur n\'est disponnible pour vérifier vôtre publicité.')
                    });
                    return;
                }
                fs.writeFile(path.resolve(path.join('..', 'container/database/messages.json')), JSON.stringify(messages, null, 2), (err) => {
                    if(err) console.log(err)
                });

                messages = require(path.resolve(path.join('..', 'container/database/messages.json')));

                let now = new Date()
                if(ms(ms(now - messages[message.channel.id][message.author.id].lastMessageDate)) < ms(config[message.guild.id][message.channel.id].slowmode)){
                    message.delete();
                    return message.author.send(`Vous devez attendre encore \`${ms(ms(config[message.guild.id][message.channel.id].slowmode) - ms(ms(now - messages[message.channel.id][message.author.id].lastMessageDate)))}\` avant de pouvoir refaire une pub dans <#${message.channel.id}>.`)
                }

                messages[message.channel.id][message.author.id] = {
                    lastMessageDate: new Date()
                }

                fs.writeFile(path.resolve(path.join('..', 'container/database/messages.json')), JSON.stringify(messages, null, 2), (err) => {
                    if(err) console.log(err)
                });

                if(db.get(`embedAfterPubs.${message.guild.id}`)){
                  if(config[message.guild.id][message.channel.id].lastMessageID != 'Aucun'){
                      message.channel.messages.fetch(config[message.guild.id][message.channel.id].lastMessageID).then(m => {
                          m.delete()
                      })
                  }
                  let msg = await message.channel.send(
                      new Discord.MessageEmbed()
                          .setAuthor(message.author.tag, message.author.displayAvatarURL({format: 'png', dynamic: 'true'}))
                          .setColor(config[message.guild.id][message.channel.id].color)
                          .setDescription(config[message.guild.id][message.channel.id].messageEmbed.description.replace('{slowmode}', config[message.guild.id][message.channel.id].slowmode))
                          .setFooter(config[message.guild.id][message.channel.id].messageEmbed.footer)
                  )

                  let description = config[message.guild.id][message.channel.id].messageEmbed.description;
                  let footer = config[message.guild.id][message.channel.id].messageEmbed.footer;

                  config[message.guild.id][message.channel.id] = {
                      slowmode: config[message.guild.id][message.channel.id].slowmode,
                      color: config[message.guild.id][message.channel.id].color,
                      bypassRole: config[message.guild.id][message.channel.id].bypassRole,
                      lastMessageID: msg.id
                  }
                  config[message.guild.id][message.channel.id].messageEmbed = {
                      description: description,
                      footer: footer
                  }
                  fs.writeFile(path.resolve(path.join('..', 'container/database/main.json')), JSON.stringify(config, null, 2), (err) => {
                      if(err) console.log(err)
                  });
                }
                let guild = client.guilds.cache.get('792838064639705138');

                    let verifchannel = require(path.resolve(path.join('..', 'container/database/verifchannel.json')));
                    if(!verifchannel[message.guild.id]) return;
                    let channel = client.channels.cache.find(c => c.id === verifchannel[message.guild.id].verifChannel);
                
                    let messagemsg = await channel.send(message.content.replace('@everyone', '').replace('@here', '') + `\n\n**Auteur:** ${message.author.tag}\n**Salon:** <#${message.channel.id}>`);
                    messagemsg.react('✅');
                    messagemsg.react('❌');

                    const filtre = (reaction, user) => {
                        return ['✅', '❌'].includes(reaction.emoji.name) && user.id != client.user.id;
                    };

                    messagemsg.awaitReactions(filtre, { max: 1, time: 21600000, errors: ['time'] }).then(collected => {
                        let reaction = collected.first();
                        if (reaction.emoji.name === '✅') {
                            messagemsg.delete();
                            return;
                        } else if(reaction.emoji.name === '❌'){
                            messagemsg.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
                            messagemsg.react('1️⃣');
                            messagemsg.react('2️⃣');
                            messagemsg.react('3️⃣');
                            messagemsg.react('4️⃣');
                            messagemsg.react('5️⃣');
                            messagemsg.react('6️⃣');
                            messagemsg.react('📛');
                            const filter = (reaction, user) => {
                                return ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '📛'].includes(reaction.emoji.name) && user.id != client.user.id;
                            };
                            messagemsg.awaitReactions(filter, { max: 1, time: 21600000, errors: ['time'] }).then(async (collected) => {
                                reaction = collected.first();
                                message.delete();
                                messagemsg.delete();
                                if (reaction.emoji.name === '1️⃣') {
                                    message.author.send('Vôtre publicité a été refusée. Raison: ``Contenue à caractère pornographique.``')
                                } else if(reaction.emoji.name === '2️⃣'){
                                    message.author.send('Vôtre publicité a été refusée. Raison: ``Publicité pour un serveur invite reward.``')
                                } else if(reaction.emoji.name === '3️⃣') {
                                    message.author.send('Vôtre publicité a été refusée. Raison: ``Contenue à caractère raciste, haineux ou autre.``')
                                } else if(reaction.emoji.name === '4️⃣'){
                                    message.author.send('Vôtre publicité a été refusée. Raison: ``Lien d\'invitation invalide.``')
                                } else if(reaction.emoji.name === '5️⃣'){
                                    message.author.send('Vôtre publicité à été refusée. Raison: ``Pub dans le mauvais salon.``')
                                } else if(reaction.emoji.name === '6️⃣'){
                                    message.author.send('Vôtre publicité à été refusée. Raison: ``Publicité sans description.``')
                                } else if(reaction.emoji.name === '📛'){
                                    let user = reaction.users.cache.last();
                                    await user.send(
                                      new Discord.MessageEmbed()
                                        .setTitle(`__RAISON__`)
                                        .setColor('ORANGE')
                                        .setDescription("Vous avez choisis de mettre vôtre propre raison de suppressions. Veuillez l'entrer ci-dessous.")
                                        .setFooter('Waiting for reason')
                                    )
                                    let channel = user.dmChannel;
                                    if (!channel) channel = await user.createDM();
                                    let filterCustomReason = (msgReason) => msgReason.author.id === user.id;
                                    channel.awaitMessages(filterCustomReason, { max: 1, time: 10000, errors: ['time'] }).then((collected => {
                                      message.author.send(`Vôtre publicité à été refusée. Raison: \`${collected.first().content}\``)
                                      user.send(`La publicité de **${message.author.tag}** a bien été supprimée.`)
                                    })).catch(collected => {
                                      console.log(collected)
                                    })
                                }
                            })
                            .catch(collected => {
                                console.log(collected);
                            });
                        }
                        return;
                    })
                    .catch(collected => {
                        messagemsg.delete();
                        message.author.send('Aucun modérateur n\'est disponnible pour vérifier vôtre publicité.')
                    });
                    return;
            }
        }
    }

        
};