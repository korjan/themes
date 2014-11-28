(function() {

var _tim = window.tim;
_tim.speech.start = _start;
_start();

/*
 * Initialise, start and save the webkitSpeechRecognition.
 */
function _start() {
  var recognition = new webkitSpeechRecognition();
  _tim.recognition = recognition;

  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'nl-NL';

  recognition.start();

  recognition.onstart = function() {
    console.info('Tim is listening...');
  };

  recognition.onresult = function(event) {
    var results = event.results;
    var i = event.resultIndex;
    var result = results[i];
    var text = result[0].transcript;
    var words = text.split(' ');
    var lastWords = words.slice(words.length - 3, words.length);
    console.info('Last 3 words:', lastWords);

    lastWords.forEach(function(word) {
      var hit = _tim.words[word];
      if (hit) {
        _tim.play(hit);
      }
    });
  };

  recognition.onerror = function(event) {
    console.warn('Tim encountered a error while listening.', event);
    // Back of!
    setTimeout(function() {
      _start();
    }, 1000);
  };

  recognition.onend = function() {
    console.log('Tim is not listening anymore');
  };
}

}());
