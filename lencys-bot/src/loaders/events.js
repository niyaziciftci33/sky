const ctx = new (require('../interfaces/context.js'));

const { promisify } = require('util');
const { glob } = require('glob');

module.exports = async (client) => {

  let handlers = await promisify(glob)(`${process.cwd()}/src/handlers/*.js`);

  handlers.map((value) => {
    
    let handler = require(value);

    if (!handler.name) return;

    client.on(handler.name, handler.run.bind(null, client));
  });

  let eventsArray = [];
  let dataArray = [];

  let events = await promisify(glob)(`${process.cwd()}/src/events/*.js`);

  events.map((value) => {
    
    let event = require(value);

    if (!event.name) return;
    if (event.disabled == true) return;
    if (event.disabled == undefined) return eventsArray.push(`${ctx.terminal.color({ text: event.name, hex: ctx.config.color.error })}`);

    eventsArray.push(event);
    dataArray.push(`${ctx.terminal.color({ text: event.name, hex: ctx.config.color.confirmation })} ${ctx.terminal.color({ text: `(${value.split('events/')[1]})`, hex: ctx.config.color.info })}`);

    client.on(event.name, event.run.bind(null, client));
  });

  console.log(`${ctx.terminal.color({ text: 'EVENTS', hex: '#FFFFFF', bold: true })}\n\n${dataArray.map((value, row) => `  ${ctx.terminal.color({ text: `${row +1}.`, hex: '#FFFFFF', bold: true })} ${value}`).join('\n')}\n`);
};