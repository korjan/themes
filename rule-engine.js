var _ = require('underscore');

// { type: WORD|FACE, value "Ted"}

// var rules = HTTP.GET rules from server

exports.fire = function(ev){

	// events.push(ev);

	// if (events.length > 10) {
	// 	events.shift();
	// }

	// evaluate(events); 

	// rule : {type: WORD|FACE, value: "Ted", triggers : [{ type : AUDIO|VIDEO, value : "http://metjehoofd.heroku.com/sounds/ted.mp3"}]}

	// {rules: [{word: 'ted'}], triggers: [{audio: 'ted.mp3'}, {'video': 'ytubeb.com/fasdf'}]

	_.each(rules, function (rule){
		if (ev.word && ev.word == rule.word){
			_.each(rule.triggers, function(trigger){
				if (trigger.audio){
					playAudio(trigger.audio);
				} else if (trigger.video){
					playVideo(trigger.video);
				}
			});
		}
	});
}

exports.playAudio = function(audio){
	console.log('playing audio:', audio);
}

exports.playVideo = function(video){
	console.log('playing video:', video);
}