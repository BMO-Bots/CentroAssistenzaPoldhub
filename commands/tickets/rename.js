const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const { error } = require("../../controllers/logger");
const { isTicket } = require("../../controllers/ticketChecks");

module.exports = {
	name: "rename",
	description: "Rinomina un ticket.",
	type: 'CHAT_INPUT',
	options: [
		{
			name: 'name',
			description: 'Il nuovo nome del ticket.',
			type: 'STRING',
			required: true
		}	
	],
	/**
	 *
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 * @param {String[]} args
	 */
	run: async (client, interaction, args) => {
		const name = interaction.options.getString('name');
		const ticketData = await isTicket(interaction);

		if (!ticketData) {
			return interaction.reply({embeds: [
				new MessageEmbed()
					.setTitle("Poldo's ticket \❌")
					.setDescription(client.languages.__("errors.channel_without_ticket"))
					.setColor("RED")
			], ephemeral: true});
		}

		interaction.channel.setName(name);

		ticketData.name = name;
		await ticketData.save();

		return interaction.reply({embeds: [
			new MessageEmbed()
				.setTitle("Poldo's ticket \✅")
				.setDescription(client.languages.__mf("commands.rename.success", {
					new_name: name,
					old_name: interaction.channel.name,
					user_mention: `<@${interaction.user.id}>`,
				}))
				.setColor("GREEN")
		], ephemeral: true});
	},
};