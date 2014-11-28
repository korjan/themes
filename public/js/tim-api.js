(function() {
	window.tim = {
		speech: {
			recognition: null,
			start: null,
			lastPlayed: null,
		},
		face: {
			playedSessions: {}
		},
		isPlaying: false,

		// Play an audio file.
		play: function(url) {
			if (!url || window.tim.isPlaying) {
			return;
			}

			window.tim.isPlaying = true;
			window.tim.lastPlayed = url;
			var audio = new Audio();
			audio.src = url;
			audio.onerror = function(event) {
				console.warn('Audio error', event);
				window.tim.isPlaying = false;
				};
				audio.onended = function() {
				window.tim.isPlaying = false;
			};
			audio.play();
		},

		// Word triggers.
		words: {
			wrappen: '/public/nigga.m4a',
			rappen: '/public/nigga.m4a',
			wrap: '/public/nigga.m4a',
			rap: '/public/nigga.m4a',
			sexy: '/public/sexy.m4a',
			lekker: '/public/lekker.m4a',
			werk: '/public/mongol.mp3',
			raar: '/public/raar.mp3',
			gek: '/public/gek.m4a',
			goor: '/public/goor.m4a',
			schnitzel: '/public/schnitzel.m4a',
			schnitzels: '/public/schnitzel.m4a',
			snietsel: '/public/schnitzel.m4a',
			sneasel: '/public/schnitzel.m4a',
			smurfen: '/public/smurfen.mp3',
			smurf: '/public/smurfen.mp3',
			ballonnen: '/public/ballon.mp3',
			ballon: '/public/ballon.mp3',
		},
		persons: {
			ted: '/public/ted.mp3',
			guus: '/public/guus.mp3',
		}
	};
}());
