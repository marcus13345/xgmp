const { StreamParser } = require('../index.js');

let protocolAdapter = new StreamParser({
	write: process.stdout
});

protocolAdapter.ping({ "Cmd": "Test" });

// while(true) console.log('\x02p{}\x03');
