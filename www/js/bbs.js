/*BBS****************/

//記事投稿
function bbsWrite(){
  if( navigator.geolocation ){
    // 現在地を取得
  navigator.geolocation.getCurrentPosition(function( position ){
  var data = position.coords ;
  var ido = data.latitude ;//緯度
  var keido = data.longitude ;//経度
  
  var title = $("#bbs-title").val();
  var content = $("#bbs-content").val();
  var imgname = "";
  var fd = new FormData();
  if ($("#image").val()!== '') {
    imgname = $('#image')[0].files[0].name;
    fd.append("file",$("#image").prop("files")[0]);
    fd.append("image",$("#image").val());
  }
  var sendData = {
    session_id:user.session_id,
    title:title,
    content:content,
    user_id:user.user_id,
    ido:ido,
    keido:keido,
    image:imgname,
  };
  
	$.ajax({
    type: "POST",
    url: _domain+"/keiji.php?get1=post",
    //url:_domain+"/keiji/post",
    data:sendData,  
    success: function(msg){
      if(msg=="true"){
        $.ajax({
          type: "POST",
          url: _domain+"/keiji.php?get1=image&user_id="+user.user_id+"&session_id="+user.session_id,
          //url:_domain+"/keiji/post",
          data:fd,
          processData : false,
          contentType : false,
          dataType : "text",
          success: function(msg){
            if(msg=="true"){
              //console.log("Success!");
            }
          }
        });
        myNavigator.popPage();
        bbsList();
      }
    }
 	});
  })
}
}

function FileStatus(){
  var file = $('#image')[0].files[0].name;
  //console.log(file)
  if(file == null) {
    $("#readform").css("display","");
    $("#readform").html('読み込み中...');//ファイル読込まで読込中表示
    $("#sendBtn").prop("disabled",true);//送信ボタン無効化
  }else{
    $("#readform").css("display","");
    $("#readform").html(file); // ファイル名を表示
    $("#sendBtn").prop("disabled",false);//送信ボタン有効化
  }
}

function bbsReply(id){
  $.ajax({
     type: "POST",
     url: _domain+"/keiji.php?get1=detail",
     //url:_domain+"/postinfo.php?type=bbs-content",
    data:{
      keiji_id:id,
      session_id:user.session_id,
      user_id:user.user_id
    },
    success: function(msg){
      myNavigator.pushPage("page/bbs/bbs-reply.html", { animation : "lift"}).then(function(){
        ons.ready(function(){
          //console.log(JSON.stringify(msg));
          $("#bbs-reply-var").html(msg.title);
          $("#bbs-reply-content").html(brReplace(msg.content));
          $("#bbs-reply-btn").attr("onclick","bbsReplyPost("+id+")");
          //var cloneDom = listDom.clone(true);
        })
      })
    }
  });
}


//記事リスト
function bbsList(){
if( navigator.geolocation ){
  // 現在地を取得
  navigator.geolocation.getCurrentPosition(function( position ){
  var data = position.coords ;
  var ido = data.latitude ;//緯度
  var keido = data.longitude ;//経度
  var sendData = {
    session_id:user.session_id,
    user_id:user.user_id,
    ido:ido,keido:keido
  };
  $.ajax({
   type: "POST",
   url:_domain+"/keiji.php?get1=list-all",
   data:sendData,
   success: function(msg){
    $(".bbs-list:visible").remove()
    var beforeId;
    $.each(msg,function(key,val){
      if(beforeId!=val.keiji_id){
        var listDom = $(".bbs-list-seed:hidden").clone(true);//.html("List"+listCnt)
        listDom.attr("id",val.keiji_id);
        //listDom.attr("hidden","false");
        listDom.css("display","flex");
        listDom.find(".list__item__thumbnail").attr("onclick","bbsDetail("+val.keiji_id+")");
        listDom.find(".list__item__title").attr("onclick","bbsDetail("+val.keiji_id+")");
        val.title = (val.title=="")? "NoTitle":val.title;
        listDom.find(".list__item__title").html(StrCut(val.title,22));
        //listDom.find(".list__item__subtitle").html(val.content);
        listDom.find(".bbs-list-date").html(formatDateTime(new Date(val.time)));
        listDom.find(".bbs-list-name").html(val.username);
        listDom.find(".bbs-list-name").attr("onclick","ShowProfile("+val.user_id+")");
        listDom.fadeIn().css("display","");
        //var cloneDom = listDom.clone(true);
        listDom.appendTo($("#bbs-lists"));
      }
      beforeId = val.keiji_id;
    });
    },
    error: function(err){
      //console.log("ajax-error!<br>"+JSON.stringify(err));
    }
 	});
  })
}
/******/
}

//詳細表示
function bbsDetail(id){
  //console.log(id);
  var sendData = {
    session_id:user.session_id,
    user_id:user.user_id,
    keiji_id:id
  }
  //myNavigator.pushPage("bbs-detail.html", { animation : "slide" , onTransitionEnd:bbsDetailDom(sendData)});/*
  $.ajax({
    type: "GET",
    url: _domain+"/keiji.php?get1=detail",
    //url:_domain+"/postinfo.php?type=bbs-content",
    data:sendData,
    success: function(msg){
      //console.log(JSON.stringify(msg));
      myNavigator.pushPage("page/bbs/bbs-detail.html", { animation : "slide"})
      .then(function(){
        ons.ready(
          bbsDetailDom(msg,id)
        )
      });
    }
  }); 
}

function bbsDetailDom(msg,id){
  $("#bbs-detail-var").html(StrCut(msg.title,10));
  $("#bbs-detail-title").html(msg.title);
  $("#bbs-detail-name").html(msg.username);
  $("#bbs-detail-name").attr("onclick","ShowProfile("+msg.user_id+")");
  $("#bbs-detail-date").html(formatDateTime(new Date(msg.time)));
  $("#bbs-detail-content").html(brReplace(msg.content));
  $("#bbs-detail-reply").attr("onclick","bbsReply("+id+")")
  $(".bbs-list-update").attr("onclick","bbsCmtUpdate("+id+")");
  $("#cmtCount").html(msg.cmtcount[0][0]);
  
  $(".bbs-cmt-list:not(:hidden)").remove()
  $.each(msg['comment'],function(key,val){
    var listDom = $(".bbs-cmt-list:first").clone(true);//.html("List"+listCnt)
    listDom.css("display","flex");
    //listDom.attr("hidden","false");
    //listDom.find(".image").html(val.image);
    listDom.find(".bbs-cmt-cmt").html(brReplace(val.comment));
    listDom.find(".bbs-cmt-name").html(val.fullname);
    listDom.find(".bbs-cmt-date").html(formatDateTime(new Date(val.time)));
    //var cloneDom = listDom.clone(true);
    listDom.prependTo($("#bbs-cmt-lists"));
  });
  if(msg.image){
    //console.log("read");
    /* 画像読込 ********/
    //画像ＵＲＬ
    var url=_domain+"/BBSImage/"+msg.image;
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
}


function bbsReplyPost(id){
  var comment = $("#bbs-reply-cmt").val();
  //console.log("start!");
  var sendData = {
    session_id:user.session_id,
    user_id:user.user_id,
    keiji_id:id,
    comment:comment
  };
	$.ajax({
    type: "POST",
    url:_domain+"/keiji.php?get1=comment",
    data:sendData,
    success: function(msg){
      myNavigator.popPage().then(ons.ready(bbsCmtUpdate(id)))
    },
    error: function(msg){
      console.log("error/".msg);
    }
 	});
}

function bbsCmtUpdate(id){
  //console.log(id);
  var sendData = {
    session_id:user.session_id,
    user_id:user.user_id,
    keiji_id:id
  }
  //myNavigator.pushPage("bbs-detail.html", { animation : "slide" , onTransitionEnd:bbsDetailDom(sendData)});/*
  $.ajax({
    type: "GET",
    url: _domain+"/keiji.php?get1=detail",
    //url:_domain+"/postinfo.php?type=bbs-content",
    data:sendData,
    success: function(msg){
       bbsDetailDom(msg,id)
    }
  }); 
}

//地点登録
function locationRegi(id){
  var cnt;
  var compFlg = 0;
  var t_region = user.region;
  //３つの地点の中にNullがあるか調べる
  for(cnt=0;cnt<3;cnt++){
    if(t_region[cnt].ido=="" || t_region[cnt].ido==0 || t_region[cnt].ido==null){
      t_region[cnt].name = $("#location-regi .place").val();
      t_region[cnt].ido = "100";
      t_region[cnt].keido = "200";
      t_region[cnt].checker = "1";
      var sendData = {
        region:user.region,
        session_id:user.session_id,
        user_id:user.user_id
      }
      $.post(_domain+"/keiji.php?get1=edit-all",sendData,
      function(res){
        if(res.result=="true"){
          ons.notification.alert({message:"登録が完了しました。",title:null});
          closeDialog('location-regi');
          bbsList();
        }else{
          ons.notification.alert({message:"登録に失敗しました。",title:null});
        }
      });
      return true;//user.region = t_region;
    }
  }
  closeDialog('location-regi');
  ons.notification.alert({messageHTML:"登録できる数が<br>限界に達しました。",title:null,collback:locationSelect()})
}

function locationSelect(){
  var cnt;
  var region = user.region;
  locationEdit(1);
  $(".location-list[id!='seed']").remove()
  for(cnt=0;cnt<4;cnt++){
    if(region[cnt].location_flg == 0){
      //$(".onoffswitch-checkbox").prop("checked",false);
      $(".check").prop("disabled",false);
      var listDom = $("#location-seed #seed").clone(true);//.html("List"+listCnt)
      if(region[cnt].ido != "0" && region[cnt].ido!=""){
        listDom.css("display","flex");
      }
      listDom.attr("id","location"+cnt);
      if(region[cnt].checker=="1"){
        listDom.find(".check").prop("checked",true);
      }
      listDom.find(".edit-name").val(region[cnt].name);
      listDom.find(".edit-name").attr("onkeyup","locationName("+cnt+")");
      listDom.find(".check-name").html(region[cnt].name);
      listDom.find(".location_key").attr("id",cnt+1);
      listDom.find(".del-btn").attr("onclick","locationDelete("+cnt+")");
      listDom.find(".check").attr("onchange","locationActive("+cnt+")");
      //listDom.find(".check").attr("onchange","locationaChecked("+cnt+")");
      listDom.appendTo($("#location-lists"));
    }
  }
  document.getElementById("location-select.html").show();
}
//ユーザーの名前の変更
function locationName(id){
  var t_region = user.region;
  //console.log($(".location-list .name"))
  t_region[id].name = $(".location-list .edit-name")[id+1].value;
  $(".location-list .check-name")[id+1].innerHTML = $(".location-list .edit-name")[id+1].value;
  return true;//user.region = t_region;
}
//地点のチェック
function locationaChecked(id){
  var t_region = user.region;
  //console.log($(".location-list .name"))
  if($(".location-list .check")[id+1].checked){
    t_region.checked[id] = 0;
    $(".location-list .check")[id+1].checked = false;
  }else{
    t_region.checked[id] = 1;
    $(".location-list .check")[id+1].checked = true;
  }
  return true;//user.region = t_region;
}
//地点削除
function locationDelete(key){
  var t_region = user.region;
  t_region[key].name = "";
  t_region[key].ido = "";
  t_region[key].keido = "";
  $("#location"+key).remove()
  return true;//user.region = t_region;
}
//地点有効化
function locationActive(key){
  console.log("locacheck"+key)
  var t_region = user.region;
  if($('#location'+key+' .check').prop("checked")){
    t_region[key].checker = "1";
  }else{
    t_region[key].checker = "0";  
  }
  return true;//user.region = t_region;
}
//編集モードToggle
function locationEdit(flg){
  //$("#location-toggle").is(":checked")
  if(!$('#location-toggle').prop("checked")||flg == 1){
    //位置情報選択中
    $("#edit-btn").css("background-color","#fff");
    $("#edit-btn").css("color","#000");
    $(".check").prop("disabled",false);
    $(".del-btn").prop("disabled",true);
    $("#location-lists .edit-name, .del-btn").css("display","none");
    $("#location-lists .check-name, .check").css("display","flex");
  }else{
    //位置情報編集中
    $("#edit-btn").css("background-color","#f96565");
    $("#edit-btn").css("color","#fff");
    $(".del-btn").prop("disabled",false);
    $(".check").prop("disabled",true);
    $("#location-lists .edit-name, .del-btn").css("display","flex");
    $("#location-lists .check-name, .check").css("display","none");
  }
}
//データベースへ登録
function locationEditAll(){
  var sendData = {
    session_id:user.session_id,
    user_id:user.user_id,
    region:user.region
  }
  $.post(_domain+"/keiji.php?get1=edit-all",sendData,
  function(res){
    closeDialog('location-select.html')
    bbsList()
  });
}

//Refresh
function bbdRefresh(event){/*
  var pullHook = $('#refresh');
  var message = '';
  switch (event.state) {
    case 'initial':
      message = 'Pull to refresh';
      break;
    case 'preaction':
      message = 'Release';
      break;
    case 'action':
      message = 'Loading...';
      break;
  }
  pullHook.innerHTML = message;

  pullHook.onAction = function(done) {
    setTimeout(done, 1000);
  }*/
}

