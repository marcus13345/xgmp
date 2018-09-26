// const { StreamParser } = require('../index.js');

// process.stdout.setRawMode(true);

// let protocolAdapter = new StreamParser({
// 	write: process.stdout,
// });

// while (true) protocolAdapter.ping({ "Cmd": "Test" })

while(true) console.log('\x02p{}\x03');
