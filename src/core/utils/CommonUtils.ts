/**
 * 通用工具类
 */
class CommonUtils extends BaseClass {
    public static redPointName:string = "__redPointImg__";
    public constructor() {
        super();
    }

    /**
     * 深度复制
     * @param _data
     */
    public static copyDataHandler(obj:any):any {
        var newObj;
        if (obj instanceof Array) {
            newObj = [];
        }
        else if (obj instanceof Object) {
            newObj = {};
        }
        else {
            return obj;
        }
        var keys = Object.keys(obj);
        for (var i:number = 0, len = keys.length; i < len; i++) {
            var key = keys[i];
            newObj[key] = this.copyDataHandler(obj[key]);
        }
        return newObj;
    }

    /**
     * 锁屏
     */
    public static lock():void {
        // App.StageUtils.getStage().touchEnabled = App.StageUtils.getStage().touchChildren = false;
        let stage: egret.Stage = App.StageUtils.getStage();
        stage.touchEnabled = false;

        // stage.$children.forEach(child => {
        //     if (child instanceof egret.DisplayObjectContainer) {
        //         child.touchEnabled = child.touchChildren = false;
        //     }
        // });
    }

    /**
     * 解屏
     */
    public static unlock():void {
        // App.StageUtils.getStage().touchEnabled = App.StageUtils.getStage().touchChildren = true;
        let stage: egret.Stage = App.StageUtils.getStage();
        stage.touchEnabled = true;

        // stage.$children.forEach(child => {
        //     if (child instanceof egret.DisplayObjectContainer) {
        //         child.touchEnabled = child.touchChildren = true;
        //     }
        // });
    }

    /**
     * 万字的显示
     * @param label
     * @param num
     */
    public static labelIsOverLenght = function (label, num) {
        var str = null;
        if (num < 100000) {
            str = num;
        }
        else if (num < 1000000) {
            str = Math.floor(num / 1000 / 10).toString() + "万";
        }
        else {
            str = Math.floor(num / 10000).toString() + "万";
        }
        label.text = str;
    };

    /**
     * int64转number
     * @param obj
     * @returns {number}
     */
    public static int64ToNumber(obj) {
        return parseInt(obj.toString());
    }

    

    /**获取价格类型中文名称 */
    public static getPriceName(type:number):string{
        var nameStr:string = "金钱";
        switch(type){
            case EPriceUnit.EPriceUnitCoinBind:
                nameStr = "银两";
                break;
            case EPriceUnit.EPriceUnitGold:
                nameStr = "元宝";
                break;
            case EPriceUnit.EPriceUnitGoldBind:
                nameStr = "绑元";
                break;
        }
        return nameStr; 
    }

    /**
     * 判断某种货币是否足够
     * 
     */
    public static isPriceEnough(needNum:number,type:EPriceUnit,isShowTips:boolean=true):boolean{
        var total:number = CommonUtils.getPriceCount(type);
        var isEnough:boolean = total>=needNum;
        if(!isEnough && isShowTips ){
            CommonUtils.showPriceTip(type);
        }
        return isEnough; 
    }
    /**
     * 获取某种货币的数量
     */
    public static getPriceCount(type:EPriceUnit):number{
        var total:number = 0;
        switch(type){
            case EPriceUnit.EPriceUnitCoinBind:
                total = CacheManager.role.money.coinBind_L64;
                break;
            case EPriceUnit.EPriceUnitGold:
                total = CacheManager.role.money.gold_I;
                break;
            case EPriceUnit.EPriceUnitGoldBind:
                total = CacheManager.role.money.goldBind_I;
                break;
        }
        return total;
    }

    /**
     * 判断元宝是否足够(可以计算包括绑元)
     * @param isBindCheck 是否包括绑元
     * @param showTip 元宝不足时 是否飘提示
     */
    public static isGoldEnough(needNum:number,isBindCheck:boolean=true,showTip:boolean=true):boolean{
        var ret:boolean = false;
        var total:number = CommonUtils.getPriceCount(EPriceUnit.EPriceUnitGold);
        if(isBindCheck){
            total += CommonUtils.getPriceCount(EPriceUnit.EPriceUnitGoldBind);
        }
        ret = total>=needNum;
        if(!ret && showTip){
            CommonUtils.showPriceTip(EPriceUnit.EPriceUnitGold);
        }
        return ret;
    }

    /**
     * 飘一个货币不足的提示
     */
    public static showPriceTip(type:EPriceUnit):void{
        var priceName:string = CommonUtils.getPriceName(type);
        Tip.showTip("你的"+priceName+"不足");
    }

    /**
     * 把配置字符串转换成数组 (例如奖励字符串:41950001#)
     * @param isItem true 的话 默认返回 <ItemData>[]    
     */
    public static configStrToArr(rewardStr:string,isItem:Boolean=true,split:string="#"):Array<any> {
        let numStrArr:string[] = rewardStr.split(split);        
        let endLen:number = numStrArr.length;
        let results:any[] = [];
        for(let i:number = 0; i < endLen; i++){           
            if(numStrArr[i]==""){
                continue;
            } 
            if(isItem) {
                let code:number;
                let count:number;
                if(numStrArr[i].indexOf(",") != -1) {
                    let itemArr:string[] = numStrArr[i].split(",");
                    code = Number(itemArr[0]);
                    count = Number(itemArr[1]);
                }
                else {
                    code = Number(numStrArr[i]);
                    count = 1;
                }
                let itemData:ItemData = new ItemData(code);
                itemData.itemAmount = count;
                results.push(itemData);                
            } else {
                results.push(numStrArr[i]);
            }
            
        }
        return results;
    }

    /**
     * 获取属性中文名
     * @param type 属性类型枚举
     */
    public static getAttrName(type:number,idx:number = 0):string{
        return GameDef.EJewelName[type][idx];
    }
    /** 根据数字获取中文数字 */
    public static getNumName(num:number):string{
        return GameDef.NumberName[num];
    }

    /**
     * 设置一个按钮红点提示
     * @param btn
     * @param isTips
     * @param isTopLayer 是否在按钮的最上层(按钮文本没有被红点挡住的话不需要设置为true 可以减少drawCall)
     * @param posPoint 自定义红点的位置
     */
   public static setBtnTips(btn:fairygui.GComponent,isTips:boolean,posX:number=null,posY:number=null,isTopLayer:boolean=true):void{
       if(btn){
           if(btn instanceof BaseTipButton){
               (<BaseTipButton>btn).tip = isTips;
           }else{
               var imgKey:string = CommonUtils.redPointName;
               var redPoint:fairygui.GObject;
               if(isTips){
                   redPoint = btn.getChild(imgKey);
                   if(redPoint){
                       return;
                   }
                   redPoint = GUIUtils.getRedTips(btn);
                   redPoint.name = imgKey;
                   btn.addChild(redPoint);
                   var px:number = posX!=null?posX:btn.width-redPoint.width;
                   var py:number = posY!=null?posY:0;                                      
                   redPoint.x = px;
                   redPoint.y = py;
                   if(!isTopLayer){
                       var title:fairygui.GObject = btn.getChild("title");
                        if(title){
                            btn.setChildIndex(title,btn.numChildren-1);
                        }
                   }
                   
               }else{
                   redPoint = btn.getChild(imgKey);
                   if(redPoint){
                       btn.removeChild(redPoint);
                   }
               }
           }
       }
   }
    

}
