class WXGameUtil {

    public static hasGetServerList : boolean = false;//记录是否已经成功获取ServerList
    public static userName : string = "";

    public static severlistCallBack(data:any) {
        var regionlist = data.data.big_region;
        Sdk.is_new = data.data.role_list.length == 0 ? 1 : 0;
        var json =JSON.parse("{ }");
        json.specified = data.data.last_login[0];
        
        var list = new Array();
        for(let i = 0;i<regionlist.length;i++) {
            var index = 1;
            var serlist = data.data.server_list[regionlist[i]];
            for(var k in serlist) {
                var server = JSON.parse("{ }");
                server.code = serlist[k].code;
                server.name = serlist[k].name;
                server.url = serlist[k].ip;
                server.sll_ip = serlist[k].sll_ip;
                list.push(server);
                index++;
            }
        }
        var recent_list = new Array();


         for(let i = 0;i<regionlist.length;i++) {
            var index = 1;
            var serlist = data.data.server_list[regionlist[i]];
            for(var k in serlist) {
                for(let i = 0; i<data.data.role_list.length; i++) {
                    if( data.data.role_list[i].sid == serlist[k].code ) {
                        var server = JSON.parse("{ }");
                        server.code = serlist[k].code;
                        server.name = serlist[k].name;
                        server.url = serlist[k].ip;
                        server.sll_ip = serlist[k].sll_ip;
                        recent_list.push(server);
                    }
                }
            }
        }

        for(let i = 0;i<list.length;i++) {
            if(data.data.last_login[0] == list[i].code) {
                json.specified = i;
            }
        }


        json.list = list;
        json.recent = recent_list;
        Sdk.WXGameServerListJson = json;
        console.log(Sdk.WXGameServerListJson);
        WXGameUtil.hasGetServerList = true;
        EventManager.dispatch(LocalEventEnum.WXGetSeverListSuccess);//如果获取时login界面已经打开，就更新一次界面，如果没打开，就不管，再login界面打开的时候会使用获取的数据
    }



    public static getServerList(callback: Function, target: any, oid: string, gcid:string, uname:string) {
        var timestamp = new Date().getTime().toString();
        var timestamp10 = timestamp.substr(0,10);
        var data = {"action":"get_server",
                    "oid"   : oid,
                    "gcid"  : gcid,
                    "uname" : uname,
                    "time"  : timestamp10,
                    "_"     : timestamp };


        var url = `https://testqyjh5phpapi.yyxxgame.com/`;
        HttpClient.getByUrl(url,callback,target,data);
    }

    public static postStep(callback: Function, target: any, step:string, stepTime:number, oid: string, gcid:string, uname:string) {
        var timestamp = new Date().getTime().toString();
        var timestamp10 = timestamp.substr(0,10);
        var data = {"action":"post_step",
                    "is_new": Sdk.is_new,
                    "one_step_time": stepTime,
                    "oid"   : oid,
                    "gcid"  : gcid,
                    "uid" : uname,
                    "step": step,
                    "time"  : timestamp10,
                    "_"     : timestamp };
        var url = `https://testqyjh5phpapi.yyxxgame.com/`;
        HttpClient.getByUrl(url,callback,target,data);
    }

    public static getOpenId(callback: Function, code : string, oid: string, game_channel_id : string,appid : string,  target: any) {
        var timestamp = new Date().getTime().toString();
        var timestamp10 = timestamp.substr(0,10);
        var data = {"action"         : "check_plat_token",
                    "oid"            : oid,
                    "game_channel_id": game_channel_id,
                    "appid"          : appid,
                    "js_code"        : code,
                    "time"           : timestamp10,
                    "_"              : timestamp 
                   };
        var url = `https://testqyjh5phpapi.yyxxgame.com/`
        HttpClient.getByUrl(url,callback,target,data);
    }

    public static updatePlayer(param: any, callback: Function, target: any, ) {
        var url = `https://testqyjh5phpapi.yyxxgame.com/`
        HttpClient.getByUrl(url, callback, target, param);
    }

    public static loginWX() {
        if(window["platform"]) {
            window["platform"].login();
        }
    }



    //http://fuyaoh5phpapi.yyxxgame.com/?action=get_server&callback=jQuery172045128353458567516_1543374106689&oid=huoshu&gcid=0&uname=x1111d9ccbd3fb6fd3d4de68c5c88c21&time=1543374107&_=1543374106933


}