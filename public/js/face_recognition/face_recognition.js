(function() {
	var video = document.querySelector('video');
	var canvas = document.querySelector('canvas');
	var ctx = canvas.getContext('2d');
	var $face = $('#face');
	var localMediaStream = null;
	var _tim = window.tim;
	var playIntervalMinutes = 1;

	// check for getUserMedia support
		navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;


	function generateThumbnail() {
		//generate thumbnail URL data
		ctx.drawImage(video, 0, 0, 220, 150);
		var dataURL = canvas.toDataURL();

		//append img in container div
		$face.attr('src', dataURL);
	}

	function snapshot() {
		if (localMediaStream) {

			ctx.drawImage(video, 0, 0);
			// "image/webp" works in Chrome.
			// Other browsers will fall back to image/png.
				generateThumbnail();

			 timeout = setTimeout(function(){

				$face.objectdetect("all", {classifier: objectdetect.frontalface}, function(faces) {

					if (faces.length > 0 ){
						detectFace();
						// window.clearTimeout(timeout);
					} else {
						snapshot();
					}
				});
			}, 2000);
		}
	}


	function dataURItoBlob(dataURI) {
		// convert base64/URLEncoded data component to raw binary data held in a string
		var byteString;
		if (dataURI.split(',')[0].indexOf('base64') >= 0)
				byteString = atob(dataURI.split(',')[1]);
		else
				byteString = unescape(dataURI.split(',')[1]);

		// separate out the mime component
		var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

		// write the bytes of the string to a typed array
		var ia = new Uint8Array(byteString.length);
		for (var i = 0; i < byteString.length; i++) {
				ia[i] = byteString.charCodeAt(i);
		}

		return new Blob([ia], {type:mimeString});
	}

	function handleVideo(stream) {
		// if found attach feed to video element
		video.src = window.URL.createObjectURL(stream);
		localMediaStream = stream;
		snapshot(stream);
	}

	function videoError(e) {
		// no webcam found - do something
		console.error('cam error', e);
	}

	function startCamera() {
		if (navigator.getUserMedia) {
			// get webcam feed if available
			navigator.getUserMedia({video: true}, handleVideo, videoError);
		} else {
			console.error('Could not start video-input');
		}
	}






	function detectFace(){
		console.info('Tim thinks he sees a face. He is attempting to recognize it.');

		var dataURL = canvas.toDataURL('image/jpeg', 0.5);
		var blob = dataURItoBlob(dataURL);

		// Your JavaScript code for the application
		var api = new FacePP('020926d7d1cc5067ea7a219782298e09',
						 'eGLjJoOHByu_zm8uD0Z09IZAqa71A-m7',
						 { apiURL: 'https://apius.faceplusplus.com/v2' });

		var method = '/recognition/identify';

		var data = {img : blob, group_name : 'testgroep'};
		var cb = function(error, result) {
			if(!result.face[0]) {
				// No match found!
				console.info('Tim was wrong; there is no face.');
				snapshot();
				return;
			}

			var candidate = result.face[0].candidate[0];

			if (candidate.confidence > 20){
				playSoundForPerson(candidate.person_name);
			} else {
				console.info('Tim is in doubt...');
			}
			snapshot();
		};

		api.request(method, data, cb);
	}

	function playSoundForPerson(name) {
		var now = new Date();
		if(_tim.face.playedSessions[name]) {

			var playedSince = _tim.face.playedSessions[name].time.getTime();
			playedSince += 1000 * 60 * playIntervalMinutes;
			if( playedSince > now.getTime() ) {
				// Person's theme has neem played recently.
				return;
			}
		}
		recordSession(name);
		var url = _tim.persons[name];
		_tim.play(url);
	}

	function recordSession( name ) {
		_tim.face.playedSessions[name] = {
			name: name,
			time: new Date()
		};
	}


	$(document).ready(function() {
		$.material.init();
		startCamera();
	});


})();
