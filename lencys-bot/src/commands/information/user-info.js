const { MessageEmbed } = require('discord.js');

module.exports = {

  name: 'user-info',
  description: 'Shows user information.',
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
    let member = ctx.interaction.guild.members.cache.get(user.id);
  
    if (user.bot) return ctx.reply.error({ content: `This command can only be used on users.` });
  
    let badges;
  
    if (user.flags.toArray().length > 0) {
  
      let DISCORD_EMPLOYEE = user.flags.has('DISCORD_EMPLOYEE') ? ctx.function.emoji(ctx.config.emoji.badge.discord_employee) : '';
      let PARTNERED_SERVER_OWNER = user.flags.has('PARTNERED_SERVER_OWNER') ? ctx.function.emoji(ctx.config.emoji.badge.partnered_server_owner) : '';
      let DISCORD_CERTIFIED_MODERATOR = user.flags.has('DISCORD_CERTIFIED_MODERATOR') ? ctx.function.emoji(ctx.config.emoji.badge.discord_certified_moderator) : '';
      let HYPESQUAD_EVENTS = user.flags.has('HYPESQUAD_EVENTS') ? ctx.function.emoji(ctx.config.emoji.badge.hypeSquad_events) : '';
  
      let HOUSE_BRAVERY = user.flags.has('HOUSE_BRAVERY') ? ctx.function.emoji(ctx.config.emoji.badge.house_bravery) : '';
      let HOUSE_BRILLIANCE = user.flags.has('HOUSE_BRILLIANCE') ? ctx.function.emoji(ctx.config.emoji.badge.house_brilliance) : '';
      let HOUSE_BALANCE = user.flags.has('HOUSE_BALANCE') ? ctx.function.emoji(ctx.config.emoji.badge.house_balance) : '';
  
      let BUGHUNTER_LEVEL_1 = user.flags.has('BUGHUNTER_LEVEL_1') ? ctx.function.emoji(ctx.config.emoji.badge.bugHunter_level_1) : '';
      let BUGHUNTER_LEVEL_2 = user.flags.has('BUGHUNTER_LEVEL_2') ? ctx.function.emoji(ctx.config.emoji.badge.bugHunter_level_2) : '';
  
      let EARLY_VERIFIED_BOT_DEVELOPER = user.flags.has('EARLY_VERIFIED_BOT_DEVELOPER') ? ctx.function.emoji(ctx.config.emoji.badge.early_verified_bot_developer) : '';
      let EARLY_SUPPORTER = user.flags.has('EARLY_SUPPORTER') ? ctx.function.emoji(ctx.config.emoji.badge.early_supporter) : '';
  
      let NITRO_SUBSCRIBER = user.displayAvatarURL({ dynamic: true }).endsWith('.gif') || user.discriminator == '0001' ? ctx.function.emoji(ctx.config.emoji.badge.nitro_subscriber) : '';
  
      badges = `${DISCORD_EMPLOYEE}${PARTNERED_SERVER_OWNER}${DISCORD_CERTIFIED_MODERATOR}${HYPESQUAD_EVENTS}${HOUSE_BRAVERY}${HOUSE_BRILLIANCE}${HOUSE_BALANCE}${BUGHUNTER_LEVEL_1}${BUGHUNTER_LEVEL_2}${EARLY_VERIFIED_BOT_DEVELOPER}${EARLY_SUPPORTER}${NITRO_SUBSCRIBER}`;
  
    } else {
  
      badges = 'None';
    };
  
    if (!member) {
  
      ctx.menu.classic({

        embeds: [
          new MessageEmbed()
          .setColor(ctx.config.color.default)
          .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 2048, format: 'png' }))
          .setAuthor(`User Info`, ctx.client.user.displayAvatarURL())
          .addFields([
            { name: 'Tag', value: `${ctx.case.filter(user.tag)}`, inline: true },
            { name: 'Identity', value: `${user.id}`, inline: true },
            { name: 'Badges', value: `${badges}`, inline: true },
            { name: 'Registration Date', value: `<t:${ctx.function.timestamp(user.createdAt)}:F> (<t:${ctx.function.timestamp(user.createdAt)}:R>)`, inline: false },
          ]),
        ],
      });

    } else if (member) {

      ctx.menu.classic({

        embeds: [
          new MessageEmbed()
          .setColor(ctx.config.color.default)
          .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 2048, format: 'png' }))
          .setAuthor(`User Info`, ctx.client.user.displayAvatarURL())
          .addFields([
            { name: 'Tag', value: `${user}`, inline: true },
            { name: 'Identity', value: `${user.id}`, inline: true },
            { name: 'Badges', value: `${badges}`, inline: true },
            { name: 'Registration Date', value: `<t:${ctx.function.timestamp(user.createdAt)}:F> (<t:${ctx.function.timestamp(user.createdAt)}:R>)`, inline: false },
            { name: 'Joined Date', value: `<t:${ctx.function.timestamp(member.joinedAt)}:F> (<t:${ctx.function.timestamp(member.joinedAt)}:R>)`, inline: false },
            { name: `Roles ${member.roles.cache.filter((role) => role.id !== ctx.interaction.guild.roles.everyone.id).size > 0 ? `(${member.roles.cache.filter((role) => role.id !== ctx.interaction.guild.roles.everyone.id).size})` : ''}`, value: `${member.roles.cache.filter((role) => role.id !== ctx.interaction.guild.roles.everyone.id).size > 0 ? [...member.roles.cache.filter((role) => role.id !== ctx.interaction.guild.roles.everyone.id).values()].slice(0, 10).sort((a, b) => b.position - a.position).map((role) => `${role}`).join(', ') : 'None'} ${member.roles.cache.size > 11 ? `\`+${member.roles.cache.size -11}\`` : ''}`, inline: false },
          ]),
        ],
      });
    };
  },
};
