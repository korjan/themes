(function() {

window.tim.start = _start;
_start();

/*
 * Initialise, start and save the webkitSpeechRecognition.
 */
function _start() {
  var recognition = new webkitSpeechRecognition();
  window.tim.recognition = recognition;

  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'nl-NL';

  recognition.start();

  recognition.onstart = function(event) {
    console.log('onstart', event);
  };

  recognition.onresult = function(event) {
    var results = event.results;
    var i = event.resultIndex;
    var result = results[i];
    console.info('Result - Final: %s, Confidence: %s, Word: %s, Length: %s', result.isFinal, result[0].confidence, result[0].transcript, result.length);
    var text = result[0].transcript;
    var words = text.split(' ');
    var lastWords = words.slice(words.length - 3, words.length);
    console.log(lastWords);

    lastWords.forEach(function(word) {
      var hit = window.tim.words[word];

      if (hit && !window.tim.isPlaying && window.tim.lastPlayed != hit) {
        console.log('Play', hit);
        window.tim.isPlaying = true;
        window.tim.lastPlayed = hit;
        var audio = new Audio();
        audio.src = hit;
        audio.onerror = function() {
          console.warn('err', arguments);
        };
        audio.onended = function() {
          window.tim.isPlaying = false;
        };
        audio.play();
      }
    });
  };

  recognition.onerror = function(event) {
    console.warn('onerror', event);
    // Back of!
    setTimeout(function() {
      window.tim.start();
    }, 1000);
  };

  recognition.onend = function(event) {
    console.log('onend', event);
  };
}

}());
