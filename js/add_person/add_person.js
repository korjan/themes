(function() {
	var groupName = 'testgroep',
		faceApi = new FacePP('020926d7d1cc5067ea7a219782298e09',
			'eGLjJoOHByu_zm8uD0Z09IZAqa71A-m7',
			{ apiURL: 'http://apius.faceplusplus.com/v2' }),
		createFaceSetCall = '/faceset/create',
		createFaceCall = '/detection/detect',
		createPersonCall = '/person/create',
		trainGroupCall = '/train/identify',
		person_name,
		faceId,
		fileReader = new FileReader(),
		formdata;

		


	$('#add-person-form').on('submit', function( event ) {
		event.preventDefault();

		formdata = {};
		person_name = $('#person-name-field').val();
		formdata['person_name'] = person_name;
		formdata['group_name'] = groupName;
		getBlobFromFile($('#img-field')[0].files[0], function( image ) {
			formdata['img'] = image;
			createFace( formdata );
		});
		return false;
	});


	function getBlobFromFile(file, callback) {
		
		fileReader.onload = function(e) { 
			var content = e.target.result;
			callback(new Blob([new Uint8Array(content)]));
		}
		fileReader.readAsArrayBuffer(file);

/*		var dataView = new Uint8Array(file);
		console.log(dataView);
		var dataBlob = new Blob([dataView]);//new Blob
		return dataBlob;*/
	}


	function createFaceSet(faceData) {
		console.log(faceData);
		faceId = faceData.face[0]['face_id'];
		var data = {
			face_id: faceId,
			faceset_name: 'faceset_' + person_name
		};
		faceApi.request(createFaceSetCall, data, function(err, data) {
			createPerson(data);
		});
	}

	function createPerson(faceSetData) {
		console.log(faceSetData);
		formdata['face_id'] = faceId;

		faceApi.request(createPersonCall, formdata, function() {
			trainGroup();
		});
		
		
		// Create faceset
		// Create faces with faceset-id
		// Create person with face-ids
	}

	function createFace(formdata) {
		console.log('creating face.');
		faceApi.request(createFaceCall, formdata, function(err, data) {
			createFaceSet(data);
		});
	}


	function trainGroup() {
		faceApi.request(trainGroupCall, {group_name: groupName}, function() {
			alert('persoon toegevoegd');
		});
	}


})();
