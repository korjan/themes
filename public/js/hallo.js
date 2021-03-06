(function() {

var _tim = window.tim;
_tim.speech.start = _start;
_start();

/*
 * Initialise, start and save the webkitSpeechRecognition.
 */
function _start() {
  var recognition = _tim.speech.recognition = new webkitSpeechRecognition();

  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'nl-NL';

  recognition.start();

  recognition.onstart = _onstart;
  recognition.onresult = _onresult;
  recognition.onerror = _onerror;
  recognition.onend = _onend;
}

function _onstart() {
  console.info('Tim is listening...');
}

function _onresult(event) {
  var results = event.results;
  var i = event.resultIndex;
  var result = results[i];
  var text = result[0].transcript;
  var words = text.split(' ');
  var lastWords = words.slice(words.length - 3, words.length);
  console.info('Last 3 words:', lastWords);

  lastWords.forEach(function(word) {
    var hit = _tim.words[word];
    if (hit && _tim.speech.lastPlayed != hit) {
      _tim.speech.lastPlayed = hit;
      _tim.play(hit);
    }
  });
}

function _onerror(event) {
  console.warn('Tim encountered a error while listening.', event);
}

function _onend() {
  console.log('Tim is not listening anymore');
  // Back of!
  setTimeout(function() {
    _start();
  }, 1000);
}

}());
