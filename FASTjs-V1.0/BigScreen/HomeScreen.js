$(function () {
	getState();

	setInterval(getState, 5000);
});

function getState() {	
	Ext.Ajax.request({
		url: '../../Concrete/DataDisplay/GetDataMainForBigScreen/UserId0000/SessionId0000/?_dc=' + (new Date().getTime()) + '&parameters={}',
		method: 'get',
		success: function (response, options) {
		    var d = JSON.parse(response.responseText);		    

			showState(d);
		},
		failure: function (response, options) {
			OnResponseError(response);
		}
	});
}

function showState(datas) {
	if (!datas || !datas.colors || datas.colors.length != 8 || !datas.state1 || datas.state1.length != 8 || !datas.state2 || datas.state2.length != 8) {
		//$('.box').addClass('unknown');
		return;
	}    

	for (var i = 0; i < 8; i++) {
		var color = datas.colors[i];
		var state1 = datas.state1[i];
		var state2 = datas.state2[i];

		var el = $('#b' + (i + 1));

		switch (color) {
			case 'blue':
				$(el).removeClass().addClass('box').addClass('blue');
				break;
		    case 'gray':
		        $(el).removeClass().addClass('box');
				break;
		    default:
		        $(el).removeClass().addClass('box').addClass('unknown');				
				break;
		}

		$('.state1', el).removeClass().addClass('state').addClass('state1').addClass(state1);
		$('.state2', el).removeClass().addClass('state').addClass('state2').addClass(state2);
	}
}

