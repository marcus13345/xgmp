# xGraph Message Parser

xgmp is an implementation of the core communication method between xgraph systems.

Example:

```javascript
const XGMP = require('xgrmp');

// constructor works with any nodejs Stream object, with
// a data event.
let stdInParser = new XGMP(process.stdin);

stdInParser.on('message', msg => {
	console.dir(msg);
})

```