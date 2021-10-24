const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {

  name: 'avatar',
  description: 'Shows user profile picture.',
  type: 1,
  options: [
    {
      name: 'user',
      description: 'User tag or identity.',
      type: 6,
      required: false,
    },
  ],

  cooldown: 5,

  category: 'information',
  usage: ['[user]'],

  ownerOnly: false,
  requiredUserPermissions: false,
  requiredClientPermissions: false,

  disabled: false,
  developerOnly: false,

  run: async (ctx) => {

    let user = ctx.interaction.options.getUser('user') || ctx.interaction.user;

    ctx.menu.collector({

      embeds: [
        new MessageEmbed()
        .setColor(ctx.config.color.default)
        .setAuthor(`Avatar`, ctx.client.user.displayAvatarURL())
        .setImage(user.displayAvatarURL({ dynamic: true, size: 2048, format: 'png' })),
      ],
      components: [
        new MessageActionRow().addComponents(
          new MessageButton({ style: 'LINK', label: `PNG`, url: user.displayAvatarURL({ format: 'png', size: 1024 }), disabled: false }),
          new MessageButton({ style: 'LINK', label: `JPEG`, url: user.displayAvatarURL({ format: 'jpeg', size: 1024 }), disabled: false }),
          new MessageButton({ style: 'LINK', label: `GIF`, url: user.displayAvatarURL({ format: 'gif', size: 1024 }), disabled: user.displayAvatarURL({ dynamic: true }).endsWith('.gif') ? false : true }),
          new MessageButton({ style: 'LINK', label: `WEBP`, url: user.displayAvatarURL({ format: 'webp', size: 1024 }), disabled: false }),
          new MessageButton({ style: 'DANGER', emoji: ctx.config.emoji.button.delete, customId: 'delete', disabled: false }),
        ),
      ],
      collectButton: async (button) => {
    
        if (button.customId == 'delete') {
    
          ctx.interaction.deleteReply();
  
          await button.deferUpdate();
        };
      },
    });
  },
};