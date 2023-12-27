/**
 * 资源获取统一提示模块
 */
class TipController extends BaseController {

    private static packNoTipUpdateCodes: number[] = [1479, 361];
    private static expNoTipUpdateCodes: number[] = [1479, 1620];
    private expTxt: fairygui.GTextField;
    private maxSize = 50;

    public constructor() {
        super(ModuleEnum.Tip);
    }

    public addListenerOnInit(): void {
        this.addListen0(NetEventEnum.packBackAddItem, this.onPackBackAddItem, this);
        this.addListen0(NetEventEnum.roleExpAdd, this.onRoleExpAdd, this);
        this.addListen0(NetEventEnum.propertyUpgrade, this.onRoleAttrUpgrade, this);//人物属性提升
        this.addListen0(NetEventEnum.moenyAdd, this.onMoneyAdd, this);//金钱增加
    }

    /**
     * 获得了物品
     * @param itemAmount 增加的数量
     * @param updateCode 更新原因
     */
    private onPackBackAddItem(itemData: ItemData, itemAmount: number, updateCode: number): void {
        if((CacheManager.map.isInMainCity && updateCode == 361) || TipController.packNoTipUpdateCodes.indexOf(updateCode) == -1) {
            if (itemData) {
                let type: EProp = itemData.getType();
                if (type == EProp.EPropGold || type == EProp.EPropCoinBind) {
                    this.onMoneyAdd(MoneyUtil.getMoneyNameByEProp(type), itemAmount, -1);
                }
                else {
                    let tips: Array<string> = [];
                    let name: string = itemData.getName();
                    if (itemData.isExpand) {//需要展开
                        for (let i: number = 0; i < itemAmount; i++) {
                            if (tips.length >= this.maxSize) {
                                break;
                            }
                            tips.push(`获得${itemData.getColorString(name + " x 1")}`);
                        }
                    } else {
                        tips.push(`获得${itemData.getColorString(name + " x " + itemAmount)}`);
                    }
                
                    if(ConfigManager.updateCode.isDelayTipCode(updateCode)){
                        let delayMs:number = ConfigManager.updateCode.getDelayTipsCodesMs(updateCode);
                        if(delayMs){
                            App.TimerManager.doDelay(delayMs,()=>{
                                Tip.addTip(tips, TipType.LeftBottomText);
                            },this);
                        }else{
                            Tip.addTip(tips, TipType.LeftBottomText);
                        }                    
                    }else{
                        Tip.addTip(tips, TipType.LeftBottomText);
                    }
                    
                }
            }
        }
    }

    /**
     * 经验值增加
     */
    private onRoleExpAdd(data: any): void {
        if (data != null) {
            let updateCode: number = data["updateCode"];
            let exp: number = data["exp"];
            if (TipController.expNoTipUpdateCodes.indexOf(updateCode) == -1) {
                let tip: string = HtmlUtil.html(`经验 +${exp}`, Color.Green2);
                if (!CacheManager.copy.isInCopyByType(ECopyType.ECopyEncounter)) {
                    Tip.addTip(tip, TipType.LeftBottomText);
                } else { //部分副本经验延迟显示
                    egret.setTimeout((tip: string) => {
                        Tip.addTip(tip, TipType.LeftBottomText);
                    }, this, 3000, tip);
                }
            }
            if (CacheManager.copy.isInCopyByType(ECopyType.ECopyCheckPoint)) {
                egret.setTimeout(this.showExpEffect, this, 2000, exp);
            }
            else if (CacheManager.copy.isInCopyByType(ECopyType.ECopyPosition)) {
                Tip.showRollTip("获得" + HtmlUtil.html("" + exp, CacheManager.posOccupy.expColor) + "经验");
                // this.showExpEffect(exp);
            }
        }
    }

    /**
     * 属性提升飘字
     */
    private onRoleAttrUpgrade(properties: Array<any>): void {
        Tip.addTip(properties, TipType.Attr);
    }

    /**
     * 金钱增加
     */
    private onMoneyAdd(priceUnitName: string, addValue: number, updateCode: number): void {
        if (TipController.packNoTipUpdateCodes.indexOf(updateCode) != -1) {
            return;
        }
        let tip: string = HtmlUtil.html(priceUnitName + " +" + addValue, Color.BASIC_COLOR_9);
        Tip.addTip(tip, TipType.LeftBottomText);
    }

    /**
     * 显示经验增加特效
     * @param {number} exp
     */
    private showExpEffect(exp: number): void {
        if (this.expTxt == null) {
            this.expTxt = new fairygui.GTextField();
            this.expTxt.font = FontType.EXP_FONT;
            this.expTxt.setScale(1.5, 1.5);
            this.expTxt.setPivot(0.5, 0, true);
        }
        this.expTxt.alpha = 1;
        this.expTxt.setXY(Math.round(fairygui.GRoot.inst.width * 0.5), fairygui.GRoot.inst.height * 0.5);
        this.expTxt.text = `exp+${exp}`;
        LayerManager.Game_Main.addChild(this.expTxt.displayObject);
        egret.Tween.get(this.expTxt).wait(1000).to({y: this.expTxt.y - 150, alpha: 0.1}, 1600).call(() => {
            egret.Tween.removeTweens(this.expTxt);
            App.DisplayUtils.removeFromParent(this.expTxt.displayObject);
            this.expTxt.removeFromParent();
        }, this);
    }
}