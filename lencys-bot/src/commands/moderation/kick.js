module.exports = {

  name: 'kick',
  description: 'Kicks member from the server.',
  type: 1,
  options: [
    {
      name: 'member',
      description: 'Member tag or identity.',
      type: 6,
      required: true,
    },
    {
      name: 'reason',
      description: 'Reason for kick.',
      type: 3,
      required: false,
    },
  ],

  cooldown: 5,

  category: 'moderation',
  usage: ['<user> [reason]'],

  ownerOnly: false,
  requiredUserPermissions: ['KICK_MEMBERS'],
  requiredClientPermissions: ['ADMINISTRATOR'],

  disabled: false,
  developerOnly: false,

  run: async (ctx) => {

    let user = ctx.interaction.options.getUser('member');
    let member = ctx.interaction.guild.members.cache.get(user.id);
    let reason = ctx.interaction.options.getString('reason');
  
    if (!member) return ctx.reply.error({ content: `This command can only be used on members.` });
    if (user.id == ctx.interaction.user.id) return ctx.reply.error({ content: `You cannot perform this action on yourself.` });
    if (user.id == ctx.client.user.id) return ctx.reply.error({ content: `You cannot perform this action on the bot.` });
    if (!member.kickable) return ctx.reply.error({ content: `I can't access the user you want to kick.` });
  
    ctx.interaction.guild.members.kick(member);
  
    ctx.reply.confirmation({ content: `${reason ? `\`${ctx.case.filter(user.tag)}\` has been kicked from the server for \`${ctx.case.filter(reason)}\` reason.` : `\`${ctx.case.filter(user.tag)}\` has been kicked from the server.`}` });
  },
};