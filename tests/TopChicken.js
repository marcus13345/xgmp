const {spawn} = require('child_process');
const {StreamParser} = require('../index.js');
const which = require('which');
const path = require('path');

let node = which.sync('node');
let chickenProcess = spawn(node, [path.join(__dirname, './Chicken.js')]);

// constructor works with any nodejs Stream object, with
// a data event.
console.dir(chickenProcess);

let protocolAdapter = new StreamParser({
	read: chickenProcess.stdout//,
	// write: chickenProcess.stdin
});

protocolAdapter.on('reply', (err,cmd) => {
	if (err) console.log(err);
	else console.dir("reply >>", cmd);
});

protocolAdapter.on('ping', (cmd) => {
	console.dir("ping >>", cmd);
});

protocolAdapter.on('query', (cmd) => {
	console.dir("query >>", cmd);
});

protocolAdapter.on('error' , errorObject =>{
	console.dir("error >>", errorObject);
});

protocolAdapter.on('message', messageObject =>{
	console.dir(messageObject);
});
// protocolAdapter.on("data", data=>console.dir("data >>", data));

