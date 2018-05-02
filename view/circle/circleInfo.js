var circleId = URL.getRequest().id;

(function($) {
	$.init();
})(mui);

circleInfo = {
	// 事件注册
	event: function() {
		$("#commentBtn").on("click", circleInfo.service.doComment);
	},

	// 表单验证
	validate: function() {
		return true;
	},

	service: {

		getCircleInfo: function(id) {
			var data = {
				msgId: id
			}
			apiHelper.get(CONSTANT.baseUrl + "/api/message/detail/", data, function(flag, data) {
				if(data.status == AJAX_SECCUSS) {
					$("#issuer").text(data.result.issuer);
					$("#issueDate").text(data.result.issueDate);
					$("#msg").text(data.result.msg);
					if(null != data.result.picUrlList) {
						$("#pic").empty()
						var html = "";
						for(var pic of data.result.picUrlList) {
							html += '<div class="mui-col-xs-4" style="margin-top: 1em;text-align: center; margin-bottom: 1em;">';
							html += '<img src="' + pic + '" style="width: 100px;" height="100px" />'
							html += '</div>';
						}
						$("#pic").append(html);
						var commentHtml = "";
						for(var comment of data.result.commentList) {
							commentHtml += '<div class="list mui-row">';
							commentHtml += '<div class="mui-col-xs-2">';
							commentHtml += '<img src="../../images/circle/pic.jpeg" class="title-img" />';
							commentHtml += '</div>';
							commentHtml += '<div class="mui-col-xs-9 ">';
							commentHtml += '<p style="margin-top: 0.8em;">' + comment.commentUser + '<span class="mui-pull-right">' + comment.commentDate + '</span>	</p>'
							commentHtml += '<p>' + comment.comment + '</p>';
							commentHtml += '</div>'
							commentHtml += '</div>'
						}
						$("#commontMsg").append(commentHtml);
					}
				}
			});
		},
		doComment: function() {
			window.location.href = "circleComment.html?id=" + circleId;
		}
	},
	dao: {},
	init: function() {
		circleInfo.event();
		circleInfo.service.getCircleInfo(circleId);
	},
}
circleInfo.init();