/*
 * 收到消息
   情况一：窗口关闭着
   1. 把消息写在panel里，并更新lastDisplayingChatId
   2. 更新lastReceivedChatId
   3. 添加红点

   情况二：窗口打开着
   1. 把消息写在panel里，并更新lastDisplayingChatId
   2. 更新lastReceivedChatId
   3. 更新lastReadChatId

   情况三：打开窗口
   1. 去掉红点
   2. 更新lastReadChatId
*/

var chat = {
	// 当前登录用户的Id
	currentUserId: '',

	// 已经收到的最新一条消息的Id
	lastReceivedChatId: '',

	// 已经展示的最新一条消息的Id
	lastDisplayingChatId: '',

	// 用户已读的最新一条消息的Id
	lastReadChatId: '',

	// 如果两条聊天记录时间差在groupExpireSeconds秒以上，则添加新的时间
	groupExpireSeconds: 300,

	// 已经在显示的最新一条记录的时间
	lastDisplayingMessageTimeTicks: null,

	// 聊天框处于打开状态
	panelShowing: false,

	sameStateCount: 0,

	averageTime: 2
};

$(function () {
	var chatBodyHeight = $('.chat-body').height();
	var onlineUsersHeight = $('.online-users').height();

	$('.chat-icon').mouseover(function () {
		$(this).animate({ right: "5px", bottom: "5px" }, "normal");
	})

	$('.chat-icon').mouseout(function () {
		$(this).animate({ right: "0px", bottom: "-40px" }, "normal");
	})
	// 点击聊天图标
	$('.chat-icon').click(show_chat_panel);

	// 当聊天框打开时，点击空白区域关闭聊天框
	$('.overlay').click(hide_chat_panel);

	// 点击X
	$('.chat-close').click(hide_chat_panel);

	// 展开/隐藏用户列表
	$('.toggle-icon').click(function () {
		if ($(this).hasClass('go-down')) {
			$('.online-users').slideDown('normal', function () {
				$('.toggle-icon').removeClass('go-down').addClass('go-up');
				$('.chat-body').height(chatBodyHeight - onlineUsersHeight)
			});
		}
		else {
			$('.online-users').slideUp('normal', function () {
				$('.toggle-icon').removeClass('go-up').addClass('go-down');
				$('.chat-body').height(chatBodyHeight + 0)
			});
		}
	})

	// 发送消息
	$('.send-button').click(function () {
		send();
	})

	// 回车发消息
	$('#chat-input').keyup(function () {
		if (event.keyCode == 13) {
			send();
		}
	});

	// 定时获取信息
	get_chat();
	//FAST.AutoRefrashEvent(get_chat, 5, 'global');
})

function send() {
	var message = $('#chat-input').val();
	if (message.replace(/(^\s*)|(\s*$)/g, "") == '') {
		return;
	}
	$('#chat-input').val('');
	$('#chat-input').focus();
	send_chat(message);
}

function show_chat_panel() {
	$('.overlay').fadeTo(200, 0.5);
	$('.chat-panel').fadeTo(200, 1);
	$('.chat-close').fadeTo(200, 1);

	chat.panelShowing = true;
	chat.lastReadChatId = chat.lastReceivedChatId;
	hide_new_message_tip();

	var el = document.getElementById('chat-body');
	el.scrollTop = el.scrollHeight;
}

function hide_chat_panel() {
	$('.overlay').fadeOut(200);
	$('.chat-panel').hide();
	$('.chat-close').hide();

	chat.panelShowing = false;
}

function show_new_message_tip() {
	$('.chat-icon').addClass('unread');
}

function hide_new_message_tip() {
	$('.chat-icon').removeClass('unread');
}

function send_chat(msg) {
	var pm = { message: msg };
	var parameters = [chat.lastReceivedChatId, chat.lastReadChatId].toString();

	Ext.Ajax.request({
		url: '../../Concrete/Common/SendChat?UserId0000/SessionId0000/?_dc=' + (new Date().getTime()) + '&parameters=' + parameters,
		method: 'post',
		params: pm,
		success: function (response, options) {
			if (!response.responseText)
				return;

			var data = JSON.parse(response.responseText);
			on_receive_chat_data(data);
			chat.averageTime = 2;
		},
		failure: function (a, b, c) {
			console.log(c)
		}
	});
}

function get_chat() {
	var parameters = [chat.lastReceivedChatId, chat.lastReadChatId].toString();

	Ext.Ajax.request({
		url: '../../Concrete/Common/GetChat?UserId0000/SessionId0000/?_dc=' + (new Date().getTime()) + '&parameters=' + parameters,
		method: 'get',
		success: function (response, options) {
			if (!response.responseText)
				return;

			var data = JSON.parse(response.responseText);

			on_receive_chat_data(data);
			if (data && data.unreadMessages && data.unreadMessages.length > 0) {
				chat.averageTime = 2;
			} else {
				if (chat.sameStateCount > 8) {
					chat.averageTime += 2;
					if (chat.averageTime > 16) {
						chat.averageTime = 16;
					}
					chat.sameStateCount = 0;
				}
				chat.sameStateCount++;
			}
			console.log(chat.averageTime);
			setTimeout(get_chat, chat.averageTime * 1000);
		},
		failure: function (a, b, c) {
			console.log(c)
			setTimeout(get_chat, chat.averageTime * 1000);
		}
	});
}

function on_receive_chat_data(data) {
	chat.currentUserId = data.userId;
	show_online_users(data.onlineUsers);

	if (chat.lastReceivedChatId && data.lastChatId != chat.lastReceivedChatId) {
		return;
	}

	if (data.unreadMessages && data.unreadMessages.length > 0) {
		chat.lastReceivedChatId = data.unreadMessages[data.unreadMessages.length - 1].chatId;

		append_messages(data.unreadMessages);

		if (chat.panelShowing) {
			chat.lastReadChatId = chat.lastReceivedChatId;
		} else {
			show_new_message_tip();
		}
	}
}

function show_online_users(users) {
	var onlineUsersContainer = $('.online-users');
	var showingUsers = $('.chat-user', onlineUsersContainer);
	showingUsers.remove();

	for (var test = 0 ; test < 1; test++) {
		for (var i in users) {
			var user = users[i];
			var userId = user.userId;
			var userName = user.userName;
			var userShortName = user.userShortName;

			var user_div = $("<div class='chat-user'>");
			var user_photo = $("<div class='photo'>");
			var user_label = $("<div class='user-name'>");
			user_div.append(user_photo);
			user_div.append(user_label);
			user_photo.html(userShortName);
			user_label.html(userName);
			onlineUsersContainer.append(user_div);
		}
	}
}

function append_messages(messages) {
	for (var i in messages) {
		var message = messages[i];
		var userId = message.userId;
		var userName = message.userName;
		var userShortName = message.userShortName;
		var content = message.message;
		var messageTime = message.chatTime;
		var messageTimeTicks = message.chatTimeTick;
		var chatId = message.chatId;

		if (chatId < chat.lastDisplayingChatId)
			continue;

		if (!chat.lastDisplayingMessageTimeTicks || messageTimeTicks - chat.lastDisplayingMessageTimeTicks > chat.groupExpireSeconds * 10000000) {
			append_time(messageTime);
		}

		appen_message(userName, userShortName, content, userId == chat.currentUserId);

		chat.lastDisplayingMessageTimeTicks = messageTimeTicks;
		chat.lastDisplayingChatId = chatId;

		var el = document.getElementById('chat-body');
		el.scrollTop = el.scrollHeight;
	}
}

function append_time(time) {
	var span = $("<span>");
	var p = $("<p class='chat-time'>")
	p.append(span);
	span.html(time);
	$('.chat-body').append(p);
}

function appen_message(userName, userShortName, text, isSelf) {
	var div = $("<div class='chat-item'>");

	if (isSelf) {
		div.addClass('self');
	}
	else {
		div.addClass('other');
	}

	var speaker = $("<div class='speaker'>");
	var user_photo = $("<div class='photo'>");
	var user_label = $("<div class='user-name'>");
	var divChatText = $("<div class='text'>");
	speaker.append(user_photo);
	speaker.append(user_label);
	div.append(speaker);
	div.append(divChatText)
	user_photo.html(userShortName);
	user_label.html(userName);
	divChatText.html(text);
	$('.chat-body').append(div);
}