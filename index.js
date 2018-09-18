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

				switch (this.buffer[0]) {
					case '0x04': {
						//ping
						try {
							let cmd = JSON.parse(this.buffer.splice(0,1));
							this.emit('ping', cmd);
						} catch (e) {
							console.log('Command Parse Error:\n', this.buffer);
						}
					}
					case '0x05': {
						//query
						try {
							let cmd = JSON.parse(this.buffer.splice(0,1));
							this.emit('query', cmd);
						} catch (e) {
							console.log('Command Parse Error:\n', this.buffer);
						}
					}
					case '0x06': {
						//reply
						try {
							let cmd = JSON.parse(this.buffer.splice(0,1));
							this.emit('reply', cmd);
						} catch (e) {
							console.log('Command Parse Error:\n', this.buffer);
						}
					}
					default: {
						console.log(`message type of undefined type ${this.buffer[0].toHex()}`)
					}
				}
			} else {
				this.buffer += part;
			}
		}
	}
};