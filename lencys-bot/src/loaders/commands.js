const ctx = new (require('../interfaces/context.js'));

const { promisify } = require('util');
const { glob } = require('glob');

module.exports = async (client) => {

  let commandsArray = [];
  let dataArray = [];
  
  let commands = await promisify(glob)(`${process.cwd()}/src/commands/*/*.js`);
  
  commands.map((value) => {

    let command = require(value);

    if (!command.name) return;
    if (command.description == undefined || command.type == undefined || command.options == undefined || command.cooldown == undefined || command.ownerOnly == undefined || command.requiredUserPermissions == undefined || command.requiredClientPermissions == undefined || command.disabled == undefined || command.developerOnly == undefined) return dataArray.push(`${ctx.terminal.color({ text: command.name, hex: ctx.config.color.error })} ${ctx.terminal.color({ text: `(${value.split('commands/')[1]})`, hex: ctx.config.color.info })}`);

    commandsArray.push(command);
    dataArray.push(`${ctx.terminal.color({ text: command.name, hex: ctx.config.color.confirmation })} ${ctx.terminal.color({ text: `(${value.split('commands/')[1]})`, hex: ctx.config.color.info })}`);

    client.commands.set(command.name, command);
  });

  console.log(`${ctx.terminal.color({ text: 'COMMANDS', hex: '#FFFFFF', bold: true })}\n\n${dataArray.map((value, row) => `  ${ctx.terminal.color({ text: `${row +1}.`, hex: '#FFFFFF', bold: true })} ${value}`).join('\n')}\n`);

  client.on('ready', async () => {

    client.application.commands.set(commandsArray);
  });
};
