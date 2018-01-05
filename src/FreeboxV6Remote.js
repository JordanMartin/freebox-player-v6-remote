const http = require('http');
const debug = require('./debug');

/**
 * Emulation de la télécommande du Freebox Player V6
 */
class FreeboxV6Remote {

	/**
	 * @param host - Nom d'hôte du Player (hd1.freebox.fr ou hd2.freebox.fr)
	 * @param remoteCode - Code de la télécommande réseau
	 */
	constructor(host, remoteCode) {
		this.host = host;
		this.remoteCode = remoteCode;
		this.DEFAULT_KEY_DELAY = 100;
	}

	red() { return this.key('red') }

	yellow() { return this.key('yellow') }

	record() { return this.key('rec') }

	play() { return this.key('play') }
	
	forward() { return this.key('fwd') }
	
	backward() { return this.key('bwd') }

	blue() { return this.key('blue') }

	green() { return this.key('green') }

	home() { return this.key('home') }

	volumeUp() { return this.key('vol_inc') }

	volumeDown() { return this.key('vol_dec') }

	progUp() { return this.key('prgm_inc') }

	progDown() { return this.key('prgm_dec') }

	mute() { return this.key('mute') }

	power() { return this.key('power') }

	up() { return this.key('up') }

	down() { return this.key('down') }

	left() { return this.key('left') }

	right() { return this.key('right') }

	
	/**
	 * Envoi une touche
	 * @param Code de la touche
	 * @return Promise avec le code http de retour
	 */
	key(key) {
		return new Promise((resolve, reject) => {
			debug('Commande :', key);
			const url = 'http://' + this.host + '/pub/remote_control?code=' + this.remoteCode + '&key=' + key;
			debug('Requête HTTP :', url);
			const req = http.request(url, (res) => {
				debug('Réponse HTTP :', res.statusCode);
				resolve(res.statusCode);
			});
			req.end();
		});
	}

	/**
	 * Envoie un ensemble de touche avec un délais entre chaque touche
	 * @param seq {Array|String} La séquence de touche à envoyer
	 * @return Promise résolu lorsque la séquence est terminé
	 */
	sequence(seq, customKeyDelay) {
		return new Promise((resolve, reject) => {
			if (seq instanceof Array) {
				return this._sequenceFromArray(seq, resolve, customKeyDelay);
			} else if (typeof seq === 'string') {
				return this._sequenceFromString(seq, resolve, customKeyDelay);
			} else {
				throw 'Invalid argument exception. Argument \'seq\' must be an Array or a String';
			}
		});
	}

	_sequenceFromString(seq, callback, customKeyDelay) {
		const keys = seq.split(/\s+/);
		return this._sequenceFromArray(keys, callback, customKeyDelay);
	}

	_sequenceFromArray(keys, callback, customKeyDelay) {
		if (!keys || !keys.length) {
			return callback && callback();
		}

		let key = keys.shift();
		let delayDuration = this.DEFAULT_KEY_DELAY;

		if (customKeyDelay !== undefined) {
			delayDuration = customKeyDelay;
		}
		console.log('delay  ', delayDuration, customKeyDelay);

		// Pause demandée
		if (/^wait\d+/.test(key)) {
			delayDuration = key.match(/wait(\d+)/)[1];

			// Si plus de commandes
			if (!keys.length) {
				return callback && callback();
			}

			// Récupère la commande suivante
			key = keys.shift();
		}

		// Envoi d'une touche
		if (delayDuration > 0) debug('Pause', delayDuration, 'ms');
		setTimeout(() => {
			this.key(key)
				.then(() => this._sequenceFromArray(keys, callback, customKeyDelay));
		}, delayDuration);
	}
}

module.exports = FreeboxV6Remote;