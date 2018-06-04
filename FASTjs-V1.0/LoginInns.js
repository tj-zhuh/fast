$(function () {
	function rememberUser() {
		if ($('.set_box').find('.check').hasClass('active')) {
			$('.set_box').find('.check').removeClass('active');
		}
		else {
			$('.set_box').find('.check').addClass('active');
		}
	};

	$('.set_box').on('click', '.check', function () {
		rememberUser();
	}).on('click', '.remember', function () {
		rememberUser();
	});

	$('#submit').on('click', function () {
		$.post("Master/MASTER_USER/CheckLogin/UserId0000/SessionId0000/?parameters={}&_dc=" + (new Date().getTime()), { USER_CODE: $('#username').val(), USER_PASSWORD: $('#pwd').val() },
			function (data) {
				if (data == null || data.ArrayModels == null || data.ArrayModels[0]==null)
				{
					alert("登录失败！");

				} else {
					var loginUser = data.ArrayModels[0];
					if (loginUser.EMAIL_ADDRESS != null) {
						window.location.href = 'FASTHomeInns/' + loginUser.EMAIL_ADDRESS;
					}
				}
			});
	});

	$('#reset').on('click', function () {
		$('#username').val('');
		$('#pwd').val('');
	});
})