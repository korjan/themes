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
      wrappen: '/audio/nigga.m4a',
      rappen: '/audio/nigga.m4a',
      wrap: '/audio/nigga.m4a',
      rap: '/audio/nigga.m4a',
      sexy: '/audio/sexy.m4a',
      lekker: '/audio/lekker.m4a',
      werk: '/audio/mongol.mp3',
      raar: '/audio/raar.mp3',
      gek: '/audio/gek.m4a',
      goor: '/audio/goor.m4a',
      schnitzel: '/audio/schnitzel.m4a',
      schnitzels: '/audio/schnitzel.m4a',
      snietsel: '/audio/schnitzel.m4a',
      sneasel: '/audio/schnitzel.m4a',
      smurfen: '/audio/smurfen.mp3',
      smurf: '/audio/smurfen.mp3',
      ballonnen: '/audio/ballon.mp3',
      ballon: '/audio/ballon.mp3',
      moeder: '/audio/moeder.mp3',
      iphone: '/audio/connected.mp3',
      blackberry: '/audio/connected.mp3',
      bootcamp: '/audio/connected.mp3',
      fantastisch: '/audio/mooi.mp3',
      prachtig: '/audio/mooi.mp3',
      muziek: '/audio/muziek.mp3',
      muziekje: '/audio/muziek.mp3',
      trein: '/audio/trein.mp3',
      film: '/audio/film.mp3',
      nutteloos: '/audio/rondjes.mp3',
    },
    persons: {
      ted: '/audio/ted.mp3',
      guus: '/audio/guus.mp3',
      korjan: 'audio/guus.mp3'
    }
  };
  //tim.words = JSON.parse(document.getElementById('eventData').textContent);
}());
