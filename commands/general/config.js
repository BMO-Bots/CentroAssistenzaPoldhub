const { CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const dataGuild = require("../../models/dataGuild");

module.exports = {
  name: "config",
  description: "Configura il bot!",
  type: 'CHAT_INPUT',
  /**
   *
   * @param {import("../..").Bot} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   */
  run: async (client, interaction, args) => {
    let transcript_channel, staff_role, staff_mention;
    await interaction.reply({
      embeds: [
        new MessageEmbed()
          .setTitle("Poldo's ticket \🟠")
          .setDescription("Ehi questo è il sistema di configurazione!\nQui hai le opzioni per configurare il bot.")
          .addField("Canale per i log Ticket", "Imposta il canale in cui verrà inviata la trascrizione dei ticket.")
          .addField("Ruolo staff", "Imposta il ruolo che può usare il bot.")
          .addField("Mention role", "Imposta il ruolo che viene menzionato dal bot ogni volta che si apre un ticket")
          .setColor("GREEN")
          .setFooter({ text: "Poldo's ticket by: Jesgran#1168", iconURL: client.user.displayAvatarURL({ dynamic: true }) })
      ], components: [
        new MessageActionRow()
          .addComponents(
            new MessageButton()
              .setLabel("Canale per i log Ticket")
              .setStyle("PRIMARY")
              .setCustomId("config-transcript-channel"),
            new MessageButton()
              .setLabel("Ruolo staff")
              .setStyle("PRIMARY")
              .setCustomId("config-staff-role"),
            new MessageButton()
              .setLabel("Mention role")
              .setStyle("PRIMARY")
              .setCustomId("config-staff-mention"),
            new MessageButton()
              .setEmoji("👀")
              .setStyle("PRIMARY")
              .setCustomId("config-show"),
            new MessageButton()
              .setEmoji("✖️")
              .setStyle("DANGER")
              .setCustomId("config-cancel")
          )
      ], fetchReply: true
    });

    const collector = interaction.channel.createMessageComponentCollector({
      filter: (m) => m.user.id === interaction.user.id,
      componentType: "BUTTON",
      max: 2
    });

    collector.on("collect", async (int) => {
      await int.deferUpdate();
      const button = int.customId.split("config-")[1];
      if (button === "transcript-channel") {
        interaction.editReply({
          embeds: [
            new MessageEmbed()
              .setTitle("Poldo's ticket \🟠")
              .setDescription("Ehi, per favore **menziona** il canale dove verrà inviata la trascrizione di ogni ticket.\n> Se vuoi rimuovere il canale che hai inserito, scrivi **remove** e invia il messaggio")
              .setColor("ORANGE")
              .setFooter({ text: "Poldo's ticket by: Jesgran#1168", iconURL: client.user.displayAvatarURL({ dynamic: true }) })
          ], components: [
            new MessageActionRow().addComponents(
              new MessageButton()
                .setEmoji("✖️")
                .setStyle("DANGER")
                .setCustomId("config-cancel")
            )
          ]
        });

        const messageCollector = interaction.channel.createMessageCollector({
          filter: (m) => m.author.id === interaction.user.id,
          max: 1
        });

        messageCollector.on("collect", async (message) => {
          message.delete();
          collector.stop();
          const mentionedChannel = message.mentions.channels.first();
          if (mentionedChannel) {
            transcript_channel = mentionedChannel.id;
            try {
              const guildData = await dataGuild.findOne({
                guildID: interaction.guild.id
              });
              if (guildData) {
                guildData.transcriptChannel = transcript_channel;
                await guildData.save();
              } else {
                const newGuildData = new dataGuild({
                  guildID: interaction.guild.id,
                  transcriptChannel: transcript_channel
                });
                await newGuildData.save();
              }
              interaction.editReply({
                embeds: [
                  new MessageEmbed()
                    .setTitle("Poldo's ticket \✅")
                    .setDescription("Godo, il canale è stato impostato!")
                    .setColor("GREEN")
                    .setFooter({ text: "Poldo's ticket by: Jesgran#1168", iconURL: client.user.displayAvatarURL({ dynamic: true }) })
                ], components: []
              });
            } catch (error) {
              interaction.editReply({
                embeds: [
                  new MessageEmbed()
                    .setTitle("Poldo's ticket \❌")
                    .setDescription("C'è stato un errore!\n> Errore auto-generato:" + "```" + error + "```")
                    .setColor("RED")
                    .setFooter({ text: "Poldo's ticket by: Jesgran#1168", iconURL: client.user.displayAvatarURL({ dynamic: true }) })
                ], components: []
              });
            }
          } else if (message.content === "remove") {
            transcript_channel = "";
            try {
              const guildData = await dataGuild.findOne({
                guildID: interaction.guild.id
              });
              if (guildData) {
                guildData.transcriptChannel = transcript_channel;
                await guildData.save();
              } else {
                const newGuildData = new dataGuild({
                  guildID: interaction.guild.id,
                  transcriptChannel: transcript_channel
                });
                await newGuildData.save();
              }
              interaction.editReply({
                embeds: [
                  new MessageEmbed()
                    .setTitle("Poldo's ticket \✅")
                    .setDescription("Il canale è stato rimosso con successo!")
                    .setColor("GREEN")
                    .setFooter({ text: "Poldo's ticket by: Jesgran#1168", iconURL: client.user.displayAvatarURL({ dynamic: true }) })
                ], components: []
              });
            } catch (error) {
              interaction.editReply({
                embeds: [
                  new MessageEmbed()
                    .setTitle("Poldo's ticket \❌")
                    .setDescription("C’è stato un errore durante la rimozione del canale!\n> Errore auto-generato:" + "```" + error + "```")
                    .setColor("RED")
                    .setFooter({ text: "Poldo's ticket by: Jesgran#1168", iconURL: client.user.displayAvatarURL({ dynamic: true }) })
                ], components: []
              });
            }
          } else {
            return interaction.editReply({
              embeds: [
                new MessageEmbed()
                  .setTitle("Poldo's ticket \🔴")
                  .setDescription("Devi menzionare un canale!")
                  .setColor("RED")
                  .setFooter({ text: "Poldo's ticket by: Jesgran#1168", iconURL: client.user.displayAvatarURL({ dynamic: true }) })
              ], components: []
            });
          }
        });
      } else if (button === "staff-role") {
        interaction.editReply({
          embeds: [
            new MessageEmbed()
              .setTitle("Poldo's ticket \🟠")
              .setDescription("Ehi, per favore menziona il ruolo che può usare il bot.\n> Se vuoi rimuovere il canale che hai inserito, scrivi **remove** e invia il messaggio")
              .setColor("ORANGE")
              .setFooter({ text: "Poldo's ticket by: Jesgran#1168", iconURL: client.user.displayAvatarURL({ dynamic: true }) })
          ], components: [
            new MessageActionRow().addComponents(
              new MessageButton()
                .setEmoji("✖️")
                .setStyle("DANGER")
                .setCustomId("config-cancel")
            )
          ]
        });
        const messageCollector = interaction.channel.createMessageCollector({
          filter: (m) => m.author.id === interaction.user.id,
          max: 1
        });

        messageCollector.on("collect", async (message) => {
          collector.stop();
          message.delete();
          const mentionedRole = message.mentions.roles.first();
          if (mentionedRole) {
            staff_role = mentionedRole.id;
            try {
              const guildData = await dataGuild.findOne({
                guildID: interaction.guild.id
              });
              if (guildData) {
                guildData.staffRole = staff_role;
                await guildData.save();
              } else {
                const newGuildData = new dataGuild({
                  guildID: interaction.guild.id,
                  staffRole: staff_role
                });
                await newGuildData.save();
              }
              interaction.editReply({
                embeds: [
                  new MessageEmbed()
                    .setTitle("Poldo's ticket \✅")
                    .setDescription("Lo staff-role è stato configurato con successo!")
                    .setColor("GREEN")
                    .setFooter({ text: "Poldo's ticket by: Jesgran#1168", iconURL: client.user.displayAvatarURL({ dynamic: true }) })
                ], components: []
              });
            } catch (error) {
              interaction.editReply({
                embeds: [
                  new MessageEmbed()
                    .setTitle("Poldo's ticket \❌")
                    .setDescription("C’è stato un errore durante la configurazione del ruolo!\n> Errore auto-generato:" + "```" + error + "```")
                    .setColor("RED")
                    .setFooter({ text: "Poldo's ticket by: Jesgran#1168", iconURL: client.user.displayAvatarURL({ dynamic: true }) })
                ], components: []
              });
            }
          } else if (message.content === "remove") {
            try {
              const guildData = await dataGuild.findOne({
                guildID: interaction.guild.id
              });
              if (guildData) {
                guildData.staffRole = "";
                await guildData.save();
              } else {
                const newGuildData = new dataGuild({
                  guildID: interaction.guild.id,
                  staffRole: ""
                });
                await newGuildData.save();
              }
              interaction.editReply({
                embeds: [
                  new MessageEmbed()
                    .setTitle("Poldo's ticket \✅")
                    .setDescription("Lo staff-role è stato rimosso con successo!")
                    .setColor("GREEN")
                    .setFooter({ text: "Poldo's ticket by: Jesgran#1168", iconURL: client.user.displayAvatarURL({ dynamic: true }) })
                ], components: []
              });
            } catch (error) {
              interaction.editReply({
                embeds: [
                  new MessageEmbed()
                    .setTitle("Poldo's ticket \❌")
                    .setDescription("C’è stato un errore durante la rimozione del ruolo!\n> Errore auto-generato:" + "```" + error + "```")
                    .setColor("RED")
                    .setFooter({ text: "Poldo's ticket by: Jesgran#1168", iconURL: client.user.displayAvatarURL({ dynamic: true }) })
                ], components: []
              });
            }
          } else {
            collector.stop();
            return interaction.editReply({
              embeds: [
                new MessageEmbed()
                  .setTitle("Poldo's ticket \🔴")
                  .setDescription("Devi menzionare un ruolo!")
                  .setColor("RED")
                  .setFooter({ text: "Poldo's ticket by: Jesgran#1168", iconURL: client.user.displayAvatarURL({ dynamic: true }) })
              ], components: []
            });
          }
        });
      } else if (button === "staff-mention") {
        interaction.editReply({
          embeds: [
            new MessageEmbed()
              .setTitle("Poldo's ticket \🟠")
              .setDescription("Menziona il ruolo che il bot usa all'apertura di un ticket.\n> Se vuoi rimuovere il canale che hai inserito, scrivi **remove** e invia il messaggio")
              .setColor("ORANGE")
              .setFooter({ text: "Poldo's ticket by: Jesgran#1168", iconURL: client.user.displayAvatarURL({ dynamic: true }) })
          ], components: [
            new MessageActionRow().addComponents(
              new MessageButton()
                .setEmoji("✖️")
                .setStyle("DANGER")
                .setCustomId("config-cancel")
            )
          ]
        });
        const messageCollector = interaction.channel.createMessageCollector({
          filter: (m) => m.author.id === interaction.user.id,
          max: 1
        });

        messageCollector.on("collect", async (message) => {
          collector.stop();
          message.delete();
          const mentionedRole = message.mentions.roles.first();
          if (mentionedRole) {
            staff_mention = mentionedRole.id;
            try {
              const guildData = await dataGuild.findOne({
                guildID: interaction.guild.id
              });
              if (guildData) {
                guildData.mentionStaff = staff_mention;
                await guildData.save();
              } else {
                const newGuildData = new dataGuild({
                  guildID: interaction.guild.id,
                  mentionStaff: staff_mention
                });
                await newGuildData.save();
              }
              interaction.editReply({
                embeds: [
                  new MessageEmbed()
                    .setTitle("Poldo's ticket \✅")
                    .setDescription("Il ruolo da menzionare è stato impostato!")
                    .setColor("GREEN")
                    .setFooter({ text: "Poldo's ticket by: Jesgran#1168", iconURL: client.user.displayAvatarURL({ dynamic: true }) })
                ], components: []
              });
            } catch (error) {
              interaction.editReply({
                embeds: [
                  new MessageEmbed()
                    .setTitle("Poldo's ticket \❌")
                    .setDescription("C’è stato un errore durante la configurazione del ruolo!\n> Errore auto-generato:" + "```" + error + "```")
                    .setColor("RED")
                    .setFooter({ text: "Poldo's ticket by: Jesgran#1168", iconURL: client.user.displayAvatarURL({ dynamic: true }) })
                ], components: []
              });
            }
          } else if (message.content === "remove") {
            try {
              const guildData = await dataGuild.findOne({
                guildID: interaction.guild.id
              });
              if (guildData) {
                guildData.mentionStaff = "";
                await guildData.save();
              } else {
                const newGuildData = new dataGuild({
                  guildID: interaction.guild.id,
                  mentionStaff: ""
                });
                await newGuildData.save();
              }
              interaction.editReply({
                embeds: [
                  new MessageEmbed()
                    .setTitle("Poldo's ticket \✅")
                    .setDescription("Il ruolo da menzionare è stato rimosso!")
                    .setColor("GREEN")
                    .setFooter({ text: "Poldo's ticket by: Jesgran#1168", iconURL: client.user.displayAvatarURL({ dynamic: true }) })
                ], components: []
              });
            } catch (error) {
              interaction.editReply({
                embeds: [
                  new MessageEmbed()
                    .setTitle("Poldo's ticket \❌")
                    .setDescription("C’è stato un errore durante la rimozione del ruolo!\n> Errore auto-generato:" + "```" + error + "```")
                    .setColor("RED")
                    .setFooter({ text: "Poldo's ticket by: Jesgran#1168", iconURL: client.user.displayAvatarURL({ dynamic: true }) })
                ], components: []
              });
            }
          } else {
            collector.stop();
            return interaction.editReply({
              embeds: [
                new MessageEmbed()
                  .setTitle("Poldo's ticket \🔴")
                  .setDescription("Devi menzionare un ruolo!")
                  .setColor("RED")
                  .setFooter({ text: "Poldo's ticket by: Jesgran#1168", iconURL: client.user.displayAvatarURL({ dynamic: true }) })
              ], components: []
            });
          }
        });
      } else if (button === "cancel") {
        collector.stop();
        return interaction.editReply({
          embeds: [
            new MessageEmbed()
              .setTitle("Poldo's ticket \🔴")
              .setDescription("Hai annullato la operazione!")
              .setColor("RED")
              .setFooter({ text: "Poldo's ticket by: Jesgran#1168", iconURL: client.user.displayAvatarURL({ dynamic: true }) })
          ], components: []
        });
      } else if (button === "show") {
        collector.stop();
        const guildData = await dataGuild.findOne({
          guildID: interaction.guild.id
        });
        if (!guildData) {
          return interaction.editReply({
            embeds: [
              new MessageEmbed()
                .setTitle("Poldo's ticket \🔴")
                .setDescription("Non hai configurato nulla. configura qualcosa!")
                .setColor("RED")
                .setFooter({ text: "Poldo's ticket", iconURL: client.user.displayAvatarURL({ dynamic: true }) })
            ], components: []
          });
        }
        const data = {
          transcript_channel: guildData.transcriptChannel || "Non impostato godo",
          staff_role: guildData.staffRole || "Non impostato godo",
          staff_mention: guildData.mentionStaff || "Non impostato godo",
        }
        return interaction.editReply({
          embeds: [
            new MessageEmbed()
              .setColor("GREEN")
              .setTitle("Poldo's ticket \✅")
              .setDescription("Ecco quello che hai impostato per ora:")
              .setFooter({ text: "Poldo's ticket", iconURL: client.user.displayAvatarURL({ dynamic: true }) })
              .addFields([
                {
                  name: "Canale per i log Ticket 📚",
                  value: data.transcript_channel,
                  inline: false
                },
                {
                  name: "Ruolo staff 👤",
                  value: data.staff_role,
                  inline: false
                },
                {
                  name: "Mention role 🗣️",
                  value: data.staff_mention,
                  inline: false
                }
              ])
          ], components: []
        });
      }
    });
  },
};