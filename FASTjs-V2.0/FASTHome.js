
$(function () {

    bind_control_method();

    refresh();
    FAST.AutoRefrashEvent(refresh, 5);
})

function refresh() {
    getState();
    getState2();
}

function getState() {
    Ext.Ajax.request({
        url: '../../Concrete/DataDisplay/GetDataMainForHomePage/UserId0000/SessionId0000/?_dc=' + (new Date().getTime()) + '&parameters={}',
        method: 'get',
        success: function (response, options) {
            var d = JSON.parse(response.responseText);

            showState(d);
        },
        failure: function (response, options) {
            FAST.OnResponseError(response);
        }
    });
}

function showState(datas) {
    if (!datas) {
        return;
    }

    if (typeof datas.ControlNum == 'number') {
        $('#control-num').html(datas.ControlNum);
    }

    for (var i = 0; i < 8; i++) {
    	var wifi = datas.wifis[i];
    	var state1 = datas.state1[i];
    	var state2 = datas.state2[i];
    	var author = datas.authors[i];
    	var control = datas.controls[i];

    	var el = $('#b' + (i + 1));
    	if (wifi == 'gray' || wifi == 'red') {
    		$('.mode.icon', el).removeClass().addClass('icon').addClass('mode').addClass(state1 + '-gray');
    		$('.state.icon', el).removeClass().addClass('icon').addClass('state').addClass(state2 + '-gray');
    		$('.author', el).removeClass().addClass('icon').addClass('author').addClass('gray');
    	}
    	else {
    		$('.mode.icon', el).removeClass().addClass('icon').addClass('mode').addClass(state1);
    		$('.state.icon', el).removeClass().addClass('icon').addClass('state').addClass(state2);
    		$('.author', el).removeClass().addClass('icon').addClass('author').addClass(author);
    	}
    	//$('.mode.icon', el).removeClass().addClass('icon').addClass('mode').addClass(state1);
    	//$('.state.icon', el).removeClass().addClass('icon').addClass('state').addClass(state2);
    	$('.mode.ball', el).removeClass().addClass('ball').addClass('mode').addClass(state1);
    	$('.state.ball', el).removeClass().addClass('ball').addClass('state').addClass(state2);
    	$('.wifi', el).removeClass().addClass('icon').addClass('wifi').addClass(wifi);
    	//$('.author', el).removeClass().addClass('icon').addClass('author').addClass(author);
    	$('.control', el).removeClass().addClass('control').addClass(control).attr('control_id', i);
    }
}

function getState2() {
    Ext.Ajax.request({
    	url: '../../Concrete/DataDisplay/GetDataMirrorForHomePage/UserId0000/SessionId0000/?_dc=' + (new Date().getTime()) + '&parameters={}',
        method: 'get',
        success: function (response, options) {
            var d = JSON.parse(response.responseText);

            showState2(d);
        },
        failure: function (response, options) {
            FAST.OnResponseError(response);
        }
    });
}

function showState2(datas) {
    if (!datas)
        return;

    $('#taskState').html(getStateHtml(datas.CurrentTaskState));
    $('#taskTimeTotal').html(datas.TaskTimeTotal)
    $('#taskSequenceTotal').html(datas.TaskSequenceTotal)

    if (datas.TaskTimeTotal > 0 && datas.TaskTimeComplete > 0) {
    	var width = $("#taskTime2").width() * datas.TaskTimeComplete / datas.TaskTimeTotal;

    	if (width > $("#taskTime2").width()) {
    		width = $("#taskTime2").width();
    	}

        var el = $('#taskTime1');
        if (el.css('display') == 'none') {
            el.show();
        }

        if (el.width() != width) {
            el.width(width);
        }

        $('#taskTimeComplete').html(datas.TaskTimeComplete)
    } else {
        $('#taskTime1').hide();
    }

    if (datas.TaskSequenceTotal > 0 && datas.TaskSequenceComplete > 0) {
        var width = $("#taskSequence2").width() * datas.TaskSequenceComplete / datas.TaskSequenceTotal;

        var el = $('#taskSequence1');
        if (el.css('display') == 'none') {
            el.show();
        }

        if (el.width() != width) {
            el.width(width);
        }

        $('#taskSequenceComplete').html(datas.TaskSequenceComplete)
    } else {
        $('#taskSequence1').hide();
    }
}

function getStateHtml(value) {
    switch (value) {
        case '开始':
            return "<span class='start'>" + value + "</span>";
        case '准备':
            return "<span class='prepare'>" + value + "</span>";
        case '观测':
            return "<span class='observe'>" + value + "</span>";
        case '终止':
            return "<span class='stop'>" + value + "</span>";
        case '结束':
            return "<span class='finish'>" + value + "</span>";
        default:
            return "<span class='notstart'>" + value + "</span>";
    }
}

function bind_control_method() {
    $('.control').click(function () {
        var el = $(this);
        var control_id = el.attr('control_id');
        var api;

        if (el.hasClass('hold')) {
        	api = 'GetControl';
        	el.removeClass('hold').addClass('holding');
        } else if (el.hasClass('release')) {
        	api = 'ReleaseControl';
        	el.removeClass('release').addClass('releasing');
        } else {
            return;
        }
        var names = ['10701', '10401', '10501', '10101', '10201', '10301', '10601']

        var name = names[parseInt(control_id) - 1];

        Ext.Ajax.request({
            url: '../../Concrete/DataDisplay/' + api + '?parameters=' + name,
            method: 'get',
            success: function (response, options) {
                refresh();
            },
            failure: function (response, options) {
                //FAST.OnResponseError(response);
            }
        });
    })
}