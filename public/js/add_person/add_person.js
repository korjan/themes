(function() {
	var groupName = 'testgroep',
		faceApi = new FacePP('020926d7d1cc5067ea7a219782298e09',
			'eGLjJoOHByu_zm8uD0Z09IZAqa71A-m7',
			{ apiURL: 'https://apius.faceplusplus.com/v2' }),
		createFaceSetCall = '/faceset/create',
		createFaceCall = '/detection/detect',
		createPersonCall = '/person/create',
		trainGroupCall = '/train/identify',
		addImageToPersonCall = '/person/add_face',
		person_name,
		faceId,
		fileReader = new FileReader(),
		formdata,
		faceIds,
		modal = $('.modal'),
		$submitButton = $('button.submit');

		


	$('#add-person-form').on('submit', function( event ) {
		event.preventDefault();

		formdata = {};
		faceIds = [];
		emailadres = $('#email-field').val();
		formdata['person_name'] = emailadres.toLowerCase().replace('@', '');
		formdata['group_name'] = groupName;
		if( !emailadres || !$('.img-field:eq(0)')[0].files.length ) {
			// No files defined.
			return;
		}
		saveEmailadres(emailadres);
		$submitButton.button('loading');

		// Create all the things!
		createPerson().then(function() {
			addMultipleFaces($('.img-field')).then(function(faceData) {
				addFaceToPerson(faceData).then(function() {
					showModal();
					trainGroup();
					$submitButton.button('reset');
				});
			});
		});
		return false;
	});

	function saveEmailadres(email) {
		localStorage.setItem('emailadres', email);
	}


	function showModal() {
		modal.modal({
			show: true
		});
	}
	window.showModal = showModal;


	function addMultipleFaces($images) {
		var promises = [];

		$images.each(function() {
			if( !$(this)[0].files.length ) {
				// Image is empty.
				return;
			}
			formdata['img'] = $(this)[0].files[0];


			promises.push( new Promise(function(resolve, reject) {

				createFace(formdata).then(function(facedata) {
					if(facedata && facedata.face.length) {
						faceIds.push(facedata.face[0]['face_id']);
					} else {
						alert('Geen gezicht gedetecteerd, probeer een duidelijke foto.');
						$submitButton.button('reset');
					}
					resolve();
				}).catch(function() {
					alert('Kon foto niet uploaden, misschien te groot?');
					$submitButton.button('reset');
				});
			}));

		});

		return Promise.all( promises );
	}




	function getBlobFromFile(file, callback) {
		
		fileReader.onload = function(e) { 
			var content = e.target.result;
			callback(new Blob([new Uint8Array(content)]));
		}
		fileReader.readAsArrayBuffer(file);
	}


	function createFaceSet(faceData) {
		faceId = faceData.face[0]['face_id'];
		var data = {
			face_id: faceId,
			faceset_name: 'faceset_' + person_name
		};
		return performRequest(createFaceSetCall, data);
	}

	function createPerson(faceSetData) {
		return performRequest(createPersonCall, formdata, true);
	}

	function addFaceToPerson() {
		formdata['face_id'] = faceIds.join(',');
		console.log('faceids:', faceIds.join(','));
		return performRequest(addImageToPersonCall, formdata);
	}

	function createFace(formdata) {
		return performRequest(createFaceCall, formdata);
	}


	function trainGroup() {
		return performRequest(trainGroupCall, {group_name: groupName});
	}


	function performRequest(requestName, data, mayFail) {
		return new Promise(function(resolve, reject) {
			faceApi.request(requestName, data, function( err, data ) {
				if( err && !mayFail ) {
					reject( err );
					return;
				}

				resolve( data );
			});
		});
	}


	$.material.ripples();

})();
