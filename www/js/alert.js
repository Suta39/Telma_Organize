/* AlertPage **************************/
function agreeBtn(id){
  var dom = $("#alert"+id+" .agreeBtn");
  if(dom.hasClass('active')){
    /*
    //承認
    dom.addClass("btn-success");
    dom.removeClass("btn-secondary");
    dom.html("未承認");
    dom.toggleClass("active");*/
  }else{
    //未承認
    ons.notification.confirm({message:"本当に承認しますか？",title:null,modifier:"ios"}).then(function(result){
    if(result){
      dom.addClass("btn-success");
      dom.removeClass("btn-secondary");
      dom.html("チャットへ");
      dom.removeClass("active");
      dom.attr("onclick","chatOpen(1)");
      //チャットボタン作成
      /*var chatDom = dom.clone(true);
      listDom.prependTo($("#bbs-lists"));
      dom.clone()*/
    }else{
    }
  });
  }
}


//アラートページを開く
function openAlert(){
  myNavigator.pushPage('page/alert-page.html',{ animation : 'slide'}).then(function(){
    alertList()
  });
}

//記事リスト
function alertList(){
  //$("#load-dialog").show();
  //console.log(_domain+"/keiji?longitude=80&latitude=70");
  var sendData = {
    session_id:user.session_id,
    type:"0",
    user_id:user.user_id
  };
  $.ajax({
    type: "GET",
    url:_domain+"/alert.php?get1=list-all",
    //url:_domain+"/postinfo.php?type=alert-list",
    data:sendData,
    success: function(msg){
      
      //$(".alert-list:not(#listseed)").remove()
      $.each(msg,function(key,val){
        var listDom = $("#list-seed").clone(true);//.html("List"+listCnt)
        switch(true){
  			//掲示板のコメント
				case val.alert_type_id == "11":
          listDom.attr("onclick","bbsDetail("+val.any_id+")");
          var anyval = (val.any_value).split(',');
          var title = "["+anyval[0]+"]へコメント";
          var content = anyval[1];
          listDom.find(".alert-icon").attr("icon","fa-comment-o");
          listDom.find(".agreeBtn").css("display","none");
					break;
				//チャット
				case val.alert_type_id == "21":
          //listDom.attr("onclick","alertDetail("+val.keiji_id+")");
					var anyval = (val.any_value || "").split(',');
          var title = ""+anyval[0]+"";
          var content = anyval[1];
          listDom.find(".alert-icon").attr("icon","fa-comment-o");
          listDom.find(".agreeBtn").css("display","none");
          break;
				//承認（取引相手決定）
				case val.alert_type_id == "22":
          var anyval = (val.any_value || "").split(',');
          var title = "["+StrCut(anyval[1],15)+"]<br>から申請がありました";
          var content = StrCut(anyval[2],13);
          listDom.find(".alert-icon").attr("icon","ion-android-alert");
          listDom.find(".agreeBtn").css("display","");
          listDom.find(".agreeBtn").attr("onclick","agreeBtn("+val.alert_id+")");
          break;
				//貸す側へ承認返答
				case val.alert_type_id == "23":
          //listDom.attr("onclick","alertDetail("+val.keiji_id+")");
					var anyval = (val.any_value || "").split(',');
          var title = "["+anyval[0]+"]で是非貸してほしいそうです。";
          var content = "";
          listDom.find(".alert-icon").attr("icon","ion-android-alert");
          listDom.find(".agreeBtn").css("display","none");
          break;
				//評価通知
				case val.alert_type_id == "24":
          //listDom.attr("onclick","alertDetail("+val.keiji_id+")");
					var anyval = (val.any_value || "").split(',');
          var title = "["+anyval[0]+"]から評価が届きました";
          var content = "";
          listDom.find(".alert-icon").attr("icon","ion-android-alert");
          listDom.find(".agreeBtn").css("display","none");
          break;
				//貸し借り新規投稿通知
				case val.alert_type_id == "25":
          listDom.attr("onclick","rentDetail("+val.any_id+")");
					var anyval = (val.any_value || "").split(',');
          var title = "貸し借りに新しい投稿がありました";
          var content = "["+anyval[0]+"]";
          listDom.find(".alert-icon").attr("icon","ion-ios-information-outline");
          listDom.find(".agreeBtn").css("display","none");
          break;
				default:
          break;
      }
        //listDom.attr("hidden","false");
        listDom.css("display","table-row");
        listDom.attr("id","alert"+val.alert_id);
        listDom.find(".alert-title").html(title);
        listDom.find(".subtitle").html(content);
        listDom.find(".alert-list-date").html(formatDateTime(new Date(val.time)));
        //listDom.fadeIn().css("display","");
        //var cloneDom = listDom.clone(true);
        listDom.appendTo($("#alert-lists"));
      });
      $("#list-seed").css("display","none");
    },
    error: function(err){
      console.log("ajax-error!<br>"+JSON.stringify(err));
    }
   });
  /******/
}

/*************************************/