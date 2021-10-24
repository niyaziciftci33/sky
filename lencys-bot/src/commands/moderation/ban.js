module.exports = {

  name: 'ban',
  description: 'Bans user from the server.',
  type: 1,
  options: [
    {
      name: 'user',
      description: 'User tag or identity.',
      type: 6,
      required: true,
    },
    {
      name: 'purge-messages',
      description: 'Delete message history.',
      type: 3,
      required: false,
      choices: [
        {
          name: 'true',
          value: 'true',
        },
        {
          name: 'false',
          value: 'false',
        },
      ],
    },
    {
      name: 'reason',
      description: 'Reason for ban.',
      type: 3,
      required: false,
    },
  ],

  cooldown: 5,

  category: 'moderation',
  usage: ['<user> [purge-messages] [reason]'],

  ownerOnly: false,
  requiredUserPermissions: ['BAN_MEMBERS'],
  requiredClientPermissions: ['ADMINISTRATOR'],

  disabled: false,
  developerOnly: false,
  
  run: async (ctx) => {

    let user = ctx.interaction.options.getUser('user');
    let member = ctx.interaction.guild.members.cache.get(user.id);
    let purgeMessages = ctx.interaction.options.getString('purge-messages');
    let reason = ctx.interaction.options.getString('reason');
  
    if (user.id == ctx.interaction.user.id) return ctx.reply.error({ content: `You cannot perform this action on yourself.` });
    if (user.id == ctx.client.user.id) return ctx.reply.error({ content: `You cannot perform this action on the bot.` });
    if (await ctx.interaction.guild.bans.fetch().then(async (banneds) => banneds.find((value) => value.user.id == user.id))) return ctx.reply.error({ content: `You can only use this command on non-banned users.` });
    if (member && !member.bannable) return ctx.reply.error({ content: `I can't access the user you want to ban.` });
  
    !purgeMessages || purgeMessages == 'false' ? ctx.interaction.guild.members.ban(user, { reason: ctx.case.filter(reason || 'None') }) : ctx.interaction.guild.members.ban(user, { days: 7, reason: ctx.case.filter(reason || 'None') });
  
    ctx.reply.confirmation({ content: `${reason ? `\`${ctx.case.filter(user.tag)}\` has been banned from the server for \`${ctx.case.filter(reason)}\` reason.` : `\`${ctx.case.filter(user.tag)}\` has been banned from the server.`}` });
  },
};