var browserType = navigator.userAgent.toLowerCase().match(/msie ([\d.]+)/);
if (browserType) {
    window.location.href = "error.html";
}
//未登录进行登录
if(!window.localStorage.getItem("rxUserId")){
	var curhref=window.location.href;
	if(curhref.indexOf("login.html")>-1||curhref.indexOf("registered.html")>-1||curhref.indexOf("retrievepwd.html")>-1||curhref.indexOf("retrievePassword.html")>-1){
		//注册 找回密码  充值密码不调整
	}else{
		window.location.href="login.html";
	}
}
