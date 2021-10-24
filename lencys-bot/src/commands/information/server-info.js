const { MessageEmbed } = require('discord.js');

module.exports = {

  name: 'server-info',
  description: 'Shows server information.',
  type: 1,
  options: [
    {
      name: 'null',
      description: 'null',
      type: 3,
      required: false,
      choices: [
        {
          name: 'null',
          value: 'null',
        },
      ],
    },
  ],

  cooldown: 5,

  category: 'information',
  usage: false,

  ownerOnly: false,
  requiredUserPermissions: false,
  requiredClientPermissions: false,

  disabled: false,
  developerOnly: false,

  run: async (ctx) => {

    let tierIcon = {

      'NONE': ``,
      'TIER_1': `${ctx.function.emoji(ctx.config.emoji.guild.tier_1)} `,
      'TIER_2': `${ctx.function.emoji(ctx.config.emoji.guild.tier_2)} `,
      'TIER_3': `${ctx.function.emoji(ctx.config.emoji.guild.tier_3)} `,
    };

    let tiers = {

      'NONE': ``,
      'TIER_1': `(Tier 1)`,
      'TIER_2': `(Tier 2)`,
      'TIER_3': `(Tier 3)`,
    };

    let verification = {

      'NONE': `None - Unrestricted`,
      'LOW': `Low - Must have a verified email on their Discord account.`,
      'MEDIUM': `Medium - Must also be registered on Discord for longer than 5 minutes.`,
      'HIGH': `High - Must aslo be a member of this server for longer than 10 minutes.`,
      'VERY_HIGH': `Highest - Must have a verified phone on their Discord account.`,
    };

    let pages = [

      new MessageEmbed()
      .setColor(ctx.config.color.default)
      .setThumbnail(ctx.interaction.guild.iconURL({ dynamic: true, size: 2048, format: 'png' }))
      .setAuthor(`Server Info`, ctx.client.user.displayAvatarURL())
      .setTitle(`${tierIcon[ctx.interaction.guild.premiumTier]}${ctx.interaction.guild.name}`)
      .addFields([
        { name: `Identity`, value: `${ctx.interaction.guild.id}`, inline: true },
        { name: `Owner`, value: `${await ctx.interaction.guild.fetchOwner()}`, inline: false },
        { name: `Members`, value: `${ctx.case.number(ctx.interaction.guild.memberCount - ctx.interaction.guild.members.cache.filter((value) => value.user.bot).size)} users | ${ctx.case.number(ctx.interaction.guild.members.cache.filter((value) => value.presence !== null && value.presence.status !== 'offline' && !value.user.bot).size)} online | ${ctx.case.number(ctx.interaction.guild.members.cache.filter((value) => value.user.bot).size)} bots | ${ctx.case.number(await ctx.interaction.guild.bans.fetch().then((value) => value.size))} bans`, inline: false },
        { name: `Channels`, value: `${ctx.interaction.guild.channels.cache.filter((value) => value.type == 'GUILD_CATEGORY').size} categories | ${ctx.interaction.guild.channels.cache.filter((value) => value.type == 'GUILD_TEXT').size} text | ${ctx.interaction.guild.channels.cache.filter((value) => value.type == 'GUILD_VOICE').size} voice`, inline: false },
        { name: `Boosts`, value: `${ctx.interaction.guild.premiumSubscriptionCount >= 14 ? `${ctx.interaction.guild.premiumSubscriptionCount}` : `${ctx.interaction.guild.premiumSubscriptionCount}/14`} ${tiers[ctx.interaction.guild.premiumTier]}`, inline: false },
        { name: `Verification Level`, value: `${verification[ctx.interaction.guild.verificationLevel]}`, inline: true },
        { name: `Created Date`, value: `<t:${ctx.function.timestamp(ctx.interaction.guild.createdAt)}:F> (<t:${ctx.function.timestamp(ctx.interaction.guild.createdAt)}:R>)`, inline: false },
      ])
      .setImage(ctx.interaction.guild.bannerURL() ? ctx.interaction.guild.bannerURL({ size: 2048 }) : ctx.interaction.guild.splashURL({ size: 2048 })),
      new MessageEmbed()
      .setColor(ctx.config.color.default)
      .setThumbnail(ctx.interaction.guild.iconURL({ dynamic: true, size: 2048, format: 'png' }))
      .setAuthor(`Server Info`, ctx.client.user.displayAvatarURL())
      .setTitle(`${tierIcon[ctx.interaction.guild.premiumTier]}${ctx.interaction.guild.name}`)
      .addFields([
        { name: `Features ${ctx.interaction.guild.features.length > 0 ? `(${ctx.case.number(ctx.interaction.guild.features.length)})` : ``}`, value: `${ctx.interaction.guild.features.map((value) => `${ctx.case.title(value.replaceAll('_', ' '))}`).join(',\n') || 'None'}`, inline: false },
        { name: `Roles ${ctx.interaction.guild.roles.cache.filter((role) => role.id !== ctx.interaction.guild.roles.everyone.id).size > 0 ? `(${ctx.case.number(ctx.interaction.guild.roles.cache.filter((role) => role.id !== ctx.interaction.guild.roles.everyone.id).size)})` : ``}`, value: `${ctx.interaction.guild.roles.cache.filter((role) => role.id !== ctx.interaction.guild.roles.everyone.id).size > 0 ? [...ctx.interaction.guild.roles.cache.filter((role) => role.id !== ctx.interaction.guild.roles.everyone.id).values()].slice(0, 10).sort((a, b) => b.position - a.position).map((role) => `${role}`).join(',\n') : 'None'} ${ctx.interaction.guild.roles.cache.size > 11 ? `\`+${ctx.interaction.guild.roles.cache.size -11}\`` : ``}`, inline: false },
      ])
      .setImage(ctx.interaction.guild.bannerURL() ? ctx.interaction.guild.bannerURL({ size: 2048 }) : ctx.interaction.guild.splashURL({ size: 2048 })),
    ];

    ctx.menu.pagination({ pages: pages, fastSkip: false });
  },
};