const { StreamParser } = require('xgmp');

let protocolAdapter = new StreamParser({
	write: process.stdout
});

//test stream close handling
setTimeout(()=>{
	console.log("Closing the write stream -process.stdout");
	process.exit(0);
}, 15000);

setInterval(()=>{
	let rand = Math.random();
	switch(true){
		case (rand<0.25): {
			protocolAdapter.ping({ "Cmd": "TestPing" });
			break;
		}
		case (rand <0.5):{
			protocolAdapter.query({ "Cmd": "TestQuery" });
			break;
		}
		case (rand<0.75): {
			protocolAdapter.reply("Error returned in Reply", { "Cmd": "TestReply" });
			break;
		}
		default: {
			protocolAdapter.reply(null, { "Cmd": "TestReply" });
		}
	}
},1000);
