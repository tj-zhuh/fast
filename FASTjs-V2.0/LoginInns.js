$(function () {
	function rememberUser() {
		if ($('.set_box').find('.check').hasClass('active')) {
			$('.set_box').find('.check').removeClass('active');
		}
		else {
			$('.set_box').find('.check').addClass('active');
		}
	};
	function CheckUserAuthor() {
		$.ajax({
			type: 'POST',
			url: "Master/MASTER_USER/CheckLogin/UserId0000/SessionId0000/?parameters={}&_dc=" + (new Date().getTime()),
			data: { USER_CODE: $('#username').val(), USER_PASSWORD: $('#pwd').val() },
			success: function (data) {
				$('#errorMsg').hide();
				$('#loading-center-absolute').hide();
				if (data == null || data.ArrayModels == null || data.ArrayModels[0] == null) {
					$('#errorMsg').show();
				} else {
					var loginUser = data.ArrayModels[0];
					if (loginUser.EMAIL_ADDRESS != null) {
						window.location.href = 'FASTHomeInns/' + loginUser.EMAIL_ADDRESS;
					}
				}
			},
			error: function (data) {
				$('#loading-center-absolute').hide();
				$('#errorMsg').show();
			}
		});
	};

	$('.set_box').on('click', '.check', function () {
		rememberUser();
	}).on('click', '.remember', function () {
		rememberUser();
	});

	$('#submit').on('click', function () {
		$('#loading-center-absolute').show();
		CheckUserAuthor();
	});

	$('#reset').on('click', function () {
		$('#username').val('');
		$('#pwd').val('');
		$('#errorMsg').hide();
	});

	$('#username').keydown(function (e) {
		if (e.keyCode == 13) {
			$('#loading-center-absolute').show();
			CheckUserAuthor();
		}
	})

	$('#pwd').keydown(function (e) {
		if (e.keyCode == 13) {
			$('#loading-center-absolute').show();
			CheckUserAuthor();
		}
	})
})