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
      maar: '/audio/raar.mp3',
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
      mondriaan: '/audio/moeder.mp3',
      iphone: '/audio/connected.mp3',
      blackberry: '/audio/connected.mp3',
      bootcamp: '/audio/connected.mp3',
      fantastisch: '/audio/mooi.mp3',
      prachtig: '/audio/mooi.mp3',
      muziek: '/audio/muziek.mp3',
      muziekje: '/audio/muziek.mp3',
      trein: '/audio/trein.mp3',
      9292: '/audio/trein.mp3',
      film: '/audio/film.mp3',
      nutteloos: '/audio/rondjes.mp3',
      lunch: '/audio/bacon.mp3',
      lunchen: '/audio/bacon.mp3',
      bacon: '/audio/bacon.mp3',
      ongezond: '/audio/bacon.mp3',
      bier: '/audio/bier.mp3',
      dag: '/audio/dag.mp3',
      doei: '/audio/dag.mp3',
      hallo: '/audio/hallo.mp3',
      ajax: '/audio/feyenoord.mp3',
      voetbal: '/audio/feyenoord.mp3',
      vet: '/audio/vet.mp3',
      'k**': '/audio/motherfucker.mp3',
      'f***': '/audio/motherfucker.mp3',
      'f*****': '/audio/motherfucker.mp3',
      'm***********': '/audio/motherfucker.mp3',
      maar: '/audio/maar.mp3',
    },
  };

  window.tim.persons = JSON.parse(document.getElementById('eventData').textContent);
}());
