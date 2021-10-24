const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {

  name: 'mass-ban',
  description: 'Mass bans users from the server.',
  type: 1,
  options: [
    {
      name: '1',
      description: 'User tag or identity.',
      type: 6,
      required: true,
    },
    {
      name: '2',
      description: 'User tag or identity.',
      type: 6,
      required: false,
    },
    {
      name: '3',
      description: 'User tag or identity.',
      type: 6,
      required: false,
    },
    {
      name: '4',
      description: 'User tag or identity.',
      type: 6,
      required: false,
    },
    {
      name: '5',
      description: 'User tag or identity.',
      type: 6,
      required: false,
    },
    {
      name: '6',
      description: 'User tag or identity.',
      type: 6,
      required: false,
    },
    {
      name: '7',
      description: 'User tag or identity.',
      type: 6,
      required: false,
    },
    {
      name: '8',
      description: 'User tag or identity.',
      type: 6,
      required: false,
    },
    {
      name: '9',
      description: 'User tag or identity.',
      type: 6,
      required: false,
    },
    {
      name: '10',
      description: 'User tag or identity.',
      type: 6,
      required: false,
    },
    {
      name: '11',
      description: 'User tag or identity.',
      type: 6,
      required: false,
    },
    {
      name: '12',
      description: 'User tag or identity.',
      type: 6,
      required: false,
    },
    {
      name: '13',
      description: 'User tag or identity.',
      type: 6,
      required: false,
    },
    {
      name: '14',
      description: 'User tag or identity.',
      type: 6,
      required: false,
    },
    {
      name: '15',
      description: 'User tag or identity.',
      type: 6,
      required: false,
    },
    {
      name: '16',
      description: 'User tag or identity.',
      type: 6,
      required: false,
    },
    {
      name: '17',
      description: 'User tag or identity.',
      type: 6,
      required: false,
    },
    {
      name: '18',
      description: 'User tag or identity.',
      type: 6,
      required: false,
    },
    {
      name: '19',
      description: 'User tag or identity.',
      type: 6,
      required: false,
    },
    {
      name: '20',
      description: 'User tag or identity.',
      type: 6,
      required: false,
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
      description: 'Reason for bans.',
      type: 3,
      required: false,
    },
  ],

  cooldown: false,

  category: 'developer',
  usage: ['<1> [2-20] [purge-messages] [reason]'],

  ownerOnly: false,
  requiredUserPermissions: ['ADMINISTRATOR'],
  requiredClientPermissions: ['ADMINISTRATOR'],

  disabled: false,
  developerOnly: false,
  
  run: async (ctx) => {

    let users = [];

    let _1 = ctx.interaction.options.getUser('1'); if (_1) users.push(_1);
    let _2 = ctx.interaction.options.getUser('2'); if (_2) users.push(_2);
    let _3 = ctx.interaction.options.getUser('3'); if (_3) users.push(_3);
    let _4 = ctx.interaction.options.getUser('4'); if (_4) users.push(_4);
    let _5 = ctx.interaction.options.getUser('5'); if (_5) users.push(_5);
    let _6 = ctx.interaction.options.getUser('6'); if (_6) users.push(_6);
    let _7 = ctx.interaction.options.getUser('7'); if (_7) users.push(_7);
    let _8 = ctx.interaction.options.getUser('8'); if (_8) users.push(_8);
    let _9 = ctx.interaction.options.getUser('9'); if (_9) users.push(_9);
    let _10 = ctx.interaction.options.getUser('10'); if (_10) users.push(_10);
    let _11 = ctx.interaction.options.getUser('11'); if (_11) users.push(_11);
    let _12 = ctx.interaction.options.getUser('12'); if (_12) users.push(_12);
    let _13 = ctx.interaction.options.getUser('13'); if (_13) users.push(_13);
    let _14 = ctx.interaction.options.getUser('14'); if (_14) users.push(_14);
    let _15 = ctx.interaction.options.getUser('15'); if (_15) users.push(_15);
    let _16 = ctx.interaction.options.getUser('16'); if (_16) users.push(_16);
    let _17 = ctx.interaction.options.getUser('17'); if (_17) users.push(_17);
    let _18 = ctx.interaction.options.getUser('18'); if (_18) users.push(_18);
    let _19 = ctx.interaction.options.getUser('19'); if (_19) users.push(_19);
    let _20 = ctx.interaction.options.getUser('20'); if (_20) users.push(_20);

    let purgeMessages = ctx.interaction.options.getString('purge-messages');
    let reason = ctx.interaction.options.getString('reason');

    for (let user of users) {

      let member = ctx.interaction.guild.members.cache.get(user.id);

      if (user.id == ctx.interaction.user.id) return ctx.reply.error({ content: `You cannot perform this action on yourself.` });
      if (user.id == ctx.client.user.id) return ctx.reply.error({ content: `You cannot perform this action on the bot.` });
      if (await ctx.interaction.guild.bans.fetch().then(async (banneds) => banneds.find((value) => value.user.id == user.id))) return ctx.reply.error({ content: `You cannot perform this action on banned users. \`${ctx.case.filter(user.tag)}\`` });
      if (member && !member.bannable) return ctx.reply.error(`I can\'t access the user you want to ban. \`${ctx.case.filter(user.tag)}\``);
    };

    if (users.map((user) => `${user.id}`).join(', ') !== users.filter((user, index) => users.indexOf(user) == index).map((user) => `${user.id}`).join(', ')) return ctx.reply.error({ content: `Each user can be tagged only once. \`${users.filter((user, index) => users.indexOf(user) == index).map((user) => `\`${user.tag}\``).join(', ')}\`` });

    ctx.menu.collector({

      embeds: [
        new MessageEmbed()
        .setColor(ctx.config.color.default)
        .setDescription(`You're going to ban \`${users.length}\` users, are you sure?\n\n${users.map((user, row) => `**${row +1}.** ${ctx.interaction.guild.members.cache.get(user.id) ? `${user}` : `\`${user.tag}\``} (\`${user.id}\`)`).join('\n')}`),
      ],
      components: [
        new MessageActionRow().addComponents(
          new MessageButton({ style: 'SUCCESS', emoji: ctx.config.emoji.button.approve, customId: 'approve', disabled: false }),
          new MessageButton({ style: 'DANGER', emoji: ctx.config.emoji.button.reject, customId: 'reject', disabled: false }),
        ),
      ],
      collectButton: async (button) => {
    
        if (button.customId == 'delete') {
    
          ctx.interaction.deleteReply();
  
          await button.deferUpdate();

        } else if (button.customId == 'approve') {

          for (let user of users) {

            let member = ctx.interaction.guild.members.cache.get(user.id);

            if (await ctx.interaction.guild.bans.fetch().then(async (banneds) => banneds.find((value) => value.user.id == user.id))) {
              
              await button.deferUpdate();
              
              return ctx.followUp.error({ content: `You cannot perform this action on banned users. \`${ctx.case.filter(user.tag)}\`` });
            };
            
            if (member && !member.bannable) { 
              
              await button.deferUpdate();

              return ctx.followUp.error({ content: `I can't access the user you want to ban.\`${ctx.case.filter(user.tag)}\`` });
            };

            !purgeMessages || purgeMessages == 'false' ? await ctx.interaction.guild.members.ban(user, { reason: ctx.case.filter(reason || 'None') }) : await ctx.interaction.guild.members.ban(user, { days: 7, reason: ctx.case.filter(reason || 'None') });
          };

          ctx.menu.editReply({

            embeds: [
              new MessageEmbed()
              .setColor(ctx.config.color.default)
              .setDescription(`The request has been approved. \`${users.length}\` users banned.\n\n${users.map((user, row) => `**${row +1}.** \`${user.tag}\` (\`${user.id}\`)`).join('\n')}`),
            ],
            components: [
              new MessageActionRow().addComponents([
                new MessageButton({ style: 'DANGER', emoji: ctx.config.emoji.button.delete, customId: 'delete', disabled: false }),
              ]),
            ],
          });
    
          await button.deferUpdate();
        
        } else if (button.customId == 'reject') {

          ctx.menu.editReply({

            embeds: [
              new MessageEmbed()
              .setColor(ctx.config.color.default)
              .setDescription(`The request has been cancelled. \`${users.length}\` users not banned.\n\n${users.map((user, row) => `**${row +1}.** ${ctx.interaction.guild.members.cache.get(user.id) ? `${user}` : `\`${user.tag}\`` } (\`${user.id}\`)`).join('\n')}`),
            ],
            components: [
              new MessageActionRow().addComponents([
                new MessageButton({ style: 'DANGER', emoji: ctx.config.emoji.button.delete, customId: 'delete', disabled: false }),
              ]),
            ],
          });
    
          await button.deferUpdate();
        };
      },
    });
  },
};