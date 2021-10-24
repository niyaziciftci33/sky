const { MessageEmbed } = require('discord.js');

module.exports = {

  name: 'eval',
  description: 'Runs entered code.',
  type: 1,
  options: [
    {
      name: 'code',
      description: 'Code written in js language.',
      type: 3,
      required: true,
    },
    {
      name: 'full',
      description: 'Shows all output.',
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
  ],

  cooldown: false,

  category: 'developer',
  usage: ['<code> [full]'],

  ownerOnly: false,
  requiredUserPermissions: false,
  requiredClientPermissions: false,

  disabled: false,
  developerOnly: true,
  
  run: async (ctx) => {

    try {
  
      function clean (text) {
  
        if (typeof (text) == 'string') return text.replaceAll(/`/g, '`' + String.fromCharCode(8203)).replaceAll(/@/g, '@' + String.fromCharCode(8203));
  
        else return text;
      };
  
      let code = ctx.interaction.options.getString('code');
      let full = ctx.interaction.options.getString('full');

      let evaled = ctx.module.util.inspect(eval(code));
  
      if (!full || full == 'false') {
    
        ctx.interaction.reply({

          ephemeral: true,
          embeds: [
            new MessageEmbed()
            .setColor(ctx.config.color.default)
            .addFields([
              { name: `Input`, value: `\`\`\`js\n${code}\`\`\`` },
              { name: `Output`, value: `\`\`\`js\n${clean(evaled).length > 1000 ? `${clean(evaled).slice(0, 1000)}...` : `${clean(evaled)}`}\`\`\`` },
              { name: `Type`, value: `\`${typeof(evaled)}\``, inline: true },
              { name: `Displayed`, value: `\`${clean(evaled).length > 1000 ? '1.000' : ctx.case.number(clean(evaled).length)}/${ctx.case.number(clean(evaled).length)}\``, inline: true },
              { name: `Delay`, value: `\`0.0${ctx.client.ws.ping} ms\``, inline: true },
            ]),
          ],
        });
  
      } else if (full == 'true') {
  
        ctx.interaction.reply({

          ephemeral: true,
          embeds: [
            new MessageEmbed()
            .setColor(ctx.config.color.default)
            .setDescription(`**Output**\n\`\`\`js\n${clean(evaled).length > 2000 ? `${clean(evaled).slice(0, 2000)}...` : `${clean(evaled)}`}\`\`\``)
            .addFields([
              { name: `Type`, value: `\`${typeof(evaled)}\``, inline: true },
              { name: `Displayed`, value: `\`${clean(evaled).length > 2000 ? '2.000' : ctx.case.number(clean(evaled).length)}/${ctx.case.number(clean(evaled).length)}\``, inline: true },
              { name: `Delay`, value: `\`0.0${ctx.client.ws.ping} ms\``, inline: true },
            ]),
          ],
        });
      };
  
    } catch (error) {
  
      ctx.interaction.reply({
        
        ephemeral: true,
        embeds: [
          new MessageEmbed()
          .setColor(ctx.config.color.default)
          .setDescription(`\`\`\`js\n${clean(error).length > 2000 ? `${clean(error).slice(0, 2000)}...` : `${clean(error)}`}\n\`\`\``),
        ],
      });
    };
  },
};
