const { spawn } = require('child_process');
const { StreamParser } = require('../index.js');
const which = require('which');
const path = require('path');

let node = which.sync('node');
let chickenProcess = spawn(node, [path.join(__dirname, './Chicken.js')]);

// constructor works with any nodejs Stream object, with
// a data event.
console.dir(chickenProcess);

let protocolAdapter = new StreamParser({
	read: chickenProcess.stdout
});

protocolAdapter.on('error', errorObject => {
	console.dir("error >>", errorObject);
	console.log(' ');
});

protocolAdapter.on('close', closeEvt => {
	console.dir("closed >> It will say false, but trust me it's closed.", closeEvt);
});

protocolAdapter.on('reply', ({ err, cmd }) => {
	if (err) {
		console.dir("reply-error >>", err);
		console.log(' ');
	} else {
		console.dir("reply-noerror >>", cmd);
		console.log(' ');
	}
});

protocolAdapter.on('ping', (cmd) => {
	console.dir("ping >>", cmd);
	console.log(" ");
});

protocolAdapter.on('query', (cmd) => {
	console.dir("query >>", cmd);
	console.log(' ');
});


// protocolAdapter.on('message', messageObject => {
// 	console.dir("message >>", messageObject);
// 	console.log(' ');
// });

// protocolAdapter.on("data", data => {
// 	console.dir("data >>", data)
// 	console.log(' ');
// );
