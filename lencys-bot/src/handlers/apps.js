const { MessageEmbed } = require('discord.js');

module.exports = {
  
  name: 'interactionCreate',

  run: async (client, interaction) => {

    let ctx = new (require('../interfaces/context.js'))(client, interaction);

    if (interaction.isContextMenu()) {

      let app = client.apps.get(interaction.commandName);
  
      //if (app.disabled == true && !ctx.config.data.developers.includes(interaction.user.id)) return ctx.reply.error({ content: `App is disabled.` });
      //if (app.developerOnly == true && !ctx.config.data.developers.includes(interaction.user.id)) return ctx.reply.error({ content: `This app can only be used by the developer.` });

      //if (app.ownerOnly !== false && interaction.user.id !== interaction.guild.ownerId) return  ctx.reply.error({ content: `You must be the server owner to use the app.` });
      if (app.requiredUserPermissions !== false && !interaction.member.permissions.has(app.requiredUserPermissions)) return ctx.reply.error({ content: `You must have ${app.requiredUserPermissions.map((value) => `\`${ctx.case.title(value.replace(/_/gi, ' '))}\``)} permission to use the app.` });
      //if (app.requiredClientPermissions !== false && !interaction.guild.me.permissions.has(app.requiredClientPermissions)) return ctx.reply.error({ content: `${app.requiredClientPermissions.length == 1 ? `I need ${app.requiredClientPermissions.map((value) => `\`${ctx.case.title(value.replace(/_/gi, ' '))}\``)} permission.` : `I need ${app.requiredClientPermissions.map((value) => `\`${ctx.case.title(value.replace(/_/gi, ' '))}\``).join(' and ')} permissions.`}` });
  
      console.log(`${ctx.config.log.time} ${ctx.terminal.color({ text: 'APP', hex: ctx.config.color.confirmation, bold: true })} ${ctx.terminal.color({ text: interaction.commandName, hex: '#FFFFFF' })} by ${ctx.terminal.color({ text: `${interaction.user.tag} (${interaction.user.id})`, hex: ctx.config.color.info })}`);
  
      await interaction.deferReply({ ephemeral: false });

      app.run(ctx).catch((error) => {
  
        interaction.reply({
          ephemeral: true,
          embeds: [
            new MessageEmbed()
            .setColor(ctx.config.color.default)
            .setTitle('Something went wrong...')
            .setDescription(`You can report this error to developer by sending dm to bot.\`\`\`js\n${error.length > 1000 ? `${error.slice(0, 1000)}...` : `${error}`}\n\`\`\``),
          ],
        });
      });
    };
  },
};
