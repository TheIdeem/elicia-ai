const Retell = require('retell-sdk');
const retell = new Retell({ apiKey: process.env.RETELL_API_KEY });
console.log('retell.call:', retell.call);
console.log('typeof retell.call.create:', typeof retell.call?.create);