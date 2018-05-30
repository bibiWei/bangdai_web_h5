(function($) {
	$.init();
})(mui);
card = {
	// 事件注册
	event: function() {
		$("#addBtn").on("tap", card.service.doAdd);

	},

	// 表单验证
	validate: function() {
		return true;
	},

	service: {
		doAdd: function() {
			window.location.href = "acount.html";
		},
		doCheck: function() {
			mui.alert('您确定要是用此账户提现吗', function() {
				var payeeAccount =  $("#payeeAccount").text();
				var payeeRealName =  $("#payeeRealName").text();
				localStorage.setItem("payeeAccount",payeeAccount);
				localStorage.setItem("payeeRealName",payeeRealName);
				window.location.href = "doCash.html"  ;
			});
		}
	},

	dao: {},
	init: function() {
		card.event();

	},
}
card.init();