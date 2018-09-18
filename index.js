const EventEmitter = require('events').EventEmitter;

module.exports.StreamParser = class StreamParser extends EventEmitter {
	constructor(stream) {
		super();
		this._stream = stream;
		this.buffer = '';
		this._stream.on('data', this.data);
	}

	async data(data) {
		let parts = data.toString().split(/([\x02\x03])/g);
		for (let part of parts) {
			if (part === '\x02') {
				this.buffer = '';
			} else if (part === '\x03') {
				try {
					let cmd = JSON.parse(this.buffer);
					this.emit('message', cmd);
				} catch(e) {
					console.log('Command Parse Error:\n', this.buffer);
				}
			} else {
				this.buffer += part;
			}
		}
	}
};