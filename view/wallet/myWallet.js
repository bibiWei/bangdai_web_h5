(function($) {
	$.init();
})(mui);
myWallet = {
	// 事件注册
	event: function() {
		$("#payDetail").on("tap",myWallet.service.showFlow);
		$("#withDrawBtn").on("tap",myWallet.service.showWithDrawList);
	},

	// 表单验证
	validate: function() {
		return true;
	},

	service: {
		
		showFlow:function(){
			window.location.href = "flowing.html";	
		},
		getWalletInfo: function() {
			var data ={};
			apiHelper.get(CONSTANT.baseUrl + "/api/wallet/currentBalance", data, function(flag, data) {
				if(data.status == AJAX_SECCUSS) {
					$("#currentBalance").text(data.result.currentBalance);
				}
			});
		},
		showWithDrawList:function(){
			window.location.href = "card.html";
		}
	},

	dao: {},
	init: function() {
		myWallet.event();
		myWallet.service.getWalletInfo();
	},
}
myWallet.init();