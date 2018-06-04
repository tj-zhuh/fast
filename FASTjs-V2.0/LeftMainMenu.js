; (function (window, $) {
	if (!window || !window.document)
		throw new Error("FAST requires a window with a document");

	if (!$)
		throw new Error("FAST requires a $ with a jQuery");

	/// <summary>
	/// 初始化按钮与视图映射.
	/// </summary>
	var menuLinks = (function () {
		return {
			'engineer': './EngineerView',
			'scientist': './ScientistView',
			'observer': './ObserverView',
			'admin': './AdministratorView',
			'lknExit': '../FASTLogin/ReLogin',

			'gcrwgl': '../TaskManage',
			'gcrwzt': '../TaskStatus',
			'gcrwbj': '../TaskEdition',
			'gcrwbj': '../TaskEdition',
			'gcrwcx': '../TaskQuery',
			'gcrwdl': '../TaskQueue',
			'gcrwgr': '../TaskDisturb',
			'gcrwzl': '../TaskDictate',
			'gcrzgl': '../TaskLogging',
			'gcshjk': '../DataMonitor',
			'gcshfs': '../MonitorReflector',
			'gcshky': '../MonitorFeed',
			'gcshjs': '../DataMonitor',
			'zttsgl': '../DebugManage',
			'zttsbj': '../DebugEdition',
			'ztsjgl': '../DataManage',
			'ztwjgl': '../Document',
			'xtqxgl': '../SystemManage',
			'xtqxyh': '../SystemUser',
			'xtqxjs': '../SystemRole',
			'xtqxsq': '../SystemRight',
			'xtqxjg': '../SystemItem',
			'xtqxrz': '../SystemNote',
			'xtcsgl': '../SystemConfig',
			'xtbjgl': '../SystemAlarm'
		};
	})();

	/// <summary>
	/// 初始化按钮与脚本映射.
	/// </summary>
	var menuScripts = (function () {
		return {
			'engineer': '',
			'scientist': '',
			'observer': '',
			'admin': '',

			'gcrwgl': '../Web_GlobalResources/FASTjs-V2.0/TaskManage.js',
			'gcrwzt': '../Web_GlobalResources/FASTjs-V1.0/TaskStatus.js',
			'gcrwbj': '../Web_GlobalResources/FASTjs-V2.0/TaskEdition.js',
			'gcrwcx': '../Web_GlobalResources/FASTjs-V1.0/TaskQuery.js',
			'gcrwdl': '../Web_GlobalResources/FASTjs-V2.0/TaskQueue.js',
			'gcrwgr': '../Web_GlobalResources/FASTjs-V2.0/TaskDisturb.js',
			'gcrwzl': '../Web_GlobalResources/FASTjs-V2.0/TaskDictate.js',
			'gcrzgl': '../Web_GlobalResources/FASTjs-V2.0/TaskLogging.js',
			'gcshjk': '../Web_GlobalResources/FASTjs-V2.0/DataMonitor.js',
			'gcshfs': '../Web_GlobalResources/FASTjs-V2.0/MonitorReflector.js',
			'gcshky': '../Web_GlobalResources/FASTjs-V2.0/MonitorFeed.js',
			'gcshjs': '../Web_GlobalResources/FASTjs-V2.0/DataMonitor.js',
			'zttsgl': '../Web_GlobalResources/FASTjs-V2.0/DebugManage.js',
			'zttsbj': '../Web_GlobalResources/FASTjs-V2.0/DebugEdition.js',
			'ztsjgl': '../Web_GlobalResources/FASTjs-V2.0/DataManage.js',
			'ztwjgl': '../Web_GlobalResources/FASTjs-V2.0/Document.js',
			'xtqxgl': '../Web_GlobalResources/FASTjs-V2.0/SystemManage.js',
			'xtqxyh': '../Web_GlobalResources/FASTjs-V2.0/SystemUser.js',
			'xtqxjs': '../Web_GlobalResources/FASTjs-V2.0/SystemRole.js',
			'xtqxsq': '../Web_GlobalResources/FASTjs-V1.0/SystemRight.js',
			'xtqxjg': '../Web_GlobalResources/FASTjs-V2.0/SystemItem.js',
			'xtqxrz': '../Web_GlobalResources/FASTjs-V2.0/SystemNote.js',
			'xtcsgl': '../Web_GlobalResources/FASTjs-V2.0/SystemConfig.js',
			'xtbjgl': '../Web_GlobalResources/FASTjs-V2.0/SystemAlarm.js'
		};
	})();

	/// <summary>
	/// 初始化顶部区域导航按钮折叠事件.
	/// </summary>
	function InitMenuToggler() {
		var menuborders = $('a.v-menu-one-arrow');
		menuborders.each(function (i) {
			$(this).on('click', function () {
				var $this = $(this);
				var $menuTwo = $this.parent().next('ul');

				if ($this.hasClass('v-menu-arrow-down')) {
					///取消选中
					$this.removeClass('v-menu-arrow-down');
					$this.addClass('v-menu-arrow-right');

					$menuTwo.removeClass('x-show');
					$menuTwo.addClass('x-hide');
				} else {
					$this.parent().siblings('li').find('a.v-menu-one-arrow').each(function (j) {
						var $this = $(this);
						var $menuTwo = $this.parent().next('ul');

						///取消选中
						$this.removeClass('v-menu-arrow-down');
						$this.addClass('v-menu-arrow-right');

						$menuTwo.removeClass('x-show');
						$menuTwo.addClass('x-hide');
					});

					///激活选中
					$this.removeClass('v-menu-arrow-right');
					$this.addClass('v-menu-arrow-down');

					$menuTwo.removeClass('x-hide');
					$menuTwo.addClass('x-show');
				}

				var $menu = $('div.v-main-menu-container');
				var height = 0;
				if ($menu.height() > 730) {
					height = ($menu.height() + 250) > FAST.visibleHeight ? $menu.height() + 250 - 109 : FAST.visibleHeight - 109;
				} else {
					height = FAST.visibleHeight > 950 ? FAST.visibleHeight - 109 : 950 - 109;
				}
				//console.log(height);
				$('div.main-center-container').height(height);

				if (typeof ReSetSubViewSize == 'function') {
					ReSetSubViewSize(false);
				}
			});
		});

		$('a.v-menu-nonclick-title').on('click', function () {
			var $this = $(this).next('a.v-menu-one-arrow');
			var $menuTwo = $this.parent().next('ul');

			if ($this.hasClass('v-menu-arrow-down')) {
				///取消选中
				$this.removeClass('v-menu-arrow-down');
				$this.addClass('v-menu-arrow-right');

				$menuTwo.removeClass('x-show');
				$menuTwo.addClass('x-hide');
			} else {
				$this.parent().siblings('li').find('a.v-menu-one-arrow').each(function (j) {
					var $this = $(this);
					var $menuTwo = $this.parent().next('ul');

					///取消选中
					$this.removeClass('v-menu-arrow-down');
					$this.addClass('v-menu-arrow-right');

					$menuTwo.removeClass('x-show');
					$menuTwo.addClass('x-hide');
				});

				///激活选中
				$this.removeClass('v-menu-arrow-right');
				$this.addClass('v-menu-arrow-down');

				$menuTwo.removeClass('x-hide');
				$menuTwo.addClass('x-show');
			}

			var $menu = $('div.v-main-menu-container');
			var height = 0;
			if ($menu.height() > 730) {
				height = ($menu.height() + 250) > FAST.visibleHeight ? $menu.height() + 250 - 109 : FAST.visibleHeight - 109;
			} else {
				height = FAST.visibleHeight > 950 ? FAST.visibleHeight - 109 : 950 - 109;
			}
			console.log(height);
			$('div.main-center-container').height(height);

			if (typeof ReSetSubViewSize == 'function') {
				ReSetSubViewSize(false);
			}
		});
	}

	/// <summary>
	/// 系统初始化.
	/// </summary>
	function ResetSystem() {
		$.ajax({
			type: 'GET',
			url: '../../Concrete/DataDisplay/ResetSystem/UserId0000/SessionId0000/parameters?_dc=' + (new Date().getTime()),
			dataType: 'json',
			success: function (data, textStatus, jqXHR) {
				FAST.OnInfoEvent("系统初始化完成！<br/><br/>");
			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {
				if (XMLHttpRequest.status == 200) {
					FAST.OnInfoEvent("系统初始化完成！<br/><br/>");
				} else {
					FAST.OnErrorEvent("系统初始化失败！<br/>" + errorThrown);
				}
			}
		})
	}

	/// <summary>
	/// 菜单点击事件.
	/// </summary>
	function OnMenuClick(linkId) {
		if (linkId == "zkxtzy") {
			window.top.location.reload();
			return;
		}

		if (!menuScripts[linkId]) {
			window.top.location = menuLinks[linkId];
			return;
		}

		//if (linkId == "zttsgl") {
			///获取系统状态
			//$.ajax({
			//	type: 'GET',
			//	url: '../../Concrete/DataDisplay/GetDataMain',
			//	dataType: 'json',
			//	success: function (response, options) {
			//		var result = response.ArrayModels;
			//		if (result[0].ObservationMode != 1 && result[0].ObservationMode != 2) {
			//			Ext.MessageBox.alert({
			//				title: '提 示',
			//				msg: '非待机状态下无法进入整体调试！',
			//				width: 360,
			//				buttons: Ext.MessageBox.OK,
			//				buttonText: { ok: '确&nbsp;&nbsp;&nbsp;定' },
			//				icon: Ext.MessageBox.WARNING
			//			});
						//$.post(menuLinks[linkId], { username: 'UserName', password: 'Password' },
						//	function (data) {
						//		if (!data) {
						//			/*返回为空或异常*/
						//			throw new Error("The response is null or error.");
						//		} else {
						//			FAST.ClearPageRefrash();

						//			var $menu = $('div.v-main-menu-container');
						//			var height = 0;
						//			if ($menu.height() > 730) {
						//				height = ($menu.height() + 250) > FAST.visibleHeight ? $menu.height() + 250 - 109 : FAST.visibleHeight - 109;
						//			} else {
						//				height = FAST.visibleHeight > 950 ? FAST.visibleHeight - 109 : 950 - 109;
						//			}

						//			$('div.main-center-container').empty().height(height);
						//			$('div.main-center-container').append(data);

						//			jQuery.getScript(menuScripts[linkId], function () {
						//				if (typeof LoadGridData == 'function') {
						//					LoadGridData();
						//				}
						//			});
						//		}
						//});
					//}
					//else if (result[0].ObservationMode == 2) {
					//	$.post(menuLinks[linkId], { username: 'UserName', password: 'Password' },
					//	function (data) {
					//		if (!data) {
					//			/*返回为空或异常*/
					//			throw new Error("The response is null or error.");
					//		} else {
					//			FAST.ClearPageRefrash();

					//			var $menu = $('div.v-main-menu-container');
					//			var height = 0;
					//			if ($menu.height() > 730) {
					//				height = ($menu.height() + 250) > FAST.visibleHeight ? $menu.height() + 250 - 109 : FAST.visibleHeight - 109;
					//			} else {
					//				height = FAST.visibleHeight > 950 ? FAST.visibleHeight - 109 : 950 - 109;
					//			}

					//			$('div.main-center-container').empty().height(height);
					//			$('div.main-center-container').append(data);

					//			jQuery.getScript(menuScripts[linkId], function () {
					//				if (typeof LoadGridData == 'function') {
					//					LoadGridData();
					//				}
					//			});
					//		}
					//	});
					//}
					//else {
		//				Ext.MessageBox.alert({
		//					title: '提 示',
		//					msg: '确定要进入整体调试状态？',
		//					width: 360,
		//					buttons: Ext.MessageBox.OKCANCLE,
		//					buttonText: { ok: '确&nbsp;&nbsp;&nbsp;定', cancel: '取&nbsp;&nbsp;&nbsp;消' },
		//					icon: Ext.MessageBox.WARNING,
		//					fn: function (optional) {
		//						if (optional == "cancel") {
		//							$.post(menuLinks[linkId], { username: 'UserName', password: 'Password' },
		//								function (data) {
		//									if (!data) {
		//										/*返回为空或异常*/
		//										throw new Error("The response is null or error.");
		//									} else {
		//										FAST.ClearPageRefrash();

		//										var $menu = $('div.v-main-menu-container');
		//										var height = 0;
		//										if ($menu.height() > 730) {
		//											height = ($menu.height() + 250) > FAST.visibleHeight ? $menu.height() + 250 - 109 : FAST.visibleHeight - 109;
		//										} else {
		//											height = FAST.visibleHeight > 950 ? FAST.visibleHeight - 109 : 950 - 109;
		//										}

		//										$('div.main-center-container').empty().height(height);
		//										$('div.main-center-container').append(data);

		//										jQuery.getScript(menuScripts[linkId], function () {
		//											if (typeof LoadGridData == 'function') {
		//												LoadGridData();
		//											}
		//										});
		//									}
		//								});
		//						}
		//						else {
		//							$.ajax({
		//								type: 'GET',
		//								url: '../../Concrete/DataDisplay/DebugConfirm/UserId0000/SessionId0000/?_dc=' + (new Date().getTime()) + '&parameters={}',
		//								dataType: 'text',
		//								success: function (fp, o) {
		//									$.post(menuLinks[linkId], { username: 'UserName', password: 'Password' },
		//										function (data) {
		//											if (!data) {
		//												/*返回为空或异常*/
		//												throw new Error("The response is null or error.");
		//											} else {
		//												FAST.ClearPageRefrash();

		//												var $menu = $('div.v-main-menu-container');
		//												var height = 0;
		//												if ($menu.height() > 730) {
		//													height = ($menu.height() + 250) > FAST.visibleHeight ? $menu.height() + 250 - 109 : FAST.visibleHeight - 109;
		//												} else {
		//													height = FAST.visibleHeight > 950 ? FAST.visibleHeight - 109 : 950 - 109;
		//												}

		//												$('div.main-center-container').empty().height(height);
		//												$('div.main-center-container').append(data);

		//												jQuery.getScript(menuScripts[linkId], function () {
		//													if (typeof LoadGridData == 'function') {
		//														LoadGridData();
		//													}
		//												});
		//											}
		//										});
		//								},
		//								error: function (fp, o) {
		//									FAST.OnInfoEvent('出错!无法进入整体调试<br/><br/>');
		//								}
		//							})
		//						}
		//					}
		//				});
		//			}
		//		},
		//		error: function (response, options) {
		//			FAST.OnInfoEvent('获取系统状态出错<br/><br/>');
		//		}
		//	})
		//}
		//else {
			$.post(menuLinks[linkId], { username: 'UserName', password: 'Password' },
				function (data) {
					if (!data) {
						/*返回为空或异常*/
						throw new Error("The response is null or error.");
					}
					else {
						FAST.ClearPageRefrash();

						var $menu = $('div.v-main-menu-container');
						var height = 0;
						if ($menu.height() > 730) {
							height = ($menu.height() + 250) > FAST.visibleHeight ? $menu.height() + 250 - 109 : FAST.visibleHeight - 109;
						} else {
							height = FAST.visibleHeight > 950 ? FAST.visibleHeight - 109 : 950 - 109;
						}

						$('div.main-center-container').empty().height(height);
						$('div.main-center-container').append(data);

						jQuery.getScript(menuScripts[linkId], function () {
							if (typeof LoadGridData == 'function') {
								LoadGridData();
							}
						});
					}
				});
		//}
	}

	/// <summary>
	/// 初始化顶部区域导航按钮、 角色切换、 菜单按钮点击事件.
	/// </summary>
	function InitMenuClickEvent() {
		/// 初始化顶部区域导航按钮点击事件.
		$('a.h-nav-item-actor').each(function (i) {
			var linkId = $(this).parents('li').attr('id');

			$(this).on('click', function (item) {
				OnMenuClick(linkId);
			});
		});

		/// 初始化顶部区域角色切换点击事件.
		$('a.v-role-item-show').each(function (i) {
			var linkId = $(this).parents('li').attr('id');

			$(this).on('click', function (item) {
				OnMenuClick(linkId);
			});
		});

		/// 系统初始化.
		$('a.menu-button-init').parent().on('click', function (item) {
			ResetSystem();
		});

		/// 初始化菜单按钮点击事件.
		$('a.v-menu-one-title').each(function (i) {
			var linkId = $(this).parents('li').attr('id');

			$(this).on('click', function (item) {
				OnMenuClick(linkId);

				var $image = $(this).prev('i');
				if ($(this).hasClass('v-menu-font-active')) {
					$(this).removeClass('v-menu-font-active');
					$image.attr('class', $image.attr('class').replace('active', 'default'));
				} else {
					$('a.v-menu-one-title').each(function (i) {
						$(this).removeClass('v-menu-font-active');
						var $image = $(this).prev('i');
						$image.attr('class', $image.attr('class').replace('active', 'default'));
					});
					$('a.v-menu-two-title').each(function (i) {
						$(this).removeClass('v-menu-font-active');
					});

					$(this).addClass('v-menu-font-active');
					$image.attr('class', $image.attr('class').replace('default', 'active'));
				}
			});
		});

		$('a.v-menu-two-title').each(function (i) {
			var linkId = $(this).parents('li').attr('id');

			$(this).on('click', function (item) {
				OnMenuClick(linkId);

				if ($(this).hasClass('v-menu-font-active')) {
					$(this).removeClass('v-menu-font-active');
				} else {
					$('a.v-menu-one-title').each(function (i) {
						$(this).removeClass('v-menu-font-active');
						var $image = $(this).prev('i');
						$image.attr('class', $image.attr('class').replace('active', 'default'));
					});
					$('a.v-menu-two-title').each(function (i) {
						$(this).removeClass('v-menu-font-active');
					});

					$(this).addClass('v-menu-font-active');
				}
			});
		});
	}

	/// <summary>
	/// 初始化，事件绑定.
	/// </summary>
	$(function () {
		///初始化左侧菜单折叠事件
		InitMenuToggler();

		///初始化左侧菜单点击事件
		InitMenuClickEvent();
	});
})(window, jQuery);