(function() {
	var groupName = 'testgroep';


	$('#add-person-form').on('submit', function() {
		var formdata = new FormData();
		formdata['person_name'] = $('#person-name-field').val();
		formdata['img'] = $('#img-field')[0].files[0];
		createPerson( formdata );
	});


	function createPerson(formData) {

	}


})();
