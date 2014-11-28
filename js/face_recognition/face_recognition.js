(function() {
	var video = document.querySelector('video');
	var canvas = document.querySelector('canvas');
	var ctx = canvas.getContext('2d');
	var $face = $('#face');
	var localMediaStream = null;

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
					console.log('faces', faces);

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
		console.log('snapshot');
		snapshot(stream);
	}

	function videoError(e) {
		// no webcam found - do something
		console.log('cam error', e);
	}

	function startCamera() {
		if (navigator.getUserMedia) {
			// get webcam feed if available
			console.log('get user media');
			navigator.getUserMedia({video: true}, handleVideo, videoError);
		} else {
			console.log('darn');
		}
	}






	function detectFace(){

		var dataURL = canvas.toDataURL('image/jpeg', 0.5);
		var blob = dataURItoBlob(dataURL);

		// Your JavaScript code for the application
		var api = new FacePP('020926d7d1cc5067ea7a219782298e09',
						 'eGLjJoOHByu_zm8uD0Z09IZAqa71A-m7',
						 { apiURL: 'https://apius.faceplusplus.com/v2' });

		var method = '/recognition/identify';

		var data = {img : blob, group_name : 'testgroep'};
		var cb = function(error, result) {
			console.log('face++ callback:', error, result);

			console.log('recognized remotely:' + new Date() + '<br/>');
			if(!result.face[0]) {
				// No match found!
				snapshot();
				return;
			}

			var candidate = result.face[0].candidate[0];

			if (candidate.confidence > 20){
				playSoundForPerson(candidate.person_name);
			}
			snapshot();
		}
		api.request(method, data, cb);
	}

	function playSoundForPerson(name) {
		var hit = window.tim.persons[name];
		if (hit) {
			window.tim.play(hit);
		}
	}


	$(document).ready(function() {
		$.material.init();
		startCamera();
	});


})();
