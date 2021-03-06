var massageList = [];
var massageCheckList = [];
var wxId = "";
var testResult;
var btnArray = ['确认', '取消'];

mui.init({

});

(function($) {
	$.init();
})(mui);

mui.init({
	pullRefresh: {
		container: '#pullrefresh',
		up: {
			contentrefresh: '正在加载...',
			callback: pullupRefresh
		}
	}
});

var count = 0;

/**
 * 上拉加载具体业务实现
 */
function pullupRefresh() {
	setTimeout(function() {
		messageList.service.doQuery();
	}, 500);
}

$('#messageList').on('tap', '.mui-btn', function(event) {
	event.stopPropagation();
	var elem = this;
	var li = elem.parentNode.parentNode;
	var to_id = $(this).closest(".item-messageAsk").data("id");
	var sess_type = 'C2C';
	mui.confirm('确认删除该条记录？', '提示', btnArray, function(e) {
		if(e.index == 0) {
			li.parentNode.removeChild(li);
			deleteFriend(to_id);

		} else {
			setTimeout(function() {
				$.swipeoutClose(li);
			}, 0);
		}
	});
});
messageList = {
	event: function() {
		$("#messageList").on("tap", ".chat-li", function(event) {
			event.stopPropagation();
			var result = $(this).closest(".item-messageAsk").data("result");
			localStorage.setItem("chatInfo", JSON.stringify(result));
			event.stopPropagation();
			window.location.href = "chat.html";
		});
		$("#checkMessage").on("tap", messageList.service.showCheckList);
		$("#userMessage").on("tap", messageList.service.showUserList);
		$("#sysMessage").on("tap", messageList.service.showSysList);
	},
	service: {

		showSysList: function() {
			$("#checkMsg").hide();
			$("#userMsg").hide();
			$("#sysMsg").show();
		},
		showCheckList: function() {
			$("#userMsg").hide();
			$("#checkMsg").show();
			$("#sysMsg").hide();
		},
		showUserList: function() {
			$("#checkMsg").hide();
			$("#userMsg").show();
			$("#sysMsg").hide();
		},
		unSuccess: function() {
			messageList.service.doQuery('01');
		},

		success: function() {
			messageList.service.doQuery('02');
		},

		doCheckList: function() {
			$("#messageCheckList").empty();
			var $list = $("#messageCheckList");
			mui('#pullrefresh').pullRefresh().endPullupToRefresh(true); //参数为true代表没有更多数据了
			messageList.service.doDraw($list, massageCheckList);
		},

		doQuery: function(status) {
			$("#messageList").empty();
			var $list = $("#messageList");
			mui('#pullrefresh').pullRefresh().endPullupToRefresh(true); //参数为true代表没有更多数据了
			messageList.service.doDraw($list, massageList);
		},

		doDraw: function(list, rows) {
			// 加载模板
			mui.get("messageList-tmpl.html", function(data) {
				var container = $("<div style=''></div>");
				container.html(data);
				$.each(rows, function(key, value) {
					var li = "";
					li = $("<li class='item-messageAsk'>");
					li.attr("data-result", JSON.stringify(value));
					li.attr("data-id", value.wxid);
					container.find("i[id=UnreadMsgCount]").text(value.UnreadMsgCount);
					if(value.UnreadMsgCount == 0) {
						container.find("i[id=UnreadMsgCount]").attr("disabled", true);
					}
					container.find("p[id=petname]").text(value.petname);
					container.find("p[id=newmeassage]").text(value.newmeassage);
					container.find("p[id=MsgTimeStamp]").text(value.MsgTimeStamp);
					// 模板渲染
					li.html(container.html());
					list.append(li);
				});
			}, "html");
		},

		//创建群组
		createGroup: function() {
			var sel_friends = $('#select_friends').val();
			console.log(loginInfo.identifier);
			var member_list = ["admin", "13905310001", "cscs"];
			faceurl = "http://b.hiphotos.baidu.com/image/pic/item/0d338744ebf81a4c308206b0db2a6059252da613.jpg";
			var cg_id = "weibowen";
			var options = {
				'GroupId': cg_id,
				'Owner_Account': loginInfo.identifier,
				'Type': 'ChatRoom', //Private/Public/ChatRoom/AVChatRoom
				'Name': "魏博文的讨论组",
				'Notification': "123",
				'Introduction': "123",
				'MemberList': member_list
			};
			if(faceurl) {
				options.FaceUrl = faceurl;
			}

			webim.createGroup(
				options,
				function(resp) {

					alert('创建群成功');
					//读取我的群组列表
					//getJoinedGroupListHigh(getGroupsCallbackOK);
				},
				function(err) {
					alert(err.ErrorInfo);
				}
			);
		},
	},

	dao: {},

	init: function() {
		messageList.event();
		localStorage.setItem("muCode", "F");
		//this.messageList.getDoctor();

	}
}

mui.ready(function() {
	webimLogin();

});
messageList.init();

//sdk登录
function webimLogin() {
	webim.login(
		loginInfo, listeners, options,
		function(resp) {
			loginInfo.identifierNick = resp.identifierNick; //设置当前用户昵称
			loginInfo.headurl = resp.headurl; //设置当前用户头
			getRecentContactList();
			getMyGroup();
		},
		function(err) {
			alert(err.ErrorInfo);
		}
	);
}

function getRecentContactList() {
	var options = {
		'Count': 100 //最近的会话数
	};
	var infoMap = {}; //初始化时，可以先拉取我的好友和我的群组信息
	//默认头像
	var groupHeadUrl = '';
	var maxNameLen = 10;
	webim.getRecentContactList(
		options,
		function(resp) {
			var data = [];
			var tempSess, tempSessMap = {}; //临时会话变量
			if(resp.SessionItem && resp.SessionItem.length > 0) {
				for(var i in resp.SessionItem) {
					var item = resp.SessionItem[i];
					var type = item.Type; //接口返回的会话类型
					var sessType, typeZh, sessionId, sessionNick = '',
						sessionImage = '',
						senderId = '',
						senderNick = '';
					if(type == webim.RECENT_CONTACT_TYPE.C2C) { //私聊
						typeZh = '私聊';
						sessType = webim.SESSION_TYPE.C2C; //设置会话类型
						sessionId = item.To_Account; //会话id，私聊时为好友ID或者系统账号（值为@TIM#SYSTEM，业务可以自己决定是否需要展示），注意：从To_Account获取,
						if(sessionId == '@TIM#SYSTEM') { //先过滤系统消息，，
							webim.Log.warn('过滤好友系统消息,sessionId=' + sessionId);
							continue;
						}
						var key = sessType + "_" + sessionId;
						var c2cInfo = infoMap[key];
						if(c2cInfo && c2cInfo.name) { //从infoMap获取c2c昵称
							sessionNick = c2cInfo.name; //会话昵称，私聊时为好友昵称，接口暂不支持返回，需要业务自己获取（前提是用户设置过自己的昵称，通过拉取好友资料接口（支持批量拉取）得到）
						} else { //没有找到或者没有设置过
							sessionNick = sessionId; //会话昵称，如果昵称为空，默认将其设成会话id
						}
						if(c2cInfo && c2cInfo.image) { //从infoMap获取c2c头像
							sessionImage = c2cInfo.image; //会话头像，私聊时为好友头像，接口暂不支持返回，需要业务自己获取（前提是用户设置过自己的昵称，通过拉取好友资料接口（支持批量拉取）得到）
						} else { //没有找到或者没有设置过
							sessionImage = "demo.png"; //会话头像，如果为空，默认将其设置demo自带的头像
						}
						senderId = senderNick = ''; //私聊时，这些字段用不到，直接设置为空

					} else if(type == webim.RECENT_CONTACT_TYPE.GROUP) { //群聊
						typeZh = '群聊';
						sessType = webim.SESSION_TYPE.GROUP; //设置会话类型
						sessionId = item.ToAccount; //会话id，群聊时为群ID，注意：从ToAccount获取
						sessionNick = item.GroupNick; //会话昵称，群聊时，为群名称，接口一定会返回

						if(item.GroupImage) { //优先考虑接口返回的群头像
							sessionImage = item.GroupImage; //会话头像，群聊时，群头像，如果业务设置过群头像（设置群头像请参考wiki文档-设置群资料接口），接口会返回
						} else { //接口没有返回或者没有设置过群头像，再从infoMap获取群头像
							var key = sessType + "_" + sessionId;
							var groupInfo = infoMap[key];
							if(groupInfo && groupInfo.image) { //
								sessionImage = groupInfo.image
							} else { //不存在或者没有设置过，则使用默认头像
								sessionImage = groupHeadUrl; //会话头像，如果没有设置过群头像，默认将其设置demo自带的头像
							}
						}
						senderId = item.MsgGroupFrom_Account; //群消息的发送者id

						if(!senderId) { //发送者id为空
							webim.Log.warn('群消息发送者id为空,senderId=' + senderId + ",groupid=" + sessionId);
							continue;
						}
						if(senderId == '@TIM#SYSTEM') { //先过滤群系统消息，因为接口暂时区分不了是进群还是退群等提示消息，
							webim.Log.warn('过滤群系统消息,senderId=' + senderId + ",groupid=" + sessionId);
							continue;
						}

						senderNick = item.MsgGroupFromCardName; //优先考虑群成员名片
						if(!senderNick) { //如果没有设置群成员名片
							senderNick = item.MsgGroupFromNickName; //再考虑接口是否返回了群成员昵称
							if(!senderNick) { //如果接口没有返回昵称或者没有设置群昵称，从infoMap获取昵称
								var key = webim.SESSION_TYPE.C2C + "_" + senderId;
								var c2cInfo = infoMap[key];
								if(c2cInfo && c2cInfo.name) {
									senderNick = c2cInfo.name; //发送者群昵称
								} else {
									sessionNick = senderId; //如果昵称为空，默认将其设成发送者id
								}
							}
						}

					} else {
						typeZh = '未知类型';
						sessionId = item.ToAccount; //
					}

					if(!sessionId) { //会话id为空
						webim.Log.warn('会话id为空,sessionId=' + sessionId);
						continue;
					}

					if(sessionId == '@TLS#NOT_FOUND') { //会话id不存在，可能是已经被删除了
						webim.Log.warn('会话id不存在,sessionId=' + sessionId);
						continue;
					}

					if(sessionNick.length > maxNameLen) { //帐号或昵称过长，截取一部分，出于demo需要，业务可以自己决定
						sessionNick = sessionNick.substr(0, maxNameLen) + "...";
					}

					tempSess = tempSessMap[sessType + "_" + sessionId];
					if(!tempSess) { //先判断是否存在（用于去重），不存在增加一个
						tempSessMap[sessType + "_" + sessionId] = true;
						data.push({
							sendobject: sessType, //会话类型
							SessionTypeZh: typeZh, //会话类型中文
							wxid: webim.Tool.formatText2Html(sessionId), //会话id
							petname: webim.Tool.formatText2Html(sessionNick), //会话昵称
							headurl: sessionImage, //会话头像
							C2cAccount: webim.Tool.formatText2Html(senderId), //发送者id
							senderNick: webim.Tool.formatText2Html(senderNick), //发送者昵称
							UnreadMsgCount: item.UnreadMsgCount, //未读消息数
							MsgSeq: item.MsgSeq, //消息seq
							MsgRandom: item.MsgRandom, //消息随机数
							MsgTimeStamp: webim.Tool.formatTimeStamp(item.MsgTimeStamp), //消息时间戳
							newmeassage: item.MsgShow //消息内容
						});
						testResult = {
							sendobject: sessType, //会话类型
							SessionTypeZh: typeZh, //会话类型中文
							wxid: webim.Tool.formatText2Html(sessionId), //会话id
							petname: webim.Tool.formatText2Html(sessionNick), //会话昵称
							headurl: sessionImage, //会话头像
							C2cAccount: webim.Tool.formatText2Html(senderId), //发送者id
							senderNick: webim.Tool.formatText2Html(senderNick), //发送者昵称
							UnreadMsgCount: item.UnreadMsgCount, //未读消息数
							MsgSeq: item.MsgSeq, //消息seq
							MsgRandom: item.MsgRandom, //消息随机数
							MsgTimeStamp: webim.Tool.formatTimeStamp(item.MsgTimeStamp), //消息时间戳
							newmeassage: item.MsgShow //消息内容
						};
					}
				}
				massageList = data;
				wxId = data.wxid;
				messageList.service.doQuery();
				//messageList.service.createGroup();
			}
		},
		function(err) {
			alert(err.ErrorInfo);
		}
	);
}

function getMyGroup() {
	var options = {
		'Member_Account': loginInfo.identifier,
		'Limit': 10,
		'Offset': 0,
		//'GroupType':'',
		'GroupBaseInfoFilter': [
			'Type',
			'Name',
			'Introduction',
			'Notification',
			'FaceUrl',
			'CreateTime',
			'Owner_Account',
			'LastInfoTime',
			'LastMsgTime',
			'NextMsgSeq',
			'MemberNum',
			'MaxMemberNum',
			'ApplyJoinOption',
			'ShutUpAllMember'
		],
		'SelfInfoFilter': [
			'Role',
			'JoinTime',
			'MsgFlag',
			'UnreadMsgNum'
		]
	};
	webim.getJoinedGroupListHigh(
		options,
		function(resp) {
			if(!resp.GroupIdList || resp.GroupIdList.length == 0) {
				alert('你目前还没有加入任何群组');
				return;
			}
			var data = [];
			for(var i = 0; i < resp.GroupIdList.length; i++) {
				var group_id = resp.GroupIdList[i].GroupId;
				var name = webim.Tool.formatText2Html(resp.GroupIdList[i].Name);
				var faceUrl = resp.GroupIdList[i].FaceUrl;
				var type_en = resp.GroupIdList[i].Type;
				var type = webim.Tool.groupTypeEn2Ch(resp.GroupIdList[i].Type);
				var role_en = resp.GroupIdList[i].SelfInfo.Role;
				var role = webim.Tool.groupRoleEn2Ch(resp.GroupIdList[i].SelfInfo.Role);
				var msg_flag = webim.Tool.groupMsgFlagEn2Ch(resp.GroupIdList[i].SelfInfo.MsgFlag);
				var msg_flag_en = resp.GroupIdList[i].SelfInfo.MsgFlag;
				var join_time = webim.Tool.formatTimeStamp(resp.GroupIdList[i].SelfInfo.JoinTime);
				var member_num = resp.GroupIdList[i].MemberNum;
				var notification = webim.Tool.formatText2Html(resp.GroupIdList[i].Notification);
				var introduction = webim.Tool.formatText2Html(resp.GroupIdList[i].Introduction);
				var ShutUpAllMember = resp.GroupIdList[i].ShutUpAllMember; //== 'On' ? resp.GroupIdList[i].ShutUpAllMember = '开启' : resp.GroupIdList[i].ShutUpAllMember = '关闭';
				var UnreadMsgCount = resp.GroupIdList[i].SelfInfo.UnreadMsgNum;
				data.push({
					'petname': name,
					'UnreadMsgCount': UnreadMsgCount,
					'GId': group_id,
					'GroupId': webim.Tool.formatText2Html(group_id),
					'Name': name,
					'FaceUrl': faceUrl,
					'TypeEn': type_en,
					'Type': type,
					'RoleEn': role_en,
					'Role': role,
					'MsgFlagEn': msg_flag_en,
					'MsgFlag': msg_flag,
					'MemberNum': member_num,
					'Notification': notification,
					'Introduction': introduction,
					'JoinTime': join_time,
					'ShutUpAllMember': ShutUpAllMember
				});
			}
			massageCheckList = data;

			wxId = data.wxid;
			messageList.service.doCheckList();

		},
		function(err) {
			alert(err.ErrorInfo);
		}
	);
};

function deleteFriend(toAccount) {

	var to_account = [];
	to_account = [
		toAccount.toString()
	];
	if(to_account.length <= 0) {
		return;
	}
	var options = {
		'From_Account': loginInfo.identifier,
		'To_Account': to_account,
		//Delete_Type_Both'//单向删除："Delete_Type_Single", 双向删除："Delete_Type_Both".
		'DeleteType': "Delete_Type_Both"
	};
	webim.deleteFriend(
		options,
		function(resp) {
			delChat(1,toAccount.toString());
		},
		function(err) {
			alert(err.ErrorInfo);
		}
	);
};


function delChat(sess_type, to_id) {

    var data = {
        'To_Account': to_id,
        'chatType': sess_type
    }
    webim.deleteChat(
        data,
        function(resp) {
           
        }
    );
}