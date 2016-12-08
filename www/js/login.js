
function newUserPage(){
  myNavigator.pushPage('page/login/user-regi.html');
}
function modoru1(){
  myNavigator.popPage();
}
function modoru2(){
  myNavigator.pushPage('page/login/pw-remake.html');
}
function modoru3(){
  myNavigator.pushPage('page/login/login.html');
}

function Login() {
  
  var email = $("#inputEmail").val();
  var password = $("#inputPassword").val();
   var data = {
    email:email,
    password:password,
    mock:false
  };

  var res = $.ajax({
    type: "POST",
    url: _domain+"/user.php?get1=login",
    data:data,
    async: false,
    success: function (msg) {
      if(msg.result === "true"){
        myNavigator.replacePage("splitter.html",{animation:"fade"}).then(function(){
            ons.ready(function(){
                user.user_id = msg.user_id;
                user.session_id = msg.session_id;
                user.region = msg.regions;
                console.log(user.user_id)
                $("#main-myname").html(msg.fullname);
                bbsList();
            })
        })
      }else{
        ons.notification.alert({
          title:"ログインに失敗しました",
          message:"入力情報をご確認ください。",
          animation:"default"
        });
      }
    }
  })
  /*console.log(res.responseText);
  var data = JSON.parse(res.responseText);
  console.log(data);
  if(data.result === "true"){
    var t_user;
    t_user.user_id = res.user_id;
    t_user.session_id = res.session_id;
    t_user.regions = res.regions;
    return user = t_user;
  }*/
}

/*function newlogin() {
  var name = $("#input-name").val();
  var email = $("#input-Email").val();
  var password = $("#input-Password").val();
  var tel = $("#input-tel").val();
   var sendData = {
    fullname:name,
    email:email,
    password:password,
    tel:tel,
    image:"image.jpg",
    google_id:"",
    facebook_id:"",
    twitter_id:""
  };
  $.ajax({
    type: "POST",
    url: _domain+"/user.php?type=tmpuser_regi",
    data:sendData,
    success: function (msg) {
      if(msg.result=="true"){
        myNavigator.replacePage("splitter.html",{animation:"fade"}).then(function(){
            ons.ready(function(){
                $("#main-myname").html(msg.fullname);
                bbsList();
            })
        })
      }else{
        alert("ログイン失敗");
      }
    }
  });
}*/

//仮登録
function register_send() {
  var name = $("#input-name").val();
  var email = $("#input-Email").val();
  var password = $("#input-Password").val();
  var tel = $("#input-tel").val();
   var sendData = {
    fullname:name,
    email:email,
    password:password,
    tel:tel,
    image:"image.jpg",
  };
  $.ajax({
    type: "POST",
    url: _domain+"/user.php?get1=tmpuser_regi",
    data:sendData,
    success: function (msg) {
      if(msg['result'] == "true"){
        ons.notification.alert({
          title:"仮登録が完了しました。",
          message:"入力されたメールアドレスに本登録用URLを送信しましたのでご確認ください。"
        });
      }else{
        ons.notification.alert({
          title:"仮登録失敗",
          message:"入力内容をご確認ください。"
        });
        
      }
    },
    error:function(xhr,status,error){
        
        //ons.notificationはアラートテンプレをHTML分離することもできるしjsのみで簡潔することもできる。
          ons.notification.alert({
            title:"登録失敗",
            message: 'もう一度適切な値にしてやり直してみてください・・・'
          });
        console.log("error occurred...")
        console.log(xhr);
        console.log(status);
        console.log(error);
    }
  });
}



function getPhoto() {
  //Specify the source to get the photos.
  navigator.camera.getPicture(onSuccess, onFail,
          {quality: 50, destinationType: Camera.DestinationType.FILE_URL,allowEdit: true,
            sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY, });
document.getElementById("dialog-2.html").hide();
}
function getPhoto2() {
  //Specify the source to get the photos.
  navigator.camera.getPicture(onSuccess, onFail,
          {quality: 50, destinationType: Camera.DestinationType.FILE_URL,
            sourceType: navigator.camera.PictureSourceType.CAMERA, });
document.getElementById("dialog-2.html").hide();
}

function onSuccess(imageURI) {
  //    alert('An error occured: ' + imageURI);
  var largeImage = document.getElementById('image');
  largeImage.src = imageURI;
}

function onFail(message) {
  console.log("選択無し")
}

function showDialog(id) {
  document.getElementById(id).show();
}
function kiyaku(){
  //console.log(this.val());
        var options = {animation: 'slide'} // Called when finishing transition animation
  myNavigator.pushPage("page/login/Terms.html");
}



