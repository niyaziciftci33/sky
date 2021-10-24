const { MessageEmbed } = require('discord.js');

module.exports = {

  name: 'discrim',
  description: 'Lists members with the specified discrim.',
  type: 1,
  options: [
    {
      name: 'number',
      description: 'Number consisting of 4 digits.',
      type: 3,
      required: true,
    },
  ],

  cooldown: 5,

  category: 'information',
  usage: ['<number>'],

  ownerOnly: false,
  requiredUserPermissions: false,
  requiredClientPermissions: false,

  disabled: false,
  developerOnly: false,
  
  run: async (ctx) => {

    let number = ctx.interaction.options.getString('number');

    if (isNaN(number)) return ctx.reply.error({ content: `Discriminator can only be number.` });
    if (number.length > 4) return ctx.reply.error({ content: `Discriminator cannot be less than 4 digits.` });
    if (number.length < 4) return ctx.reply.error({ content: `Discriminator cannot exceed 4 digits.` });
    if (number == '0000') return ctx.reply.error({ content: `\`0000\` is not a discriminator.` });

    let members = [...ctx.client.users.cache.filter((member) => member.discriminator == number).values()]

   if (members < 1) return ctx.reply.error({ content: `No user found with discriminator \`${number}\`.` });

    let pages = [];
    let page = 1;

    for (let member of members) {

      let badges;
  
      if (member.flags.toArray().length > 0) {
    
        let DISCORD_EMPLOYEE = member.flags.has('DISCORD_EMPLOYEE') ? ctx.function.emoji(ctx.config.emoji.badge.discord_employee) : '';
        let PARTNERED_SERVER_OWNER = member.flags.has('PARTNERED_SERVER_OWNER') ? ctx.function.emoji(ctx.config.emoji.badge.partnered_server_owner) : '';
        let DISCORD_CERTIFIED_MODERATOR = member.flags.has('DISCORD_CERTIFIED_MODERATOR') ? ctx.function.emoji(ctx.config.emoji.badge.discord_certified_moderator) : '';
        let HYPESQUAD_EVENTS = member.flags.has('HYPESQUAD_EVENTS') ? ctx.function.emoji(ctx.config.emoji.badge.hypeSquad_events) : '';
    
        let HOUSE_BRAVERY = member.flags.has('HOUSE_BRAVERY') ? ctx.function.emoji(ctx.config.emoji.badge.house_bravery) : '';
        let HOUSE_BRILLIANCE = member.flags.has('HOUSE_BRILLIANCE') ? ctx.function.emoji(ctx.config.emoji.badge.house_brilliance) : '';
        let HOUSE_BALANCE = member.flags.has('HOUSE_BALANCE') ? ctx.function.emoji(ctx.config.emoji.badge.house_balance) : '';
    
        let BUGHUNTER_LEVEL_1 = member.flags.has('BUGHUNTER_LEVEL_1') ? ctx.function.emoji(ctx.config.emoji.badge.bugHunter_level_1) : '';
        let BUGHUNTER_LEVEL_2 = member.flags.has('BUGHUNTER_LEVEL_2') ? ctx.function.emoji(ctx.config.emoji.badge.bugHunter_level_2) : '';
    
        let EARLY_VERIFIED_BOT_DEVELOPER = member.flags.has('EARLY_VERIFIED_BOT_DEVELOPER') ? ctx.function.emoji(ctx.config.emoji.badge.early_verified_bot_developer) : '';
        let EARLY_SUPPORTER = member.flags.has('EARLY_SUPPORTER') ? ctx.function.emoji(ctx.config.emoji.badge.early_supporter) : '';
    
        let NITRO_SUBSCRIBER = member.displayAvatarURL({ dynamic: true }).endsWith('.gif') ? ctx.function.emoji(ctx.config.emoji.badge.nitro_subscriber) : '';
    
        badges = `${DISCORD_EMPLOYEE}${PARTNERED_SERVER_OWNER}${DISCORD_CERTIFIED_MODERATOR}${HYPESQUAD_EVENTS}${HOUSE_BRAVERY}${HOUSE_BRILLIANCE}${HOUSE_BALANCE}${BUGHUNTER_LEVEL_1}${BUGHUNTER_LEVEL_2}${EARLY_VERIFIED_BOT_DEVELOPER}${EARLY_SUPPORTER}${NITRO_SUBSCRIBER}`;
    
      } else {
    
        badges = 'None';
      };

      let membersArray = new MessageEmbed()
      .setColor(ctx.config.color.default)
      .setThumbnail(member.displayAvatarURL({ dynamic: true, size: 2048, format: 'png' }))
      .setAuthor(`Discrim`, ctx.client.user.displayAvatarURL())
      .setTitle(`Members with #${number} discrimination.`)
      .addFields([
        { name: 'Tag', value: `${member}`, inline: true },
        { name: 'Identity', value: `${member.id}`, inline: true },
        { name: 'Badges', value: `${badges}`, inline: true },
        { name: 'Registration Date', value: `<t:${ctx.function.timestamp(member.createdAt)}:F> (<t:${ctx.function.timestamp(member.createdAt)}:R>)`, inline: false },
      ])
      .setFooter(`Page ${ctx.case.number(page++)} of ${ctx.case.number(members.length)}`)

      pages.push(membersArray)
    };

    ctx.menu.pagination({ pages: pages, fastSkip: true });
  },
};