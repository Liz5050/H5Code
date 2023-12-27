class CookieManager {
    public constructor(){
    }

    static setCookie(name,value,expiredays=30)
    {
        var exp = new Date();
        exp.setTime(exp.getTime() + expiredays*24*60*60*1000);
        document.cookie = name + "="+ encodeURI(value) + ";expires=" + exp.toUTCString();
    }

    //读cookies
    static getCookie(name)
    {
        var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
        if(arr=document.cookie.match(reg))
            return decodeURI(arr[2]);
        else
            return null;
    }

    //删cookies
    static delCookie(name)
    {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval=CookieManager.getCookie(name);
        if(cval!=null)
            document.cookie= name + "="+cval+";expires="+exp.toUTCString();
    }

}