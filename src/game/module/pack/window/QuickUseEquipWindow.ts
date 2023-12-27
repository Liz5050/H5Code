/**
 * 快速使用装备
 * @author zhh
 * @time 2018-06-30 11:08:27
 */
class QuickUseEquipWindow extends BaseWindow {
	private static LIFE_SEC:number = 5;
    private c1:fairygui.Controller;
    private baseItem:BaseItem;
    private txtTime:fairygui.GTextField;
    private txtName:fairygui.GRichTextField;
    private txtFight:fairygui.GRichTextField;
    private btnUse:fairygui.GButton;
	private itemData:ItemData;
	private curSec:number;
	public constructor() {
		super(PackNameEnum.Pack,"WindowQuickUseEquip");
		this.modal = false;

	}
	public initOptUI():void{
        //---- script make start ----
        this.c1 = this.getController("c1");
        this.baseItem = <BaseItem>this.getGObject("baseItem");
		this.baseItem.isShowName = false;
        this.txtTime = this.getGObject("txt_time").asTextField;
        this.txtName = this.getGObject("txt_name").asRichTextField;
        this.txtFight = this.getGObject("txt_fight").asRichTextField;
        this.btnUse = this.getGObject("btn_use").asButton;

        this.btnUse.addClickListener(this.onGUIBtnClick, this);
        //---- script make end ----
		
		// if (this.view) {
		// 	//this.view.setSize(fairygui.GRoot.inst.width, fairygui.GRoot.inst.height);
		// 	this.view.addRelation(fairygui.GRoot.inst, fairygui.RelationType.Bottom_Bottom);
		// 	this.view.addRelation(fairygui.GRoot.inst, fairygui.RelationType.Right_Right);
		// }
	}

	public updateAll(data?:any):void{
		this.itemData = <ItemData>data;
		this.baseItem.itemData = this.itemData; 
		this.txtName.text = this.itemData.getName(true);
		let dressPos: EDressPos = ItemsUtil.getEqiupPos(this.itemData);
		let equiped: ItemData = CacheManager.pack.rolePackCache.getItemAtIndex(dressPos);
		let equipScore:number = WeaponUtil.getScoreBase(equiped);
		let curScore:number = WeaponUtil.getScoreBase(this.itemData);
		this.txtFight.text = "战斗力 "+(curScore-equipScore);
		App.TimerManager.remove(this.onTimer,this);
		App.TimerManager.doTimer(1000,0,this.onTimer,this);
		this.curSec = QuickUseEquipWindow.LIFE_SEC;
		this.setBtnText();		
	}
	public onShow(param: any = null): void {
		super.onShow(param);		
		this.fixPos();
	}
	private onTimer():void{
		this.curSec--;		
		this.setBtnText();		
		if(this.curSec<=0){
			let nextItem:ItemData = CacheManager.pack.getNextQuickUseEquip();
			if(nextItem){
				EventManager.dispatch(LocalEventEnum.EquipToRole,this.itemData,0);
				this.updateAll(nextItem);
			}else{
				this.hide();
			}
			
		}
	}
	private setBtnText():void{
		this.btnUse.text = `装 备 (${HtmlUtil.colorSubstitude(LangCommon.L48, this.curSec)})`;
	}
    protected onGUIBtnClick(e:egret.TouchEvent):void{
        var btn: any = e.target;
        switch (btn) {
            case this.btnUse:				
				this.hide();
                break;				
        }
    }
	protected onStageResize():void{
		super.onStageResize();
		this.fixPos();
	}

	private fixPos():void{
		this.setXY(fairygui.GRoot.inst.width - this.width, fairygui.GRoot.inst.height - 400);
	}

	public hide(param: any = null, callBack: CallBack = null):void{
		super.hide(param,callBack);
		App.TimerManager.remove(this.onTimer,this);
		EventManager.dispatch(LocalEventEnum.EquipToRole,this.itemData,0);
	}

}