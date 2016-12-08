/*Rental**************/

//記事投稿
function rentWrite(){
if( navigator.geolocation ){
  // 現在地を取得
  navigator.geolocation.getCurrentPosition(function( position ){
  var data = position.coords ;
  var ido = data.latitude ;//緯度
  var keido = data.longitude ;//経度
  
  var title = $("#rent-title").val();
  var content = $("#rent-content").val();
  var imgname = $("#image").val();
  var fd = new FormData();
  if ($("#image").val()!== '') {
    imgname = $('#image')[0].files[0].name;
    fd.append("file",$("#image").prop("files")[0]);
    fd.append("image",$("#image").val());
  }
  
  var sendData = {
    session_id:user.session_id,
    user_id:user.user_id,
    title:title,
    content:content,
    ido:ido,
    keido:keido,
    limit:"3",
    image:imgname
  };
  
	$.ajax({
    type: "POST",
    url:_domain+"/kashikari.php?get1=post",
    data:sendData,
    success: function(msg){
      $.ajax({
          type: "POST",
          url: _domain+"/kashikari.php?get1=image&user_id="+user.user_id+"&session_id="+user.session_id,
          //url:_domain+"/keiji/post",
          data:fd,
          processData : false,
          contentType : false,
          dataType : "text",
          success: function(msg){
            if(msg=="true"){
              myNavigator.popPage();
              rentList();
            }
          }
      });
      myNavigator.popPage().then(
      rentList()
      );
    }
 	});
  })
}
}

//記事リスト
function rentList(){
  //$("#load-dialog").show();
  //console.log(_domain+"/keiji?longitude=80&latitude=70");
if( navigator.geolocation ){
  // 現在地を取得
  navigator.geolocation.getCurrentPosition(function( position ){
  var data = position.coords ;
  var ido = data.latitude ;//緯度
  var keido = data.longitude ;//経度

  var sendData = {
    ido:ido,keido:keido,
    session_id:user.session_id,
    user_id:user.user_id
  };
  $.ajax({
    type: "POST",
    url:_domain+"/kashikari.php?get1=list-all",
    //url:_domain+"/postinfo.php?type=rent-list",
    data:sendData,
    success: function(msg){
      $(".rent-list:visible").remove()
      $.each(msg,function(key,val){
        var listDom = $(".rent-list-seed:hidden").clone(true);//.html("List"+listCnt)
        //listDom.attr("hidden","false");
        listDom.find(".image").attr("onclick","rentDetail("+val.kashikari_id+")");
        listDom.find(".rent-list-title").attr("onclick","rentDetail("+val.kashikari_id+")");
        listDom.find(".rent-list-title").html(StrCut(val.title,14));
        //listDom.find(".list__item__subtitle").html(val.content);
        listDom.find(".rent-list-date").html(formatDateTime(new Date(val.time)));
        listDom.find(".rent-list-name").attr("onclick","ShowProfile("+val.user_id+")");
        listDom.find(".rent-list-name").html(val.username);
        listDom.fadeIn().css("display","");
        //var cloneDom = listDom.clone(true);
        
        /* 画像読込 ********/
        //画像ＵＲＬ
        if(val.image){
          var url=_domain+"/RentImage/"+val.image;
        }else{
          var url=_domain+"/RentImage/no_image.jpg";  
        }
        //画像用オブジェクトの作成
        var imgLoader=new Image();
        //onloadイベントハンドラ追加
        imgLoader.onload=function() {
          //ロード完了で画像を表示
          listDom.find(".image").attr("src",url);
        }
        //重要、最後に書く
        imgLoader.src=url;
        /*******************/
        listDom.appendTo($("#rent-lists"));
      });
    },
    error: function(err){
      console.log("ajax-error!<br>"+JSON.stringify(err));
    }
   });
  /******/
  })
}
}

//詳細表示
function rentDetail(id){
  //myNavigator.pushPage("page/rent/rent-detail.html", { animation : "slide"})
  //console.log(id);
  navigator.geolocation.getCurrentPosition(function( position ){
  var data = position.coords ;
  var ido = data.latitude ;//緯度
  var keido = data.longitude ;//経度
  var sendData = {
    session_id:user.session_id,
    kashikari_id:id,
    user_id:user.user_id,
    ido:ido,
    keido:keido
  }
  $.ajax({
    type: "POST",
    url: _domain+"/kashikari.php?get1=detail",
    //url:_domain+"/postinfo.php?type=rent-content",
    data:sendData,
    success: function(msg){
      myNavigator.pushPage("page/rent/rent-detail.html", { animation : "slide"})
      .then(function(){
        ons.ready(function(){
          //画像読み込み
          //var detailImg = new Image();
          //detailImage.onload=function() {
            //ロード完了で画像を表示
          //  $("#image-box").children("img").attr({'src':url});
          //}
          //detailImage.src = url;
          $("#rent-detail-var").html(msg.title);
          $("#rent-detail-title").html(msg.title);
          $("#rent-detail-content").html(brReplace(msg.content));
          $("#rent-detail-date").html(formatDateTime(new Date(msg.time)));
          $("#rent-detail-name").html(msg.name);
          $("#rent-detail-name").attr("onclick","ShowProfile("+msg.user_id+")");
          $("#rent-reply").attr("onclick","RentReply("+msg.kashikari_id+")");
          switch(true){
            case msg.reply_flg == 2:
              $("#rent-reply").html("申請中");
              $("#rent-reply").attr("onclick","");
              break;
            case msg.reply_flg == 3:
              $("#rent-reply").html("チャットへ");
              $("#rent-reply").attr("onclick","");
              break;
            default:
              $("#rent-reply").attr("onclick","ReplyMsg("+id+")");
              break;
          }
          if(msg.image){
            //console.log("read");
            /* 画像読込 ********/
            //画像ＵＲＬ
            var url=_domain+"/RentImage/"+msg.image;
            //画像用オブジェクトの作成
            var imgLoader=new Image();
            //onloadイベントハンドラ追加
            imgLoader.onload=function() {
              $("#image").css("display","");
              //ロード完了で画像を表示
              $("#image").attr("src",url);
            }
            //重要、最後に書く
            imgLoader.src=url;
            /*******************/
          }
        })
      });
    },
    error: function(err){
      console.log("ajax-error!<br>"+JSON.stringify(err));
    }
  });
  });
}

function ReplyMsg(id){
  openDialog('reply-msg');
  
  ons.ready(function(){
    $("#replymsg").val("");
    $("#reply-btn").attr("onclick","rentReply("+id+")");
  });
}

//貸す提案
function rentReply(id){
  //ons.notification.confirm({message:"本当に貸しますか？",title:null,modifier:"ios"}).then(function(result){
  var cmt = $("#replymsg").val();
  var sendData = {
    session_id:user.session_id,
    kashikari_id:id,
    user_id:user.user_id,
    comment:cmt
  }
  $.getJSON(_domain+"/kashikari.php?get1=reply",sendData,function(res){
    if(res.result=="true"){
      closeDialog("reply-msg");
      ons.notification.alert({messageHTML:"申請が承認されるまで<br>少々お待ちください。",title:null})
      $("#rent-reply").html("申請中");
    }else{
      alert("申請に失敗");
    }
  });
}

function openUserRate(id){
  openDialog('user-rate.html');
}

function UserRate(id){
  closeDialog('user-rate.html')
  ons.notification.alert({messageHTML:"取引相手への評価を<br>ありがとうございました。",title:null})
  //var cmt = $("#replymsg").val();
  /*var sendData = {
    kashikari_id:id,
    user_id:user.user_id,
    comment:cmt
  }
  $.getJSON(_domain+"/kashikari.php?get1=reply",sendData,function(res){
    if(res.result=="true"){
      closeDialog("reply-msg");
      ons.notification.alert({messageHTML:"申請が承認されるまで<br>少々お待ちください。",title:null})
      $("#rent-reply").html("申請中");
    }else{
      alert("申請に失敗");
    }
  });*/
}

function chatOpen(id){
  console.log(id);
  myNavigator.pushPage('page/chat.html', { animation : 'slide' } )/*
  .then(function(){
    ons.ready(function(){
    $(".chat-title #userName").html("太郎");
    })
  })*/
  /*
  var sendData = {
    keiji_id:id
  }
  //myNavigator.pushPage("rent-detail.html", { animation : "slide" , onTransitionEnd:rentDetailDom(sendData)});/*
  $.ajax({
    type: "GET",
    url: _domain+"/keiji/detail",
    //url:_domain+"/postinfo.php?type=rent-content",
    data:sendData,
    success: function(msg){
      console.log(JSON.stringify(msg));
      myNavigator.pushPage("rent-detail.html", { animation : "slide"})
      .then(function(){
        ons.ready(
          detailLoad(msg,id)
        )
      });
    }
  });*/
}
/*******************/