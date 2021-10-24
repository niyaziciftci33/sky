const { MessageEmbed } = require('discord.js');

module.exports = {

  name: 'help',
  description: 'Lists commands.',
  type: 1,
  options: [
    {
      name: 'command',
      description: 'Shows the command\'s information.',
      type: 3,
      required: false,
    },
  ],

  cooldown: 5,

  category: 'information',
  usage: ['[command]'],

  ownerOnly: false,
  requiredUserPermissions: false,
  requiredClientPermissions: false,

  disabled: false,
  developerOnly: false,

  run: async (ctx) => {

    let command = ctx.interaction.options.getString('command');

    if (command && ctx.client.commands.has(command)) {

      ctx.interaction.reply({

        ephemeral: true,
        embeds: [
          new MessageEmbed()
          .setColor(ctx.config.color.default)
          .setAuthor(`Help - Command: ${ctx.case.title(command.replaceAll(/-/gi, ' '))} ${ctx.client.commands.get(command).disabled == true ? '(Disabled)' : ''} ${ctx.client.commands.get(command).developerOnly == true ? '(Developer Only)' : ''}`, ctx.client.user.displayAvatarURL())
          .addFields([
            { name: 'Usage', value: `${ctx.client.commands.get(command).usage == false ? `\`${command}\`` : `${[...ctx.client.commands.get(command).usage.values()].map((value) => `\`${command} ${value}\``).join('\n')}`}`, inline: false },
            { name: 'Description', value: `${ctx.client.commands.get(command).description}`, inline: false },
            { name: 'Cooldown', value: `${ctx.client.commands.get(command).cooldown == false ? `None` : `${ctx.client.commands.get(command).cooldown}`}`, inline: false },
            { name: 'User Permissions', value: `${ctx.client.commands.get(command).requiredUserPermissions == false ? `None` : `${ctx.client.commands.get(command).requiredUserPermissions.map((value) => `${ctx.case.title(value.replaceAll(/_/gi, ' '))}`).join('\n')}`}`, inline: true },
            { name: 'Bot Permissions', value: `${ctx.client.commands.get(command).requiredClientPermissions == false ? `None` : `${ctx.client.commands.get(command).requiredClientPermissions.map((value) => `${ctx.case.title(value.replaceAll(/_/gi, ' '))}`).join('\n')}`}`, inline: true },
            { name: 'Arguments', value: `\`\`\`wl\n<> Required, [] Optional\`\`\``, inline: false },
          ]),
        ],
      });

    } else if (!command) {

      ctx.interaction.reply({ ephemeral: true, content: `Null` });

    } else {

      ctx.reply.error({ content: `Command not found.` });

    };
  },
};
