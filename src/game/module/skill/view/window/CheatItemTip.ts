/**
 * 秘籍图标tips
 * @author zhh
 * @time 2018-09-05 15:53:21
 */
class CheatItemTip extends BaseWindow { //
    private baseItem:SkillCheatsItem;
    private windowItemtip:fairygui.GImage;
    private txtScore:fairygui.GTextField;
    private txtName:fairygui.GTextField;
    private txtDesc:fairygui.GRichTextField;

    private debugBuy:ToolTipDebugBuy;

	public constructor() {
		super(PackNameEnum.SkillCheats,"CheatItemTip")

	}
	public initOptUI():void{
        //---- script make start ----
        this.baseItem = <SkillCheatsItem>this.getGObject("baseItem");
        this.baseItem.isShowName = false;
        this.windowItemtip = this.getGObject("window_itemtip").asImage;
        this.txtScore = this.getGObject("txt_score").asTextField;
        this.txtName = this.getGObject("txt_name").asTextField;
        this.txtDesc = this.getGObject("txt_desc").asRichTextField;
        //---- script make end ----
        this.debugBuy = FuiUtil.addDebugBuy(this);

	}

	public updateAll(data?:any):void{
        let itemData:ItemData = <ItemData>data.item;
        if(itemData){
            this.baseItem.setData(itemData,0);            
            this.txtScore.text = "评分："+ConfigManager.cheats.getFight(itemData.getCode(),data.roleIndex);
            this.txtName.text = itemData.getName(false);
            this.txtDesc.text = itemData.getDesc();            
            if(this.debugBuy){
                this.debugBuy.update(itemData,this.hide,this);
            }
        }else{
            this.hide();
        }
		
	}


}