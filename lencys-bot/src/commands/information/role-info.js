const { MessageEmbed } = require('discord.js');

module.exports = {

  name: 'role-info',
  description: 'Shows role information.',
  type: 1,
  options: [
    {
      name: 'role',
      description: 'Role tag or identity.',
      type: 8,
      required: true,
    },
  ],

  cooldown: 5,

  category: 'information',
  usage: ['<role>'],

  ownerOnly: false,
  requiredUserPermissions: false,
  requiredClientPermissions: false,

  disabled: false,
  developerOnly: false,
  
  run: async (ctx) => {

    let role = ctx.interaction.options.getRole('role');
  
    if (role.id == ctx.interaction.guild.roles.everyone.id) return ctx.reply.error(`This command can only be used in roles.`);
  
    ctx.menu.classic({

      embeds: [
        new MessageEmbed()
        .setColor(ctx.config.color.default)
        .setThumbnail(`https://singlecolorimage.com/get/${role.hexColor.toString().slice(1) == '000000' ? '99AAB5' : role.hexColor.toString().slice(1)}/512x512.png`)
        .setAuthor(`Role Info`, ctx.client.user.displayAvatarURL())
        .addFields([
          { name: `Role`, value: `${role}`, inline: true },
          { name: `Identity`, value: `${role.id}`, inline: true },
          { name: `Mentionable`, value: `${role.mentionable ? `Yes` : `No`}`, inline: true },
          { name: `Position`, value: `${role.position}/${ctx.interaction.guild.roles.cache.filter((role) => role.name !== '@everyone').size > 0 ? ctx.interaction.guild.roles.cache.filter((role) => role.name !== '@everyone').size : '1'}`, inline: true },
          { name: `Color`, value: `${role.hexColor == '#000000' ? `None` : role.hexColor.toUpperCase()}`, inline: true },
          { name: `Hoisted`, value: `${role.hoist ? `Yes` : `No`}`, inline: true },
          { name: `Created Date`, value: `<t:${ctx.function.timestamp(role.createdAt)}:F> (<t:${ctx.function.timestamp(role.createdAt)}:R>)`, inline: false },
        ]),
      ],
    });
  },
};