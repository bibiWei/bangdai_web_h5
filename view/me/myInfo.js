

(function($) {
	$.init();
})(mui);
myInfo = {
	// 事件注册
	event: function() {
		$("#orderListBtn").on("click",myInfo.service.showMyOrder);
		$("#authInfo").on("click",myInfo.service.showAuthInfo);
		$("#myWallet").on("click",myInfo.service.myWallet);
		$("#myCenter").on("click",myInfo.service.myCenter);
	},

	// 表单验证
	validate: function() {
		return true;
	},

	service: {
		myCenter:function(){
			window.location.href = "../../view/me/center.html"
		},
		showMyOrder:function(){
			window.location.href = "../../view/me/myOrderList.html";
		},
		showAuthInfo:function(){
			window.location.href = "../../view/auth/authInfo.html";
		},
		myWallet:function(){
			window.location.href = "../../view/wallet/myWallet.html";
		}
	},
	dao: {},
	init: function() {
		myInfo.event();

	},
}
myInfo.init();