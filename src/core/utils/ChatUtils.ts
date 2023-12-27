class ChatUtils {
    
    //id最大35 ChatEnum.CHAT_FACE_MAX;  /#[3]{1}[0-5]{1}|#[1-2]{1}[0-9]{1}|#[1-9]{1}/g
    // 最大id35的正则 /^#[3]{1}[0-5]{1}$|^#[1-2]{1}[0-9]{1}$|^#[1-9]{1}$/g;
    //id 最大18  public static FIND_FACE_REG: RegExp = /#[1]{1}[0-8]{1}|#[1-9]{1}/g;
    //id 最大18  public static FACE_ONLY: RegExp = /^#[1]{1}[0-8]{1}$|^#[1-9]{1}$/g; 

    /**全局搜索聊天表情字符串的正则 */
    public static FIND_FACE_REG: RegExp = /#[3]{1}[0-5]{1}|#[1-2]{1}[0-9]{1}|#[1-9]{1}/g; 
    /**字符串是否只包含有效的聊天表情 */
    public static FACE_ONLY: RegExp = /^#[3]{1}[0-5]{1}$|^#[1-2]{1}[0-9]{1}$|^#[1-9]{1}$/g; // 最大id35的正则 /^#[3]{1}[0-5]{1}$|^#[1-2]{1}[0-9]{1}$|^#[1-9]{1}$/g;
    /**聊天坐标 */
    public static POS_REG: RegExp = /<[^<CHAT_]+>/g;
    /**颜色超链接正则 */
    public static FIND_COLOR_TAG: RegExp = /<CHAT_[^<]+>/g;

    /**聊天物品串正则 */
    public static FIND_ITEM_REG: RegExp = /\[[^\[]*?\]/g;
    public static ITEM_ONLY: RegExp = /^\[[^\[]*?\]$/g;
    
    
    /**换行符 */
    public static NEW_LINE_REG: RegExp = /\n|\r|\n\r/g;
    public static COLOR_TAG_REPLACE:RegExp = /<|>/g;

    private static _channelColor: any;
    //private static _homeChannelColor: any;

    private static _chatChanels: any[];

    public static HomeChatItemChanel: number[] = [
        EChatType.EChatTypeWorld,
        EChatType.EChatTypeCamp,
        EChatType.EChatTypeTeam,
        EChatType.EChatTypeGuild,
        EChatType.EChatTypeSystem,
        EChatType.EChatTypeGroup
    ];
    private static _chanelInfos:any[];
    /**聊天界面频道显示顺序 */
    private static _chanelOrder: number[] = [
        EChatType.EChatTypeTotal,        
        EChatType.EChatTypeWorld,
        EChatType.EChatTypeCross,
        EChatType.EChatTypeGuild,
        EChatType.EChatTypeSystem,
        EChatType.EChatTypeTeam,
        EChatType.EChatTypeKF,
    ];

    private static _chanelNameMap: any = {
        [EChatType.EChatTypeTotal]: "综合",
        [EChatType.EChatTypeSystem]: "系统",
        [EChatType.EChatTypeWorld]: "世界",
        [EChatType.EChatTypeCross]: "跨服",
        [EChatType.EChatTypeCrossEx]: "跨服",
        [EChatType.EChatTypeSpace]: "区域",
        [EChatType.EChatTypeTeam]: "组队",
        [EChatType.EChatTypeGuild]: "仙盟",
        [EChatType.EChatTypeTrumpet]: "喇叭",
        [EChatType.EChatTypeKF]: "客服",
        [EChatType.EChatTypePrivate]: "私聊"
    }
    private static notSysBroadChatType:number[] = [
        EChatType.EChatTypeTrumpet,
        EChatType.EChatTypeGuild,
        EChatType.EChatTypeBattleFiled,
        EChatType.EChatTypeCrossEx
    ];

    /**是否聊天表情字符串 */
    public static isFaceStr(src: string): boolean {
        var reg: RegExp = ChatUtils.FACE_ONLY;
        reg.lastIndex = 0;
        var flag: boolean = reg.test(src);
        reg.lastIndex = 0;
        return flag;
    }
    /**是否聊天物品字符串 */
    public static isItemStr(src: string): boolean {
        var reg: RegExp = ChatUtils.ITEM_ONLY;
        reg.lastIndex = 0;
        var flag: boolean = reg.test(src);
        reg.lastIndex = 0;
        return flag;
    }

    /**聊天字符串是否含有物品 */
    public static isHasItemMsg(str: string): boolean {
        ChatUtils.FIND_ITEM_REG.lastIndex = 0;
        var b: boolean = ChatUtils.FIND_ITEM_REG.test(str);
        ChatUtils.FIND_ITEM_REG.lastIndex = 0;
        return b;
    }
    /**
     * 是否有自定义的颜色标签<COLOR>
     */
    public static isHasColorTag(str: string): boolean {
        ChatUtils.FIND_COLOR_TAG.lastIndex = 0;
        var b: boolean = ChatUtils.FIND_COLOR_TAG.test(str);
        ChatUtils.FIND_COLOR_TAG.lastIndex = 0;
        return b;
    }

    public static colorTagToStr(srcMsg: string): string {
        ChatUtils.FIND_COLOR_TAG.lastIndex = 0;
        var excArr: RegExpExecArray = ChatUtils.FIND_COLOR_TAG.exec(srcMsg);
        while (excArr) {
            var tempStr: string = excArr[0];
            tempStr = tempStr.replace(ChatUtils.COLOR_TAG_REPLACE, "");
            var arrStr: string[] = tempStr.split("|");
            srcMsg = srcMsg.replace(excArr[0], arrStr[2]);
            ChatUtils.FIND_COLOR_TAG.lastIndex = 0;
            excArr = ChatUtils.FIND_COLOR_TAG.exec(srcMsg);
        }
        return srcMsg;
    }

    /**
     * 把自定义的<xxx>标签转换成html
     */
    public static fmtColorTag(srcMsg: string, clr: string, fontSize: number,isLink:boolean=true,isText:boolean=false): string {
        var html: string = "";
        ChatUtils.FIND_COLOR_TAG.lastIndex = 0;
        var excArr: RegExpExecArray = ChatUtils.FIND_COLOR_TAG.exec(srcMsg);
        var stIdx: number = 0;
        var tempStr: string;
        while (excArr) {
            tempStr = srcMsg.slice(stIdx, excArr.index);
            html += !isText?HtmlUtil.html(tempStr, clr, false, fontSize):tempStr;
            tempStr = excArr[0];
            stIdx = excArr.index + tempStr.length;
            ChatUtils.FIND_COLOR_TAG.lastIndex = stIdx;
            tempStr = tempStr.replace(ChatUtils.COLOR_TAG_REPLACE, "");
            var arr: string[] = tempStr.split("|");
            var type:string = arr[0];
            var href:string = "";
            var isUnderLine:boolean = false;
            if(!isText){
                if(type!=ChatEnum.CHAT_LINK_COLOR && arr.length>=4 && isLink){ //需要超链接
                    href = type+"|"+arr.slice(3,arr.length).join("|");
                }
                isUnderLine = href!="" && type!=ChatEnum.CHAT_LINK_PLAYER; //人物名称不需要下划线
                html += HtmlUtil.html(arr[2], "#" + arr[1], false, fontSize,href,isUnderLine);
            }else{
                html+=arr[2];
            }            
            excArr = ChatUtils.FIND_COLOR_TAG.exec(srcMsg);
            
        }
        ChatUtils.FIND_COLOR_TAG.lastIndex = 0;
        tempStr = srcMsg.slice(stIdx, srcMsg.length);
        if (tempStr) {
            html += !isText?HtmlUtil.html(tempStr, clr, false, fontSize):tempStr;
        }
        return html;
    }

    /**
     * 获取玩家名
     */
    public static getPlayerName(miniPlayer:any):string{
        let nameStr:string = "";
        if(EntityUtil.isCrossPlayer(miniPlayer.entityId)){
            nameStr = `[${miniPlayer.name_S}S${miniPlayer.entityId.typeEx_SH}]`;
        }else{
            nameStr = `[${miniPlayer.name_S}]`;
        }
        return nameStr;
    }
    
    /**判断聊天数据是否超长 */
    public static isMsgOutLen(str: string): boolean {
        return str.length > ChatCache.MAX_INPUT;
    }

    /**是否聊天坐标串 */
    public static isMsgPosStr(str: string): boolean {
        ChatUtils.POS_REG.lastIndex = 0;
        var b: boolean = ChatUtils.POS_REG.test(str);
        ChatUtils.POS_REG.lastIndex = 0;
        return b;
    }

    /**去掉换行符 */
    public static stripMsg(tarStr: string): string {
        tarStr = tarStr.replace(ChatUtils.NEW_LINE_REG, "");
        return tarStr;
    }
    /**
     * 检查发送的非法字符
     */
    public static checkSendMsg(msg: string,repaceChar:string="*"): string {
        msg = ChatUtils.stripMsg(msg);
        //不让玩家主动发 <>|\/
        msg = msg.replace(/\<|\>|\||\\|\//g,repaceChar);       
        return msg;
    }

    /**
     * 检查聊天频道发送的内容里 物品链接是否有效
     * @param content  要发送的聊天内容
     * @param chatType 聊天频道
     */
    public static checkContentItem(content: string, chatType: number): void {
        //检查物品
        var itemIdx: number = 0;
        var chatMsgArr: string[] = App.StringUtils.anlysisMsg(content, ChatUtils.FIND_ITEM_REG);
        for (var i: number = 0; i < chatMsgArr.length; i++) {
            var msg: string = chatMsgArr[i];
            if (ChatUtils.isItemStr(msg)) {
                var f: boolean = CacheManager.chat.compChanelItem(msg.slice(1, msg.length - 1), chatType, itemIdx);
                !f ? itemIdx++ : null;
            }
        }
    }
    public static getChatTypeIndex(chatType:number):number{
        return ChatUtils._chanelOrder.indexOf(chatType);
    }
    
    /**获取主界面所有频道 */
    public static getChatChanels(): number[] {
        return ChatUtils._chanelOrder;
    }
    public static getChatChanelInfos():any[]{
        if(!ChatUtils._chanelInfos){
            ChatUtils._chanelInfos = [];
            for(let i:number = 0;i<ChatUtils._chanelOrder.length;i++){
                if(ChatUtils._chanelOrder[i] == EChatType.EChatTypeKF) {
                    if(Sdk.platform_config_data.is_close_cs) {
                        continue;
                    }
                }
                ChatUtils._chanelInfos.push({label:ChatUtils.getChanelName(ChatUtils._chanelOrder[i]),chanel:ChatUtils._chanelOrder[i]});
            }
        }
        
        return ChatUtils._chanelInfos;
    }
    /**获取频道中文名 */
    public static getChanelName(chanel: number): string {
        return ChatUtils._chanelNameMap[chanel];
    }

    /**
     * 获取频道颜色
     */
    public static getChatChanelColor(chanel: number,isBgImg:boolean): string {
        if (!ChatUtils._channelColor) {
            ChatUtils._channelColor = {};
            ChatUtils._channelColor[EChatType.EChatTypeSystem] = Color.BASIC_COLOR_3; //系统
            ChatUtils._channelColor[EChatType.EChatTypeCrossEx] = Color.BASIC_COLOR_3; //
            ChatUtils._channelColor[EChatType.EChatTypeGuild] = "#f2e1c0"; //
            ChatUtils._channelColor[EChatType.EChatTypeTeam] = "#f2e1c0"; //组队           
            ChatUtils._channelColor[EChatType.EChatTypeWorld] = "#f2e1c0"; //世界          
            ChatUtils._channelColor[EChatType.EChatTypeCross] = "#f2e1c0"; //跨服          
        }
        var color:string = "#2f1603"; // isBgImg为true表示有聊天头像 有聊天气泡 固定颜色
        if(!isBgImg && ChatUtils._channelColor[chanel]){
            color = ChatUtils._channelColor[chanel];
        }
        return color;
    }
    /*
    public static getHomeChanelColor(chanel: number):string{
        if(!ChatUtils._homeChannelColor){
            ChatUtils._homeChannelColor = {};
            ChatUtils._homeChannelColor[EChatType.EChatTypeSystem] = "#ffffff";
            ChatUtils._homeChannelColor[EChatType.EChatTypeGroup] = "#ffffff";
            ChatUtils._homeChannelColor[EChatType.EChatTypeGuild] = Color.BASIC_COLOR_3;
            ChatUtils._homeChannelColor[EChatType.EChatTypeWorld] = "#ffaa00";
            ChatUtils._homeChannelColor[EChatType.EChatTypeTrumpet] = "#ffff33";
            ChatUtils._homeChannelColor[EChatType.EChatTypeTeam] = "#00eeff";
        }
        return ChatUtils._homeChannelColor[chanel];
    }
    */
    public static isCanInputShow(chanel: number): boolean {
        var flag: boolean = true;
        switch (chanel) {
            //case EChatType.EChatTypeTotal:
            case EChatType.EChatTypeSystem:
                flag = false;
                break;
        }
        return flag;
    }
    /**
     * SPublicNotice转成SChatMsg 需要先执行 ChatUtils.fmtBroadMsg再执行该函数
     */
    public static noticeToChatMsg(sPublicNotice: any): SChatMsg {
        var msg: SChatMsg = new SChatMsg();
        msg.content_S = sPublicNotice.content_S;
        let isNotSys:boolean = ChatUtils.notSysBroadChatType.indexOf(sPublicNotice.type_I)>-1;
        msg.chatType_I = isNotSys?sPublicNotice.type_I:EChatType.EChatTypeSystem; //        
        msg.chatDt = CacheManager.serverTime.getServerTime();
        return msg;
    }

    /**
     * 格式化广播内容(并非可以直接显示的内容)
     * SPublicNotice
     */
    public static fmtBroadMsg(msgObj: any): any {
        var msg: string = "";
        if (!msgObj.content_S) { //服务器返回的内容是空的 则从广播表找内容
            if (msgObj.msgKey_S) { 
                var inf: any = ConfigManager.propertiesMsg.getByPk(msgObj.msgKey_S);
                if(!inf)  {
                    Log.trace(Log.SERR,"广播配置错误t_properties_message",msgObj.msgKey_S);
                    return msgObj;
                }
                msg = inf.msgValue;
                var params: string[] = msgObj.params.data_S;
                msg = ChatUtils.fillParam(msg, params);
                msgObj.content_S = ChatUtils.transMsgObj(msg, msgObj);
            }
        } else {
            msgObj.content_S = ChatUtils.stripMsg(msgObj.content_S);
        }
        return msgObj;
    }
    public static fillParam(msg: string, param: string[]): string {
        var reg: RegExp = /{\$\d}/;
        if (msg && param && param.length > 0) {
            for (var i: number = 0; i < param.length; i++) {
                msg = msg.replace("{$" + (i + 1) + "}", param[i]);
            }
        }
        return msg;
    }

    /**
     * 格式化<MsgObj></MsgObj> 标签内容
     */
    public static transMsgObj(msg: string, msgObj: any): string {
        var retMsg: string = "";
        var reg: RegExp = /<MsgObj>[^<]+<\/MsgObj>/g;
        var excArr: RegExpExecArray = reg.exec(msg);
        while (excArr) {
            var msgObjStr: string = excArr[0];
            var tRet: string = ChatUtils.dealTransfer(msgObjStr, msgObj);
            msg = msg.replace(msgObjStr, tRet);
            reg.lastIndex = 0;
            excArr = reg.exec(msg);
        }
        return msg;
    }
    /**
     * 开始替换<MsgObj></MsgObj> 标签内容
     */
    public static dealTransfer(msg: string, msgObj: any): string {
        var playerArr: any[] = msgObj.publicMiniplayers.data;
        msg = msg.replace("<MsgObj>", "");
        msg = msg.replace("</MsgObj>", "");
//ITEM,11015110,{"best":[150330001,150510400,150530800],"hole":null,"jewelRefLv":0,"jewleRefExp":0,"lucky":4402,"refresh":null,"scoreBase":93302,"strengthen":39,"suit":null}

        var msgArr: string[] = msg.split(","); 
        var type: string = msgArr[0];
        let mId:number = ModuleEnum[type];
        if(mId){ //模块id；配置例子: <MsgObj>Forge,Immortals,激活神兵</MsgObj> 有指定标签;或 <MsgObj>Forge,我要炼器</MsgObj> 无指定标签
            let infos:string[]= msgArr.slice(0,msgArr.length-1);
            let href:string = `${mId}`;
            if(infos.length>1 && PanelTabType[infos[1]]){
                let tabType:number = PanelTabType[infos[1]];
                href+="|"+tabType;
            }
            let text:string = msgArr[msgArr.length-1]; //最后一个参数必定是链接文本
            msg = ChatUtils.transOpenModule(text,href);
            return msg; 
        }
        switch (type) {
            case "PLAYER":
                msg = ChatUtils.transPlayer(msgArr, msgObj);
                break;
            case "COLOR":
                msg = ChatUtils.transColor(msgArr, msgObj);
                break;
            case "ITEM":
                var idx:number = msg.indexOf("{");
                var js:string = "";
                if(idx>-1){
                    js = msg.slice(idx,msg.length);
                }
                msgArr.length = 3;
                msgArr[2] = js.replace("\n","");
                msg = ChatUtils.transItem(msgArr, msgObj);
                break;
            case "BOSS_SYSTEM":
                msg = ChatUtils.transBossSys(msgArr,msgObj);
                break;
            case "GUILD":
                msg = ChatUtils.transGuild(msgArr,msgObj);
                break;
            case "FASTAPPLYTOGUILD":                
                msg = ChatUtils.transApplyGuild(msgArr,msgObj);
                break;
            case "GUILD_VIEN": //公会心法
                var href:string = `${ModuleEnum.Guild}|2`;
                msg = ChatUtils.transOpenModule(msgArr[1],href);
                break;
            case "APPLYGUOUP":
                msg = ChatUtils.transApplyTeam(msgArr,msgObj);
                break;            
            case "CROSSTEAM":
                msg = ChatUtils.transApplyCrossTeam(msgArr,msgObj);
                break;
            case "RUNELOTTERY":
                break;
            case "LOTTERY":
                var href:string = `${ModuleEnum.Lottery}`;
                msg = ChatUtils.transOpenModule(msgArr[1],href);
                break;
            case "COLOR_LABEL":
                msg = HtmlUtil.html(msgArr[1],Color["BASIC_COLOR_"+msgArr[2]]);
                break;
            case "CROSSBOSSFIELD":
                msg = ChatUtils.transCrossBoss(msgArr,msgObj);
                break;
            case "GAMEPLAY":
                msg = ChatUtils.transGamePlay(msgArr);
                break;
            case "FAKERECHARGE":
                msg = ChatUtils.makeColorLink(ChatEnum.CHAT_FAKE_RECHARGE,Color.getRumor('2'),msgArr[1],"fake");
                break;
            case "GOLDCARD":
                msg = ChatUtils.makeColorLink(ChatEnum.CHAT_GOLDCARD_OPEN,Color.getRumor('2'),msgArr[1],"fake");
                break;
            case "PRIVILEGECARD":
                msg = ChatUtils.makeColorLink(ChatEnum.CHAT_PRIVILEGECARD_OPEN,Color.getRumor('2'),msgArr[1],"fake");
                break;
            case "COPYASSIST":
                let text:string = msgArr[msgArr.length-1]; //最后一个参数必定是链接文本
                msg = ChatUtils.makeColorLink(ChatEnum.CHAT_COPY_ASSIT,Color.getRumor('2'),text,msgArr[1]+"|"+msgArr[2]);
                break;
        }
        return msg;
    }

    public static transPlayer(msgArr: string[], msgObj: any): string {
        var msg: string = "";
        var idx: number = Number(msgArr[1]);
        var player: any = msgObj.publicMiniplayers.data[idx];
        var clr: string = Color.getRumor('11');
        let extParam:string = msgArr[2];
        var href:string = ChatUtils.entityIdToStr(player.entityId,(extParam?[extParam]:null));
        let ns:string = ChatUtils.getPlayerName(player);
        msg = ChatUtils.makeColorLink(ChatEnum.CHAT_LINK_PLAYER,clr,ns,href);
        return msg;
    }

    public static transColor(msgArr: string[], msgObj: any): string {
        var msg: string = "";
        var clr: string = Color.getRumor(msgArr[1]);
        msg = ChatUtils.makeColorLink(ChatEnum.CHAT_LINK_COLOR,clr, msgArr[2]);
        return msg;
    }
    public static transItem(msgArr: string[], msgObj: any): string {
        var msg: string = "";
        var itemCode: number = Number(msgArr[1]);
        let itemData:ItemData = new ItemData(itemCode);
        var itemInfo: any = itemData.getItemInfo(); //ConfigManager.item.getByPk(itemCode);
        var clr: string = Color.getItemColr("" + itemInfo.color);
        var href:string = `0|0|${itemCode}|${itemInfo.type}|1|${msgArr[2]}`;
        let isShowLv:boolean = ItemsUtil.isEquipItem(itemData) && itemData.getType()!=EEquip.EEquipKill; 
        let nameStr:string = itemInfo.name + (isShowLv?"("+WeaponUtil.getEquipLevelText(itemData,false)+")":"");
        msg = ChatUtils.makeColorLink(ChatEnum.CHAT_LINK_ITEM,clr,nameStr,href);
        return msg;
    }

    public static transBossSys(msgArr: string[], msgObj: any):string{
        var msg: string = "";
        /*
        var copy_code:number = Number(msgArr[1])
		var map_id:number = Number(msgArr[2])
		var boss_code:number = Number(msgArr[3])
        */
        var clr: string = Color.getRumor('2');
		var link_label_text:string = msgArr[4];
        var href:string = msgArr.slice(1,4).join("|"); //copy_code map_id boss_code
        msg = ChatUtils.makeColorLink(ChatEnum.CHAT_LINK_BOSS,clr,link_label_text,href);
        return msg;
    }

    /**获取一个随机名字 */
    public static getRandomName():string{        
        return App.RandomUtils.randomArray(RandName.firstNames) + App.RandomUtils.randomArray(RandName.secondWoman0) + App.RandomUtils.randomArray(RandName.secondWoman1);
    }

    public static getBroadRomName(checkSelf:boolean=true):string{
        let rName:string = ChatUtils.getRandomName();
        if(checkSelf){
            while(CacheManager.role.entityInfo && rName==CacheManager.role.entityInfo.name_S){
                rName = ChatUtils.getRandomName();
            }
        }        
        return rName;
    }

    /**获取伪造的充值礼包广播消息 */
    public static getFakeRechargeMsg(romName:string):any{
        let link:string = ChatUtils.makeColorLink(ChatEnum.CHAT_FAKE_RECHARGE,Color.getRumor('2'),"领取礼包","fake");        
        let name:string = HtmlUtil.html(`[${romName}]`,Color.getRumor('11'));       
        let content:string = App.StringUtils.substitude(LangVip.LANG13,name,HtmlUtil.html(`18888元宝`,Color.getRumor('6')),HtmlUtil.html(`首充礼包`,Color.getRumor('4')),link);
        //显示在跑马灯
        let msg:any = ChatUtils.getSPublicNotice(EChatType.EChatTypeSystem,1 | EShowArea.EShowAreaMiddle,content);
        return msg;
    }
    /**获取伪造的VIP广播消息 */
    public static getFakeVIPMsg(romName:string):any{
        let name:string = HtmlUtil.html(`[${romName}]`,Color.getRumor('11'));       
        let vip:string = ChatUtils.makeColorLink(ChatEnum.CHAT_NONE,Color.getRumor('7'),"VIP1",""); 
        let content:string = App.StringUtils.substitude(LangVip.LANG14,name,vip);
        //显示在场景广播
        let msg:any = ChatUtils.getSPublicNotice(EChatType.EChatTypeSystem,1 | EShowArea.EShowAreaMiddleTop,content);        
        return msg;
    }
    
    /**播放假的VIP广播 */
    public static fakeVIPBroad():void{
        let romName:string = ChatUtils.getBroadRomName();
        EventManager.dispatch(LocalEventEnum.ShowBroad, ChatUtils.getFakeVIPMsg(romName)); 
        EventManager.dispatch(LocalEventEnum.ShowBroad, ChatUtils.getFakeRechargeMsg(romName)); 
    }

    /**SPublicNotice */
    public static getSPublicNotice(type:number,area:number,content:string,crossFlag:boolean=false,msgKey:string=""):any{
        let msg:any = {};
        msg.type_I = type;//EChatType.EChatTypeSystem;
        msg.area_I = area;//EChatType.EChatTypeSystem;
        msg.crossFlag_B = crossFlag;
        msg.msgKey_S = msgKey;       
        msg.content_S = content;
        msg.params = {};
        msg.isFake = true;
        return msg;
    }

    public static transGuild(msgArr: string[], msgObj: any):string{
        var msg: string = "";
        //0代表新建盟广播， 1代表普通广播
        var type:string = msgArr[1];
        var clr: string = Color.getRumor('2');
        var guildName:string = "";
        if(typeof(msgArr[3])=="string"){
            guildName = msgArr[3];
        }
        msg = ChatUtils.makeColorLink(ChatEnum.CHAT_LINK_COLOR,clr,guildName,"");
        return msg;
    }

    public static transApplyGuild(msgArr: string[], msgObj: any):string{
        var msg: string = "";
        var clr: string = Color.getRumor('2');        
        var str:string = msgArr[3]
        var href:string = msgArr.slice(1,3).join("|");
        msg = ChatUtils.makeColorLink(ChatEnum.CHAT_LINK_APPLY_GUILD,clr,str,href);
        return msg;
    }

    public static transApplyTeam(msgArr: string[], msgObj: any):string{
        var msg: string = "";
        var clr: string = Color.getRumor('2');
        var str: string = msgArr[6];
        var href:string = msgArr.slice(1,6).join("|");
        msg = ChatUtils.makeColorLink(ChatEnum.CHAT_LINK_APPLY_TEAM,clr,str,href);
        return msg;
    }

    /**
     * 打开跨服组队界面，然后发送加入
     * @param {string[]} msgArr
     * @param msgObj
     * @returns {string}
     */
    public static transApplyCrossTeam(msgArr: string[], msgObj: any):string{
        var msg: string = "";
        var clr: string = Color.getRumor('2');
        var str: string = msgArr[6];
        var href:string = msgArr.slice(1,6).join("|");
        msg = ChatUtils.makeColorLink(ChatEnum.CHAT_LINK_APPLY_TEAM_CROSS,clr,str,href);
        return msg;
    }

    public static transGamePlay(msgArr: string[]):string {
        let color: string = Color.getRumor('2');
        return ChatUtils.makeColorLink(ChatEnum.CHAT_GAME_PLAY_OPEN,color,msgArr[1],msgArr[2]);
    }

    /**
     * 参数1、type  2、bossCode 3、proxyId  4、serverId  5、mapName
     */
    public static transCrossBoss(msgArr: string[], msgObj: any):string{
        let msg: string = "";
        let clr: string = Color.getStColor(6);
        let serverId: string =  "";
        let mapName: string = msgArr[5];
        let localLevel:string = "";
        let field:ECrossBossField = Number(msgArr[1]);
        if (field == ECrossBossField.LOCAL) {
            let gameBossInf:any = ConfigManager.mgGameBoss.getByPk(msgArr[2]);
            if (gameBossInf && gameBossInf.roleState) {
                let lvl:number = CacheManager.crossBoss.getLocalLevel(gameBossInf.roleState);
                localLevel = App.StringUtils.substitude(LangCrossBoss.LANG12, GameDef.NumberName[lvl]);
            }
        } else if (field == ECrossBossField.CROSS) {
            serverId = LangCrossBoss.LANG20;
        } else if (field == ECrossBossField.CROSSEx) {
            let gameBossInf:any = ConfigManager.mgGameBoss.getByPk(msgArr[2]);
            serverId = LangCrossBoss["LANG" + (20 + gameBossInf.index)];
        } else {
            serverId = `S${msgArr[4]}`;
        }
        msg = HtmlUtil.html(serverId + mapName + localLevel, clr);
        return msg;
    }

    public static transOpenModule(linkText:string,href:string,clr:string=""):string{
        var msg: string = "";
        clr = clr ||  Color.getRumor('2');                
        msg = ChatUtils.makeColorLink(ChatEnum.CHAT_LINK_OPEN_MODULE,clr,linkText,href);
        return msg;
    }

    public static makeColorLink(linkType:string,clr: string, msg: string,href:string=""): string {
        clr = clr.slice(1, clr.length);
        href?href = "|"+href:href = "";
        msg = `<${linkType}|${clr}|${msg}${href}>`;
        return msg;
    }
    /**
     * SEntityId转换成字符串
     */
    public static entityIdToStr(entityId:any,extStrs:string[]=null):string{
        //SEntityId type_BY
        let str:string = `${entityId.id_I}|${entityId.typeEx_SH}|${entityId.typeEx2_BY}|${entityId.type_BY}`;
        if(extStrs&&extStrs.length>0){ //额外参数
            str+="|"+extStrs.join("|");
        }
        return str;
    }

    public static strToEntityId(str:string):any{
        let arr:string[] = str.split("|");
        let entityId:any = {id_I:Number(arr[0]),typeEx_SH:Number(arr[1]),typeEx2_BY:Number(arr[2]),type_BY:Number(arr[3])};
        let ret:any = {toEntityId:entityId};
        if(arr[4]){ //解析额外参数
            ret.from = arr[4];
        }
        return ret;
    }

    public static isSysChanel(msg:SChatMsg):boolean{
       return msg.chatType_I == EChatType.EChatTypeSystem;
    }

    /**是否显示组队频道 */
    public static isShowTeamChanel():boolean{
        return CacheManager.team2.hasTeam;
    }

    /**申请组队的统一处理 */
    public static applyTeam(copyCode:number,groupId:any):void{
        let copyCfg:any = ConfigManager.copy.getByPk(copyCode);
        if(copyCfg.copyType == ECopyType.ECopyCrossTeam) {
            EventManager.dispatch(UIEventEnum.ModuleOpen,ModuleEnum.CopyHall,{tabType:PanelTabType.Team2, copyCode:copyCode});
        }
        else if(copyCfg.copyType == ECopyType.ECopyGuildTeam) {
            EventManager.dispatch(UIEventEnum.ModuleOpen,ModuleEnum.GuildCopy,{tabType:PanelTabType.GuildTeam, copyCode:copyCode});
        }
        if (CacheManager.team2.checkHasOtherCrossTeam(copyCode, ()=>{
            EventManager.dispatch(LocalEventEnum.ApplyEnterTeamCross,copyCode,groupId);
        })) return;				
        EventManager.dispatch(LocalEventEnum.ApplyEnterTeamCross,copyCode,groupId);
    }

}