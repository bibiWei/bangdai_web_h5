

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
		$("#takingBtn").on("tap",myInfo.service.doTakingList);
		$("#buyingBtn").on("tap",myInfo.service.doBuyingList);
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
		},
		doTakingList:function(){
			window.location.href = "../../view/me/myTakingList.html";
		},
		doBuyingList:function(){
			window.location.href = "../../view/me/myBuyingList.html"
		}
	},
	dao: {},
	init: function() {
		myInfo.event();

	},
}
myInfo.init();