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
		formdata;

		


	$('#add-person-form').on('submit', function( event ) {
		event.preventDefault();

		formdata = {};
		emailadres = $('#email-field').val();
		formdata['person_name'] = emailadres.toLowerCase().replace('@', '');
		formdata['group_name'] = groupName;
		if( !emailadres || !$('#img-field')[0].files.length ) {
			// No files defined.
			return;
		}

		getBlobFromFile($('#img-field')[0].files[0], function( image ) {
			formdata['img'] = image;

			// Create all the things!
			createPerson().done(function() {
				createFace(formdata).done(function(faceData) {
					addFaceToPerson(faceData).done(function() {
						trainGroup();
						alert('Foto toegevoegd!');
					});
				});
			});

		});
		return false;
	});




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

	function addFaceToPerson(faceData) {
		formdata['face_id'] = faceData.face[0]['face_id'];
		return performRequest(addImageToPersonCall, formdata);
	}

	function createFace(formdata) {
		return performRequest(createFaceCall, formdata);
	}


	function trainGroup() {
		return performRequest(trainGroupCall, {group_name: groupName});
	}


	function performRequest(requestName, data, mayFail) {
		var dfd = new jQuery.Deferred();
		faceApi.request(requestName, data, function( err, data ) {
			if( err && !mayFail ) {
				dfd.reject( err );
				return;
			}

			dfd.resolve( data );
		});
		return dfd.promise();
	}


	$.material.ripples();

})();
