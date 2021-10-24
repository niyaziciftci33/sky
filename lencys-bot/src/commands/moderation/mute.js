module.exports = {

  name: 'mute',
  description: 'Mutes member from the server.',
  type: 1,
  options: [
    {
      name: 'member',
      description: 'Member tag or identity.',
      type: 6,
      required: true,
    },
    {
      name: 'time',
      description: 'Mute time.',
      type: 3,
      required: true,
      choices: [
        {
          name: '1 minutes',
          value: '1 minutes',
        },
        {
          name: '3 minutes',
          value: '3 minutes',
        },
        {
          name: '5 minutes',
          value: '5 minutes',
        },
        {
          name: '10 minutes',
          value: '10 minutes',
        },
        {
          name: '30 minutes',
          value: '30 minutes',
        },
        {
          name: '1 hours',
          value: '1 hours',
        },
        {
          name: '3 hours',
          value: '3 hours',
        },
        {
          name: '5 hours',
          value: '5 hours',
        },
        {
          name: '10 hours',
          value: '10 hours',
        },
        {
          name: '15 hours',
          value: '15 hours',
        },
        {
          name: '20 hours',
          value: '20 hours',
        },
        {
          name: '24 hours',
          value: '24 hours',
        },
        {
          name: '2 days',
          value: '2 days',
        },
        {
          name: '3 days',
          value: '3 days',
        },
      ],
    },
    {
      name: 'reason',
      description: 'Reason for mute.',
      type: 3,
      required: false,
    },
  ],

  cooldown: 5,

  category: 'moderation',
  usage: ['<member> <time> [reason]'],

  ownerOnly: false,
  requiredUserPermissions: ['MANAGE_MESSAGES'],
  requiredClientPermissions: ['ADMINISTRATOR'],

  disabled: false,
  developerOnly: false,
  
  run: async (ctx) => {

    let user = ctx.interaction.options.getUser('member');
    let member = ctx.interaction.guild.members.cache.get(user.id);
    let time = ctx.interaction.options.getString('time');
    let reason = ctx.interaction.options.getString('reason');
    let muted = ctx.interaction.guild.roles.cache.find((role) => role.name == 'Muted');
  
    if (!member) return ctx.reply.error({ content: `This command can only be used on members.` });
    if (!muted) return ctx.reply.error({ content: `There is no \`Muted\` role on the server.` })
    if (user.id == ctx.interaction.user.id) return ctx.reply.error({ content: `You cannot perform this action on yourself.` });
    if (user.id == ctx.client.user.id) return ctx.reply.error({ content: `You cannot perform this action on the bot.` });
    if (await ctx.model.mute.findOne({ guild: ctx.interaction.guild.id, user: user.id })) return ctx.reply.error({ content: `The user is already muted.` });
    if (member.roles.highest.position >= ctx.interaction.guild.me.roles.highest.position) return ctx.reply.error({ content: `I can't access the user you want to mute.` });
    if (muted.position >= ctx.interaction.guild.me.roles.highest.position) return ctx.reply.error({ content: `I cannot access the \`Muted\` role.` });
  
    await member.roles.add(muted);
    await new ctx.model.mute({ guild: ctx.interaction.guild.id, user: user.id, startDate: Date.now(), endDate: Date.now() + ctx.module.ms(time) }).save().catch((error) => console.log(error));
  
    ctx.reply.confirmation({ content: `${reason ? `\`${ctx.case.filter(user.tag)}\` has been muted on the server for \`${ctx.case.filter(reason)}\` reason.` : `\`${ctx.case.filter(user.tag)}\` has been muted on the server.`}` });
  
    setTimeout(async () => {
  
      if (!ctx.interaction.guild.members.cache.has(user.id)) return await ctx.model.mute.findOne({ guild: ctx.interaction.guild.id, user: user.id }).deleteOne().catch((error) => console.log(error));
      if (!muted) return await ctx.model.mute.findOne({ guild: ctx.interaction.guild.id, user: user.id }).deleteOne().catch((error) => console.log(error));
      if (member.roles.highest.position >= ctx.interaction.guild.me.roles.highest.position) return await ctx.model.mute.findOne({ guild: ctx.interaction.guild.id, user: user.id }).deleteOne().catch((error) => console.log(error));
      if (muted.position >= ctx.interaction.guild.me.roles.highest.position) return await ctx.model.mute.findOne({ guild: ctx.interaction.guild.id, user: user.id }).deleteOne().catch((error) => console.log(error));
  
      await member.roles.remove(muted);
      await ctx.model.mute.findOne({ guild: ctx.interaction.guild.id, user: user.id }).deleteOne().catch((error) => console.log(error));
  
    }, ctx.module.ms(time));
  },
};