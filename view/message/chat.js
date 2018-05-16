var patientList = [];

mui.init({
	gestureConfig: {
		longtap: true, //默认为false
	}
});

(function($) {
	$.init();
})(mui);

var count = 0;

chat = {
	event: function() {
		$(".textSent").on("tap", chat.service.sendMessage);
		$("#addPrescBtn").on("tap", chat.service.addPresc);
		$("#cancleBtn").on("tap", chat.service.cancle);
	},

	service: {
		getChatInfo: function() {
			var chatInfo = JSON.parse(localStorage.getItem("chatInfo"));
			$("#chatName").text(chatInfo.petname);
			console.log(chatInfo);
		},


		sendMessageImage: function(img, file) {
			var chatInfo = JSON.parse(localStorage.getItem("chatInfo"));
			var toAccount = chatInfo.wxid;
	
			var html = '<div class="npcTalkItem clearFix border-right" > ' +
				'<div class="npcTalkImg fr"> ' +
				'<img src="../../images/chat/qq.png" alt="头像"> ' +
				'</div> ' +
				'<div class="npcTalk fr" > ' +
				'<div class="npcTalkCon" >' +
				'<div><img src="' + img + '" /></div>' + ' </div> </div> </div>';
			$('.npcTalklist').append(html);
	
			window.scrollTo(0,1000);
			var opt = {
				'file': file, //图片对象
				'onProgressCallBack': onProgressCallBack, //上传图片进度条回调函数
				//'abortButton': document.getElementById('upd_abort'), //停止上传图片按钮
				'From_Account': loginInfo.identifier, //发送者帐号
				'To_Account': toAccount, //接收者
				'businessType': 2 //业务类型
			};
			//上传图片
			webim.uploadPic(opt,
				function(resp) {

					sendFile(resp, file.name);
				},
				function(err) {
					alert(err.ErrorInfo);
				}
			);
		},
		sendEndMessage: function() {
			var str = $('#val').val();
			var html = '<div class="npcTalkItem clearFix border-right" > ' +
				'<div class="npcTalkImg fr"> ' +
				'<img src="../../images/chat/qq.png" alt="头像"> ' +
				'</div> ' +
				'<div class="npcTalk fr" > ' +
				'<div class="npcTalkCon gradient-bg" >' +
				"已经为您下了处方,请您付款" + ' </div> </div> </div>';
			$('.npcTalklist').append(html);
			$('#val').val('');
			chat.service.sendC2CMsg("已经为您下了处方,请您付款" );
		},

		sendMessage: function() {
			var str = $('#val').val();
			var html = '<div class="npcTalkItem clearFix border-right" > ' +
				'<div class="npcTalkImg fr"> ' +
				'<img src="../../images/chat/qq.png" alt="头像"> ' +
				'</div> ' +
				'<div class="npcTalk fr" > ' +
				'<div class="npcTalkCon gradient-bg" >' +
				str + ' </div> </div> </div>';
			$('.npcTalklist').append(html);
			$('#val').val('');
			chat.service.sendC2CMsg(str);
		},
		sendC2CMsg: function(msg) {
			window.scrollTo(0,1000);
			var chatInfo = JSON.parse(localStorage.getItem("chatInfo"));
			var toAccount = chatInfo.wxid;
			var msgtosend = msg;
			var friendHeadUrl = chatInfo.headurl;

			var msgLen = webim.Tool.getStrBytes(msgtosend);
			var maxLen, errInfo;
			maxLen = webim.MSG_MAX_LENGTH.C2C;
			errInfo = "消息长度超出限制(最多" + Math.round(maxLen / 3) + "汉字)";

			if(msgtosend.length < 1) {
				alert("发送的消息不能为空!");
				$("#send_msg_text").val('');
				return;
			}
			if(msgLen > maxLen) {
				alert(errInfo);
				return;
			}
			var sess = webim.MsgStore.sessByTypeId(webim.SESSION_TYPE.C2C, toAccount);
			if(!sess) {
				sess = new webim.Session(webim.SESSION_TYPE.C2C, toAccount, toAccount, friendHeadUrl, Math.round(new Date().getTime() / 1000));
			}
			var isSend = true; //是否为自己发送
			var seq = -1; //消息序列，-1表示sdk自动生成，用于去重
			var random = Math.round(Math.random() * 4294967296); //消息随机数，用于去重
			var msgTime = Math.round(new Date().getTime() / 1000); //消息时间戳
			var subType; //消息子类型

			subType = webim.C2C_MSG_SUB_TYPE.COMMON;

			var msg = new webim.Msg(sess, isSend, seq, random, msgTime, loginInfo.identifier, subType, loginInfo.identifierNick);

			var text_obj;

			text_obj = new webim.Msg.Elem.Text(msgtosend);
			msg.addText(text_obj);

			webim.sendMsg(msg, function(resp) {
				var selToID = '';

				selType = webim.SESSION_TYPE.C2C;
				selToID = toAccount;
				selSess = sess;

				//私聊时，在聊天窗口手动添加一条发的消息，群聊时，长轮询接口会返回自己发的消息
				webim.Tool.setCookie("tmpmsg_" + toAccount, '', 0);

			}, function(err) {
				alert(err.ErrorInfo);
			});
		},
		addPic: function() {

		}
	},

	dao: {},

	init: function() {
		chat.event();
		chat.service.getChatInfo();
		webimLogin();
		
		
	}
}

mui.ready(function() {

});
chat.init();

//sdk登录
function webimLogin() {
	webim.login(
		loginInfo, listeners, options,
		function(resp) {
			loginInfo.identifierNick = resp.identifierNick; //设置当前用户昵称
			loginInfo.headurl = resp.headurl; //设置当前用户头
			getLastC2CHistoryMsgs(function(msgList) {
			}, function(err) {
				alert(err.ErrorInfo);
			});
		},
		function(err) {
			alert(err.ErrorInfo);
		}
	);
}

function onProgressCallBack() {}

//发送文件消息
function sendFile(images, imgName) {
	window.scrollTo(0,1000);
	var chatInfo = JSON.parse(localStorage.getItem("chatInfo"));
	var toAccount = chatInfo.wxid;
	var selSess = new webim.Session(webim.SESSION_TYPE.C2C, toAccount, toAccount, '',
		Math.round(new Date().getTime() / 1000));
	var sess = w	ebim.MsgStore.sessByTypeId(webim.SESSION_TYPE.C2C, toAccount);
	if(!sess) {
		sess = new webim.Session(webim.SESSION_TYPE.C2C, toAccount, toAccount, friendHeadUrl, Math.round(new Date().getTime() / 1000));
	}
	var isSend = true; //是否为自己发送
	var seq = -1; //消息序列，-1表示sdk自动生成，用于去重
	var random = Math.round(Math.random() * 4294967296); //消息随机数，用于去重
	var msgTime = Math.round(new Date().getTime() / 1000); //消息时间戳
	var subType; //消息子类型

	var msg = new webim.Msg(sess, isSend, seq, random, msgTime, loginInfo.identifier, subType, loginInfo.identifierNick);
	var images_obj = new webim.Msg.Elem.Images(images.File_UUID);
	for(var i in images.URL_INFO) {
		var img = images.URL_INFO[i];
		var newImg;
		var type;
		switch(img.PIC_TYPE) {
			case 1: //原图
				type = 1; //原图
				break;
			case 2: //小图（缩略图）
				type = 3; //小图
				break;
			case 4: //大图
				type = 2; //大图
				break;
		}
		newImg = new webim.Msg.Elem.Images.Image(type, img.PIC_Size, img.PIC_Width,
			img.PIC_Height, img.DownUrl);

	}
	msg.addImage(images_obj);
	//调用发送图片接口
	webim.sendMsg(msg, function(resp) {
		alert(123);
	}, function(err) {
		alert(err.ErrorInfo);
	});
}

//获取最新的c2c历史消息,用于切换好友聊天，重新拉取好友的聊天消息
var getLastC2CHistoryMsgs = function(cbOk, cbError) {

	var selType = webim.SESSION_TYPE.C2C;
	var chatInfo = JSON.parse(localStorage.getItem("chatInfo"));
	var reqMsgCount = 15;
	var selToID = chatInfo.wxid;
	var lastMsgTime = 0; //第一次拉取好友历史消息时，必须传0
	var msgKey = '';
	var options = {
		'Peer_Account': selToID, //好友帐号
		'MaxCnt': reqMsgCount, //拉取消息条数
		'LastMsgTime': lastMsgTime, //最近的消息时间，即从这个时间点向前拉取历史消息
		'MsgKey': msgKey
	};
	selSess = null;
	webim.MsgStore.delSessByTypeId(selType, selToID);

	webim.getC2CHistoryMsgs(
		options,
		function(resp) {
			var complete = resp.Complete; //是否还有历史消息可以拉取，1-表示没有，0-表示有

			if(resp.MsgList.length == 0) {
				webim.Log.warn("没有历史消息了:data=" + JSON.stringify(options));
				return;
			}
			for(var j in resp.MsgList) {
				newMsg = resp.MsgList[j];
				if(newMsg.isSend == true) {
					elems = newMsg.getElems();
					elem = elems[0];
					type = elem.getType(); //获取元素类型
					content = elem.getContent(); //获取元素对象
					if(type == webim.MSG_ELEMENT_TYPE.TEXT) {

						var html = '<div class="npcTalkItem clearFix border-right" > ' +
							'<div class="npcTalkImg fr"> ' +
							'<img src="../../images/chat/qq.png" alt="头像"> ' +
							'</div> ' +
							'<div class="npcTalk fr" > ' +
							'<div class="npcTalkCon gradient-bg" >' +
							newMsg.elems[0].content.text + ' </div> </div> </div>';
						$('.npcTalklist').append(html);
					}
					if(type == webim.MSG_ELEMENT_TYPE.IMAGE) {
						console.log(newMsg.elems[0].content.ImageInfoArray[1].url);
						var html = '<div class="npcTalkItem clearFix border-right" > ' +
							'<div class="npcTalkImg fr"> ' +
							'<img src="../../images/chat/qq.png" alt="头像"> ' +
							'</div> ' +
							'<div class="npcTalk fr" > ' +
							'<div class="npcTalkCon gradient-bg" >' +
							'<div><img src="' + newMsg.elems[0].content.ImageInfoArray[1].url + '" /></div>' + ' </div> </div> </div>';
						$('.npcTalklist').append(html);
					}

				} else {
					elems = newMsg.getElems();
					elem = elems[0];
					type = elem.getType(); //获取元素类型
					content = elem.getContent(); //获取元素对象
					if(type == webim.MSG_ELEMENT_TYPE.TEXT) {
						var html = '<div class="npcTalkItem clearFix border-right" > ' +
							'<div class="npcTalkImg fr"> ' +
							'<img src="../../images/chat/qq.png" alt="头像"> ' +
							'</div> ' +
							'<div class="npcTalk fr" > ' +
							'<div class="npcTalkCon gradient-bg" >' +
							newMsg.elems[0].content.text + ' </div> </div> </div>';
						$('.npcTalklist').append(html);
					}
					if(type == webim.MSG_ELEMENT_TYPE.IMAGE) {
						console.log(newMsg.elems[0].content.ImageInfoArray[1].url);

						var html = '<div class="npcTalkItem clearFix border-right" > ' +
							'<div class="npcTalkImg fr"> ' +
							'<img src="../../images/chat/qq.png" alt="头像"> ' +
							'</div> ' +
							'<div class="npcTalk fr" > ' +
							'<div class="npcTalkCon gradient-bg" >' +
							'<img src="' + newMsg.elems[0].content.ImageInfoArray[1].url + '" />' + ' </div> </div> </div>';
						$('.npcTalklist').append(html);
					}
				}
			}
			if(localStorage.getItem("muCode") == "T") {
				chat.service.sendEndMessage();
			} 
			window.scrollTo(0,1000);

			//          getPrePageC2CHistroyMsgInfoMap[selToID] = {//保留服务器返回的最近消息时间和消息Key,用于下次向前拉取历史消息
			//              'LastMsgTime': resp.LastMsgTime,
			//              'MsgKey': resp.MsgKey
			//          };
			//          //清空聊天界面
			//          document.getElementsByClassName("msgflow")[0].innerHTML = "";
			//          if (cbOk)
			//              cbOk(resp.MsgList);
		},
	);
};