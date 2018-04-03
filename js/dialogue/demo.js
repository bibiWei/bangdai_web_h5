/**
 * Created by zhangqi on 16/10/12.
 */
var iflytek = (function(document){
    var iat_result = '';
    var tip =$('.audioSent');
    var volumeTip = document.getElementById('volume');
    volumeTip.width = parseFloat(tip.width()) -100;
    var volumeWrapper = document.getElementById('canvas_wrapper');
    var oldText = tip.html();
    /* 标识麦克风按钮状态，按下状态值为true，否则为false */
    var mic_pressed = false;
    var volumeEvent = (function () {
        var lastVolume = 0;
        var eventId = 0;
        var canvas = volumeTip,
            cwidth = canvas.width,
            cheight = canvas.height;
        var ctx = canvas.getContext('2d');
        var gradient = ctx.createLinearGradient(0, 0, cwidth, 0);
        var animationId;
        gradient.addColorStop(1, 'red');
        gradient.addColorStop(0.8, 'yellow');
        gradient.addColorStop(0.5, '#9ec5f5');
        gradient.addColorStop(0, '#c1f1c5');

        volumeWrapper.style.display = "none";

        var listen = function(volume){
            lastVolume = volume;
        };
        var draw = function(){
            if(volumeWrapper.style.display == "none"){
                cancelAnimationFrame(animationId);
            }
            ctx.clearRect(0, 0, cwidth, cheight);
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 1 + lastVolume*cwidth/30, cheight);
            animationId = requestAnimationFrame(draw);
        };
        var start = function(){
            animationId = requestAnimationFrame(draw);
            volumeWrapper.style.display = "block";
        };
        var stop = function(){
            clearInterval(eventId);
            volumeWrapper.style.display = "none";
        };
        return {
            "listen":listen,
            "start":start,
            "stop":stop
        };
    })();
    /***********************************************local Variables**********************************************************/

    /**
     * 初始化Session会话
     */
        var objectURL='';
    var session = new IFlyIatSession({
        "callback":{
            "onResult": function (err, result) {
            	uploadFile();
                /* 若回调的err为空或错误码为0，则会话成功，可提取识别结果进行显示*/
                if (err == null || err == undefined || err == 0) {
                    if (result == '' || result == null){
                      alert( "没有获取到识别结果");}
                    else{
                        console.log(result);
                        debugger;
                
                        var html=' <div class="npcTalkItem clearFix border-left" > ' +
                            '<div class="npcTalkImg fl"> ' +
                            '<img src="../../images/dialogue/2.jpg" alt="头像"> ' +
                            '</div> ' +
                            '<div class="npcTalk fl" > ' +
                            '<div class="npcTalkCon audioPlay" > ' +
                            '<i></i> 35' +
                            '<audio  src="'+objectURL+'" autoplay/> '+
                            '</div>'+
                       '</div>'+
                        '</div>';
                        uploadFile(objectURL);
                        $('.npcTalklist').append(html);
                    }
                    
                    /* 若回调的err不为空且错误码不为0，则会话失败，可提取错误码 */
                } else {
                   alert( 'error code : ' + err + ", error description : " + result);
                }
                mic_pressed = false;
                volumeEvent.stop();
            },
            "onVolume": function (volume) {
                volumeEvent.listen(volume);
            },
            "onError":function(){
                mic_pressed = false;
                volumeEvent.stop();
            },
            "onProcess":function(status){
                switch (status){
                    case 'onStart':
                        tip.html("服务初始化...");
                        break;
                    case 'normalVolume':
                    case 'started':
                        tip.html("倾听中...");
                        break;
                    case 'onStop':
                        tip.html("等待结果...");
                        break;
                    case 'onEnd':
                        tip.html(oldText);
                        break;
                    case 'lowVolume':
                        tip.html("倾听中...(声音过小)");
                        break;
                    default:
                        tip.html(status);
                }
            },
            "onData":function(data){
                objectURL=window.URL.createObjectURL(data);
            }
        }
    });

    if(!session.isSupport()){
        tip.html("当前浏览器不支持！");
        return;
    }

    var play = function() {
        if (!mic_pressed) {
            var ssb_param = {
                "grammar_list": null,
                "params": "appid=5941dd23,appidkey=184d27ddbaade21b, lang = sms, acous = anhui, aue=speex-wb;-1, usr = mkchen, ssm = 1, sub = iat, net_type = wifi, " +
                "rse = utf8, ent =sms16k, rst = plain, auf  = audio/L16;rate=16000, " +
                "vad_enable = 1, vad_timeout = 5000, vad_speech_tail = 500, compress = igzip"
            };
            iat_result = '   ';
            /* 调用开始录音接口，通过function(volume)和function(err, obj)回调音量和识别结果 */
            session.start(ssb_param);
            mic_pressed = true;
            volumeEvent.start();
        }
        else {
            //停止麦克风录音，仍会返回已传录音的识别结果.
            session.stop();
        }
    }

    /**
     * 取消本次会话识别
     */
    var cancel = function() {
        session.cancel();
    }

    tip.bind("click",function(){
        play();
    });
    //页面不可见，断开麦克风调用
    document.addEventListener("visibilitychange",function(){
        if(document.hidden == true){
            session.kill();
        }
    });
})(document)

function webimLogin() {
	webim.login(
		loginInfo, listeners, options,
		function(resp) {
			loginInfo.identifierNick = resp.identifierNick; //设置当前用户昵称
			loginInfo.headurl = resp.headurl; //设置当前用户头
			uploadFile();
		},
		function(err) {
			alert(err.ErrorInfo);
		}
	);
}

//上传文件
function uploadFile() {
	debugger;
	var s = "blob:http://127.0.0.1:8020/427dbbd1-28fa-43da-a87e-44ebfef8b542";
	var test = ["blob:http://127.0.0.1:8020/427dbbd1-28fa-43da-a87e-44ebfef8b542"];
	var objFile=new File(test,"st");  
	var patientInfo = JSON.parse(localStorage.getItem("weixinPatientInfo"));
	var selToID = patientInfo.wxid;
	
    var businessType = 2;//业务类型，1-发群文件，2-向好友发文件
    var selType = webim.SESSION_TYPE.C2C;
    if (selType == webim.SESSION_TYPE.C2C) {//向好友发文件
        businessType = webim.UPLOAD_PIC_BUSSINESS_TYPE.C2C_MSG;
    } else if (selType == webim.SESSION_TYPE.GROUP) {//发群文件
        businessType = webim.UPLOAD_PIC_BUSSINESS_TYPE.GROUP_MSG;
    }
	
    //封装上传文件请求
    var opt = {
        'file': objFile, //文件对象
        'onProgressCallBack': onFileProgressCallBack, //上传文件进度条回调函数
        //'abortButton': document.getElementById('upd_abort'), //停止上传文件按钮
        'To_Account': selToID, //接收者
        'businessType': businessType,//业务类型
        'fileType': webim.UPLOAD_RES_TYPE.FILE//表示上传文件
    };
    //上传文件
    webim.uploadFile(opt,
        function (resp) {
            //上传成功发送文件
    
//          sendFile(resp,file.name);
//          $('#upload_file_dialog').modal('hide');
        },
        function (err) {
            alert(err.ErrorInfo);
        }
    );
}

function onFileProgressCallBack(){
	
}
