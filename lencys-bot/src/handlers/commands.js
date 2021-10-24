const { MessageEmbed } = require('discord.js');

module.exports = {
  
  name: 'interactionCreate',

  run: async (client, interaction) => {

    let ctx = new (require('../interfaces/context.js'))(client, interaction);

    if (interaction.isCommand()) {

      let command = client.commands.get(interaction.commandName);
  
      if (command.disabled == true && !ctx.config.data.developers.includes(interaction.user.id)) return ctx.reply.error({ content: `Command is disabled.` });
      if (command.developerOnly == true && !ctx.config.data.developers.includes(interaction.user.id)) return ctx.reply.error({ content: `This command can only be used by the developer.` });

      if (command.ownerOnly == true && interaction.user.id !== interaction.guild.ownerId) return ctx.reply.error({ content: `You must be the server owner to use the command.` });
      if (command.requiredUserPermissions !== false && !interaction.member.permissions.has(command.requiredUserPermissions)) return ctx.reply.error({ content: `You must have ${command.requiredUserPermissions.map((value) => `\`${ctx.case.title(value.replace(/_/gi, ' '))}\``)} permission to use the command.` });
      if (command.requiredClientPermissions !== false && !interaction.guild.me.permissions.has(command.requiredClientPermissions)) return ctx.reply.error({ content: `${command.requiredClientPermissions.length == 1 ? `I need ${command.requiredClientPermissions.map((value) => `\`${ctx.case.title(value.replace(/_/gi, ' '))}\``)} permission.` : `I need ${command.requiredClientPermissions.map((value) => `\`${ctx.case.title(value.replace(/_/gi, ' '))}\``).join(' and ')} permissions.`}` });
    
      if (client.cooldowns.has(`${interaction.commandName}_${interaction.user.id}`)) {

        let finish = client.cooldowns.get(`${interaction.commandName}_${interaction.user.id}`); 
        let date = new Date();
        
        return ctx.reply.error({ content: `Please wait \`${(new Date(finish - date).getTime() / 1000).toFixed(1)}\` more seconds before using \`${interaction.commandName}\` command.` });
      };

      let finish = new Date();
      finish.setSeconds(finish.getSeconds() + command.cooldown);

      console.log(`${ctx.config.log.time} ${ctx.terminal.color({ text: 'COMMAND', hex: ctx.config.color.confirmation, bold: true })} ${ctx.terminal.color({ text: interaction.commandName, hex: '#FFFFFF' })} by ${ctx.terminal.color({ text: `${interaction.user.tag} (${interaction.user.id})`, hex: ctx.config.color.info })}`);

      command.run(ctx).catch((error) => {
  
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
      
      if (command.cooldown !== false) {

        client.cooldowns.set(`${interaction.commandName}_${interaction.user.id}`, finish);

        setTimeout(() => {

          client.cooldowns.delete(`${interaction.commandName}_${interaction.user.id}`);

        }, command.cooldown * 1000);
      };
    };
  },
};
