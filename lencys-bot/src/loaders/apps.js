const ctx = new (require('../interfaces/context.js'));

const { promisify } = require('util');
const { glob } = require('glob');

module.exports = async (client) => {

  let appsArray = [];
  let dataArray = [];

  let apps = await promisify(glob)(`${process.cwd()}/src/apps/*/*.js`);
  
  apps.map((value) => {

    let app = require(value);

    if (!app.name) return;
    if (app.type == undefined || app.requiredUserPermissions == undefined) return dataArray.push(`${ctx.terminal.color({ text: app.name, hex: ctx.config.color.error })} ${ctx.terminal.color({ text: `(${value.split('apps/')[1]})`, hex: ctx.config.color.info })}`);

    appsArray.push(app);
    dataArray.push(`${ctx.terminal.color({ text: app.name, hex: ctx.config.color.confirmation })} ${ctx.terminal.color({ text: `(${value.split('apps/')[1]})`, hex: ctx.config.color.info })}`);

    client.apps.set(app.name, app);
  });

  console.log(`${ctx.terminal.color({ text: 'APPS', hex: '#FFFFFF', bold: true })}\n\n${dataArray.map((value, row) => `  ${ctx.terminal.color({ text: `${row +1}.`, hex: '#FFFFFF', bold: true })} ${value}`).join('\n')}\n`);

  client.on('ready', async () => {

    client.application.commands.set(appsArray);
  });
};
