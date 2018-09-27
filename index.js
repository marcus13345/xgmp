const EventEmitter = require('events').EventEmitter;

module.exports.StreamParser = class StreamParser extends EventEmitter {
	constructor(obj) {
		super();

		this.buffer = '';
		this._STATE = 'CLOSED';

		if ('read' in obj && obj.read.readable) {
			obj.read.on('data', this.data.bind(this));
			obj.read.on('close', this.close.bind(this));
			this._STATE = 'OPEN';
		}

		if ('write' in obj && obj.write.writable) {
			this._writeStream = obj.write;
			obj.write.on('close', this.close.bind(this));
			this._STATE = "OPEN";
		}
	}

	error(errorObject) {
		this.emit('error', errorObject);
	}

	close(closeObject) {
		if (this._STATE === 'CLOSED') return;
		this._STATE = 'CLOSED';
		this.emit('close', closeObject);
	}

	sendMessage(messageObject) {
		this.emit('message', messageObject);
	}

	async data(data) {
		if (this._STATE === 'CLOSED') {
			this.error({ 'type': "E_STREAM_CLOSED", 'data': data });
			return;
		}
		this.emit('data', data);
		let parts = data.toString().split(/([\x02\x03])/g);
		for (let part of parts) {
			if (part === '\x02') {
				this.buffer = '';
			} else if (part === '\x03') {
				this.parseMessageType(this.buffer);
			} else {
				this.buffer += part;
			}
		}
	}

	parseMessageType(message) {
		let type = message[0];
		message = message.substr(1);
		switch (type) {
			case 'p': {
				//ping
				try {
					let cmd = JSON.parse(message);
					this.emit('ping', cmd);
					this.sendMessage({ 'type': "ping", 'cmd': cmd });
				} catch (e) {
					this.error({ 'type': "E_COMMAND_PARSE_ERROR", 'data': message, 'error': e });
				}
				break;
			}
			case 'q': {
				//query
				try {
					let cmd = JSON.parse(message);
					this.emit('query', cmd);
					this.sendMessage({ 'type': "query", 'cmd': cmd });
				} catch (e) {
					this.error({ 'type': "E_COMMAND_PARSE_ERROR", 'data': message });
				}
				break;
			}
			case 'r': {
				//reply
				try {
					//split on null op 0x00
					let [err, cmd] = message.split('\x00');
					cmd = JSON.parse(cmd);
					if (err === '') err = null;
					this.emit('reply', { 'err': err, 'cmd': cmd });
					this.sendMessage({ 'type': "reply", 'err': err, 'cmd': cmd });

				} catch (e) {
					this.error({ 'type': "E_COMMAND_PARSE_ERROR", 'data': message });
				}
				break;
			}
			default: {
				this.error({ 'type': "E_NO_MESSAGE_TYPE", 'data': type + message });
			}
		}
	}

	reply(err, obj) {
		if (this._STATE === 'CLOSED') {
			this.error({ 'type': "E_STREAM_CLOSED", 'data': data });
			return;
		}
		let buffer;
		if ((err === null) || (err === false)) buffer = "";
		else {
			try {
				buffer = err.toString();
			}
			catch (e) {
				try {
					buffer = JSON.stringify(err);
				}
				catch (e) {
					buffer = 'E_ERROR_PARSE_ERROR';
					this.error({ type: "E_ERROR_PARSE_ERROR", data: err });
				}
			}
		}
		this._writeStream.write(`\x02r${buffer}\x00${JSON.stringify(obj)}\x03`);
	}

	ping(obj) {
		if (this._STATE === 'CLOSED') {
			this.error({ 'type': "E_STREAM_CLOSED", 'data': data });
			return;
		}
		this._writeStream.write(`\x02p${JSON.stringify(obj)}\x03`);
	}

	query(obj) {
		if (this._STATE === 'CLOSED') {
			this.error({ 'type': "E_STREAM_CLOSED", 'data': data });
			return;
		}
		this._writeStream.write(`\x02q${JSON.stringify(obj)}\x03`);
	}
};