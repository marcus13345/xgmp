# xGraph Message Parser

xgmp is an implementation of the core communication method between xgraph systems.

Example:

```javascript
const {StreamParser} = require('xgmp');

// constructor works with any nodejs Stream object, with
// a data event.
let protocolAdapter = new StreamParser({read:process.stdin});

protocolAdapter.on('reply', ({err,cmd}) => {
	if (err) console.log(err);
	else console.dir("reply >>", cmd);
});

protocolAdapter.on('ping', (cmd) => {
	console.dir("ping >>", cmd);
});

protocolAdapter.on('query', (cmd) => {
	console.dir("query >>", cmd);
});

protocolAdapter.on('error' , (errorObject) =>{
	console.dir("error >>", errorObject);
});

```

Example:

```javascript
const {StreamParser} = require('xgmp');

// constructor works with any nodejs Stream object, with
// a data event.
let protocolAdapter = new StreamParser({write:process.stdout});

protocolAdapter.ping({Cmd:"PingTEST"});
protocolAdapter.query({Cmd:"QueryTEST"});
protocolAdapter.reply("",{Cmd:"ReplyTEST"});
protocolAdapter.reply(null,{Cmd:"ReplyTEST"});
protocolAdapter.reply(false,{Cmd:"ReplyTEST"});
protocolAdapter.reply("Broken",{Cmd:"ReplyTEST"});

```