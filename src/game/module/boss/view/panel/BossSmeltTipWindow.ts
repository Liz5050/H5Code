class BossSmeltTipWindow extends BaseWindow {
	private txt_tip:fairygui.GTextField;
	public btn_smelt:fairygui.GButton;
	public constructor() {
		super(PackNameEnum.Common,"WindowSmeltTip");
	}
	public initOptUI():void{
		this.txt_tip = this.getGObject("txt_tip").asTextField;
		this.btn_smelt = this.getGObject("btn_smelt").asButton;

		this.btn_smelt.addClickListener(this.onClickSmelt,this);
	}
	public updateAll(data:any):void{
		
		let clr:any = "#C8B185";
		let limitNumPack:number;
		limitNumPack = data.limitNumPack;
		if(!limitNumPack){
			limitNumPack = ConfigManager.const.getConstValue("PersonalCopyBagFreeCapacity");
		}
		let tips:string = HtmlUtil.html("背包空间不足 ",clr)+HtmlUtil.html(limitNumPack+" ","#df140f")+HtmlUtil.html("，请先清理背包，",clr,true)
		+HtmlUtil.html("以免不能获得奖励。",clr,true);
		this.txt_tip.text = tips;
	}

	private onClickSmelt(e:any):void{
		//打开背包熔炼
		EventManager.dispatch(UIEventEnum.PackSmeltOpen);
		this.hide();
	}
}