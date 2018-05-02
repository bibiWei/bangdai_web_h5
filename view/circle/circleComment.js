var msgId = URL.getRequest().id;

(function($) {
	$.init();
})(mui);

circleComment = {
	// 事件注册
	event: function() {
		$("#pushComment").on("click", circleComment.service.doPush);
	},

	// 表单验证
	validate: function() {
		if($("#pushComment").text() === "") {
			mui.toast("请您输入评论内容");
			return false;
		} else {
			if($("#pushComment").text().length > 100) {
				mui.toast("您输入的评论内容过长");
				return false;
			}
		}

		return true;
	},

	service: {
		doPush: function() {
			if(!circleComment.validate()) {
				return false;
			}
			var data = {
				msgId: msgId,
				comment: $("#comment").val()
			}
			apiHelper.post(CONSTANT.baseUrl + "/api/message/comment", JSON.stringify(data), function(flag, data) {
				if(data.status == AJAX_SECCUSS) {
					mui.alert('评论成功', function() {
						window.location.href = "circleInfo.html?id=" + msgId;
					});
				} else {
					mui.toast(data.msg);
				}
			}, null, AJAX_BODY);
		}
	},
	dao: {},
	init: function() {
		circleComment.event();
	},
}
circleComment.init();