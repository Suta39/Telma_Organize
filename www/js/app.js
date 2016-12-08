
// This is a JavaScript file

//定数
//var _domain = "https://exout.net/~kashima_dollars/telma_srv";
var _domain = "https://exout.net/~kashima_dollars/telma_srv";
//var _domain1 = "https://it2-sotuken.herokuapp.com"
//var _domain = "http://192.168.10.100/telma_server";
//var _domain = "http://suta39.php.xdomain.jp/telma_server";
//var _domain = "http://192.168.10.102:3000";
//var _domain = "http://denpatelma.php.xdomain.jp/telma_srv"

var ido = "1000"
var keido = "1000";
var color1 = "#009688";
var color2 = "#009688";

var user = {
  user_id:"",
  session_id:"",
  region:[
    {region_id:"",name:"",ido:"",keido:"",checker:"",location_flg:""} ,
    {region_id:"",name:"",ido:"",keido:"",checker:"",location_flg:""} ,
    {region_id:"",name:"",ido:"",keido:"",checker:"",location_flg:""} ,
    {region_id:"",name:"",ido:"",keido:"",checker:"",location_flg:""}
    ]
}

function menuOpen() {
  document.querySelector('#mySplitter').left.toggle();
}
function openSlide(page) {
  $("#content").load(page);
  document.querySelector('#mySplitter').left.toggle();
}
//上開き移動
function popOpen(page){
  myNavigator.pushPage(page, { animation : 'lift' } ).then(function(){
    ons.ready(function(){
      $("#bbsImg").onchange = function(evt){
        var file = evt.target.files[0];
        var reader = new FileReader();
        reader.onload = function(evt) {
        }
      }
    })
  });
}

//右ページ移動
function slideOpen(page){
  var options = {animation: 'slide'} // Called when finishing transition animation
	myNavigator.pushPage(page,options);
}
//ポップアップ表示
function openDialog(id){
  document.getElementById(id).show();
}
//ポップアップ閉
function closeDialog(id){
  document.getElementById(id).hide();
}

//メイン画面のタブを押したときのEvent
function mainTabChange(type){
  switch(type){
    case 1:
      $("ons-toolbar").css("background-color",color1);
      $(".tab-bar__label").css("background-color",color1);
      $("ons-fab").css("background-color",color1);
      $(".list-update").attr("onclick","rentList()");
      bbsList();
      $(".list-update").attr("onclick","bbsList()");
      break;
    case 2:
      $("ons-toolbar").css("background-color",color2);
      $(".tab-bar__label").css("background-color",color2);
      $("ons-fab").css("background-color",color2);
      $(".list-update").attr("onclick","rentList()");
      rentList();
      break;
  }
}

//プロフィールの編集を押したとき
function openUserEdit() {
  var sendData = {
    session_id:user.session_id,
    user_id:user.user_id
  }
  
$.getJSON(_domain+"/user.php?get1=userinfo",sendData,
  function(res){
    if(res[0].result==="true"){
      $("#content").load("page/useredit.html");
      document.querySelector('#mySplitter').left.toggle()
      .then(function(){
        ons.ready(function(){
          $("#username").val(res[0].fullname);
          $("#email").val(res[0].email);
          $("#twitter_id").val(res[0].twitter_id);
          $("#facebook_id").val(res[0].facebook_id);
          $("#google_id").val(res[0].google_id);
        })
      })
    }else{
      alert("更新失敗");
      myNavigator.replacePage("splitter.html",{animation:"fade"});
    }
    
  });
}

//プロフィールページからメイン画面へ戻る時の処理
function userback() {
  var username = $("#username").val();
  var email = $("#email").val();
  var twitter_id = $("#twitter_id").val();
  var facebook_id = $("#facebook_id").val();
  var google_id = $("#google_id").val();
  
  var sendData = {
    session_id:user.session_id,
    user_id:user.user_id,
    username:username,
    email:email,
    twitter_id:twitter_id,
    facebook_id:facebook_id,
    google_id:google_id
  }
  
  $.ajax({type:"post",url:_domain+"/user.php?get1=useredit",data:sendData,
    success:function(res){
      if(res.result=="true"){
        myNavigator.replacePage("splitter.html",{animation:"fade",onTransitionEnd:function(){
          ons.ready(function(){
            $("#main-myname").html(res.fullname);
            bbsList();
          })
        }})
      }else if(res.result == "01"){
        console.log("メールアドレスが空です")
        alert("メールアドレスが空です");
      }else if(res.result == "02"){
        console.log("メールの重複")
        alert("メールアドレスが重複しています");
      }else{
        console.log("更新失敗");
        myNavigator.replacePage("splitter.html",{animation:"fade"});
      }
    }
  })
}

//相手のプロフィールを表示させる
function ShowProfile(id){
  var sendData = {
    session_id:user.session_id,
    user_id:id
  }
  $.getJSON(_domain+"/user.php?get1=userinfo",sendData,function(msg){
    $("#profile-dialog").show()
    ons.ready(function(){
      $("#username").html(msg[0].fullname);
      console.log(msg[0].image);
      if(msg[0].image){
        //画像ＵＲＬ
        var url=_domain+"/UserImage/"+msg[0].image;
        //画像用オブジェクトの作成
        var imgLoader=new Image();
        //onloadイベントハンドラ追加
        imgLoader.onload=function() {
          $("#image1").css("display","");
          //ロード完了で画像を表示
          $("#image1").attr("src",url);  
        }
        //必ず最後に書く
        imgLoader.src=url;
        
      }
    })
  })
}

//ログアウト
function logout(){
  user =  {
  user_id:"",
  session_id:"",
  region:[
    {region_id:"",name:"",ido:"0",keido:"0",checker:"0",location_flg:"0"} ,
    {region_id:"",name:"",ido:"0",keido:"0",checker:"0",location_flg:"0"} ,
    {region_id:"",name:"",ido:"0",keido:"0",checker:"0",location_flg:"0"} ,
    {region_id:"",name:"",ido:"0",keido:"0",checker:"0",location_flg:"1"}
    ]
  }
  closeDialog('logout-review');
  myNavigator.replacePage("page/login/login.html",{animation:"fade"})
}

/* API ******************/
function SetLocation(){
  if( navigator.geolocation ){
    // 現在地を取得
    navigator.geolocation.getCurrentPosition(function( position ){
    var data = position.coords ;
    ido = data.latitude ;//緯度
    keido = data.longitude ;//経度
    });
  }else{
    alert("位置情報取得失敗")
  }
}

//表示させる文字数の制限
function StrCut(text,cnt){
  return text.substr(0,cnt);
}

function ContentFormat(msg){
  //URLをAタグに変換
  msg = msg.replace(/((http|https|ftp):\/\/[\w?=&.\/-;#~%-]+(?![\w\s?&.\/;#~%"=-]*>))/g, '<a href="$1">$1</a> ');
  //改行の変換
  msg = brReplace(msg);
  return msg;
}

//改行文字を改行タグに変換
function brReplace(msg) {
    return msg.replace(/\n/g, '<br>');
};

//時間のフォーマット処理
//(汎用版)
function formatDateTime(date, format) {
  //if (!format) format = 'YYYY年MM月DD日 hh時mm分';
  if (!format) format = 'MM/DD hh:mm';
  format = format.replace(/YYYY/g, date.getFullYear());
  format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
  format = format.replace(/DD/g, ('0' + date.getDate()).slice(-2));
  format = format.replace(/hh/g, ('0' + date.getHours()).slice(-2));
  format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
  format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
  if (format.match(/S/g)) {
    var milliSeconds = ('00' + date.getMilliseconds()).slice(-3);
    var length = format.match(/S/g).length;
    for (var i = 0; i < length; i++) format = format.replace(/S/, milliSeconds.substring(i, i + 1));
  }
  return format;
}
//(カスタム版)
function formatDate(date, format) {
  if (!format) format = 'YYYY年MM月DD日 hh時mm分';
  format = format.replace(/YYYY/g, date.getFullYear());
  format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
  format = format.replace(/DD/g, ('0' + date.getDate()).slice(-2));
  format = format.replace(/hh/g, ('0' + date.getHours()).slice(-2));
  format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
  format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
  if (format.match(/S/g)) {
    var milliSeconds = ('00' + date.getMilliseconds()).slice(-3);
    var length = format.match(/S/g).length;
    for (var i = 0; i < length; i++) format = format.replace(/S/, milliSeconds.substring(i, i + 1));
  }
  return format;
};
/***********************/