
// { name: TIMIO-FACE-TED, when : 34546456234}
exports.fire = function(ev){
	// store(event);
	events.push({ev: ev, on : new Date());

	if (events.length > 10) {
		events.shift();
	}

	evaluate(events); 
}

exports.evaluate = function(evs){
	var rules = db.collection('rules').find();
	console.log('rules: ', rules);

	_.each(rules, function(rule){
		// events.contains(rule.name);
		_.filter(events, function(ev){return ev.name == rule})
		if (rule.name == evs.name){
			if (rule.when = )
		}
	});
}

// rule: {triggeredBy: [{name: TIMIO-FACE-TED, when : 1000}, {name:'schnitzel'}], events: [{eventname}, themes : [{audio : key}]]
exports.addRule = function(rule){
	db.collection('rules').insert(rule, function(err, result){
        console.log(err, result);
   });
}