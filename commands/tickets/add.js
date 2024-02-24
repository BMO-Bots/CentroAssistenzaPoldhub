const { CommandInteraction, MessageEmbed } = require("discord.js");
const { isTicket } = require("../../controllers/ticketChecks");

module.exports = {
	name: "add",
	description: "Aggiungi un utente al ticket.",
	type: 'CHAT_INPUT',
	options: [
		{
			name: "user",
			description: "Menziona l'utente da aggiungere al ticket.",
			type: "USER",
			required: true
		}	
	],
	/**
	 *
	 * @param {import("../..").Bot} client
	 * @param {CommandInteraction} interaction
	 * @param {String[]} args
	 */
	run: async (client, interaction, args) => {
		const user = interaction.options.getUser('user');
		const ticketData = await isTicket(interaction);
		if (!ticketData) {
			return interaction.reply({embeds: [
				new MessageEmbed()
					.setTitle("Poldo's ticket \❌")
					.setDescription(client.languages.__("errors.channel_without_ticket"))
					.setColor("RED")
			], ephemeral: true});
		}
		if (ticketData.usersInTicket.includes(user.id)) {
			return interaction.reply({embeds: [
				new MessageEmbed()
					.setTitle("Poldo's ticket \❌")
					.setDescription(client.languages.__mf("commands.add.user_already_in_ticket", {
						user_mention: `<@${user.id}>`,
						user_tag: user.tag
					}))
					.setColor("RED")
			], ephemeral: true});
		}

		try {
			await interaction.channel.permissionOverwrites.edit(user.id, {
				VIEW_CHANNEL: true,
				SEND_MESSAGES: true,
				ADD_REACTIONS: true,
				ATTACH_FILES: true,
				EMBED_LINKS: true
			});
		} catch (error) {
			return interaction.reply({embeds: [
				new MessageEmbed()
					.setTitle("Poldo's ticket \❌")
					.setDescription("Errore auto generato:\n" + "```" + error + "```")
					.setColor("RED")
			], ephemeral: true});
		}

		ticketData.usersInTicket.push(user.id);
		ticketData.save();

		return interaction.reply({embeds: [
			new MessageEmbed()
				.setTitle("Poldo's ticket \✅")
				.setDescription(client.languages.__mf("commands.add.success", {
					user_mention: `<@${user.id}>`,
					user_tag: user.tag
				}))
				.setColor("GREEN")
		]});
	},
};