(function() {



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

	startRecognizing = function(){
		var video = document.querySelector('video');
		var canvas = document.querySelector('canvas');
		var ctx = canvas.getContext('2d');
		var localMediaStream = null;

		log('starting :' + new Date() + '<br/>');

		function generateThumbnail(i) {
				//generate thumbnail URL data
				var context = canvas.getContext('2d');
				context.drawImage(video, 0, 0, 220, 150);
				var dataURL = canvas.toDataURL();

				//append img in container div
				document.getElementById('face').setAttribute('src', dataURL);
				var blob = dataURItoBlob(dataURL);
				console.log('blob', blob);
		}

		function snapshot() {
			if (localMediaStream) {

				ctx.drawImage(video, 0, 0);
				// "image/webp" works in Chrome.
				// Other browsers will fall back to image/png.
				//document.querySelector('#face').src = canvas.toDataURL('image/webp');
					generateThumbnail();

				 timeout = setTimeout(function(){
					console.log('detecting in image');

					$("#face").objectdetect("all", {classifier: objectdetect.frontalface}, function(faces) {
						console.log('faces', faces);

						log('detected locally:' + new Date() + '<br/>');

						if (faces.length > 0 ){
							detectFace();
							// window.clearTimeout(timeout);
						} else {
							snapshot();
						}
						for (var i = 0; i < faces.length; ++i) {
							log('BAM Face<br/>');
							$(this).highlight(faces[i], "red");
							//document.getElementById('audioyo').play();
							console.log('face:', i,  faces[i]);
						}
					});
				}, 2000);
			} else {
				//probeer totdat je toegang tot de camera hebt.
				var interval = setTimeout(function(){
					console.log('already access?');
					// snapshot();
				}, 1000);
			}
		}

		window.snapshot = snapshot;

		function handleVideo(stream) {
			// if found attach feed to video element
			video.src = window.URL.createObjectURL(stream);
			localMediaStream = stream;
			console.log('snapshot');
			snapshot();
		}

		function videoError(e) {
			// no webcam found - do something
			console.log('cam error', e);
		}
		// check for getUserMedia support
		navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;

		if (navigator.getUserMedia) {
			// get webcam feed if available
			console.log('get user media');
			navigator.getUserMedia({video: true}, handleVideo, videoError);
		} else {
			console.log('darn');
		}

	}






	function detectFace(){

		var dataURL = document.querySelector('canvas').toDataURL('image/jpeg', 0.5);
		var blob = dataURItoBlob(dataURL);
		// var fd = new FormData(document.forms[0]);
		// fd.append("canvasImage", blob);

		// Your JavaScript code for the application
		var api = new FacePP('020926d7d1cc5067ea7a219782298e09',
						 'eGLjJoOHByu_zm8uD0Z09IZAqa71A-m7',
						 { apiURL: 'https://apius.faceplusplus.com/v2' });

		// method = 'detection/detect';
		method = '/recognition/identify';
		// data  = { url : 'https://photos-5.dropbox.com/t/1/AACwX0zc_YOojWG97fHdUvmhX-OBtgL4ze-HFFBoEvFEqA/12/1613825/jpeg/1024x768/3/1417176000/0/2/nerd.jpg/jrDpSQ_yFr8zAL5g4uW75EU1NAqPC2w7XD1PXGwPexg' };

		data = {img : blob, group_name : 'testgroep'};
		cb = function(error, result) {
			console.log('face++ callback:', error, result);

			log('recognized remotely:' + new Date() + '<br/>');

			//detect returns result.face[0].face_id;

			// identify returns result.candidate[];
			// person_name == ""
			//TODO: check that Ted is the actual match.
			var candidate = result.face[0].candidate[0];
			if (candidate.person_name == 'Ted' && candidate.confidence > 20){
				var audio = new Audio();
				audio.src = '/public/ted.mp3';
				audio.play();
			}
			snapshot();
		}
		api.request(method, data, cb);
		// console.log('session', session);
	}




	$.fn.highlight = function(rect, color) {
		$("<div />", {
			"css": {
				"border":   "2px solid " + color,
				"position": "absolute",
				"left":   ($(this).offset().left + rect[0]) + "px",
				"top":    ($(this).offset().top  + rect[1]) + "px",
				"width":  rect[2] + "px",
				"height":   rect[3] + "px"
			}
		}).appendTo("body");
	};


	$(document).ready(function() {
		$.material.init();
		startRecognizing();
	});


})();
