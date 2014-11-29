(function() {


	function getEmailadres() {
		return localStorage.getItem('emailadres');
	}


	$('.email-input').val(getEmailadres());


})();
