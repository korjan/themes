(function() {
	var groupName = 'testgroep',
		faceApi = new FacePP('020926d7d1cc5067ea7a219782298e09',
			'eGLjJoOHByu_zm8uD0Z09IZAqa71A-m7',
			{ apiURL: 'http://apius.faceplusplus.com/v2' }),
		createFaceSetCall = '/faceset/create',
		createFaceCall = '/detection/detect',
		createPersonCall = '/person/create',
		person_name,
		faceId;


	$('#add-person-form').on('submit', function() {
		var formdata = new FormData();
		person_name = $('#person-name-field').val();
		formdata.append('person_name', person_name);
		formdata.append('img', $('#img-field')[0].files[0]);
		formdata.append('group_name', groupName);
		createFace( formdata );
	});


	function createFaceSet(faceData) {
		console.log(faceData);
		faceId = faceData.face[0];
		var data = {
			face_id: faceId,
			faceset_name: 'faceset_' + person_name
		};
		faceApi.requestAsync(createFaceSetCall, data, createPerson);
	}

	function createPerson(faceSetData) {
		console.log(faceSetData);
		formdata.append('face_id', faceId);

		faceApi.requestAsync(createPersonCall, data, createPerson);
		
		
		// Create faceset
		// Create faces with faceset-id
		// Create person with face-ids
	}

	function createFace() {
		console.log('creating face.');
		faceApi.requestAsync(createFaceCall, formdata, createFaceSet);
	}


})();
