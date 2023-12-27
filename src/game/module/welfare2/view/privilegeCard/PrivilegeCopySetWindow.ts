class PrivilegeCopySetWindow extends BaseWindow {
	private c1:fairygui.Controller;
	private btn_autoFight:fairygui.GButton;
	private txt_autoFight:fairygui.GRichTextField;
	private btn_double:fairygui.GButton;
	private txt_double:fairygui.GRichTextField;
	private fromCode:number = 0;
	private timeIndex:number = -1;
	public constructor() {
		super(PackNameEnum.Welfare2PrivilegeCard,"PrivilegeCopySetWindow");
	}

	public initOptUI():void {
		this.c1 = this.getController("c1");
		this.btn_autoFight = this.getGObject("btn_autoFight").asButton;
		this.btn_double = this.getGObject("btn_double").asButton;
		this.btn_double.addClickListener(this.onClickHandler,this);
		this.btn_autoFight.addClickListener(this.onClickHandler,this);

		this.txt_autoFight = this.getGObject("txt_autoFight").asRichTextField;
		this.txt_autoFight.text = HtmlUtil.colorSubstitude(LangWelfare.L4);
		
		this.txt_double = this.getGObject("txt_double").asRichTextField;
		this.txt_double.text = HtmlUtil.colorSubstitude(LangWelfare.L5);
	}

	public updateAll(fromCode:number):void {
		this.c1.selectedIndex = fromCode == CopyEnum.CopyWorldBoss || fromCode == CopyEnum.CopyGodBoss ? 1 : 0;
		this.fromCode = fromCode;
		let isAutoFight:boolean = fromCode == CopyEnum.CopyWorldBoss ? CacheManager.bossNew.autoFight : CacheManager.bossNew.autoFight2;
		this.btn_autoFight.selected = isAutoFight;
		this.btn_double.selected = CacheManager.welfare2.isPrivilegeCard && CacheManager.welfare2.isPrivilegeDouble(fromCode);
	}

	private onClickHandler(evt:egret.TouchEvent):void {
		let btn:fairygui.GButton = evt.target as fairygui.GButton;
		if(btn == this.btn_autoFight) {
			if(!CacheManager.welfare2.isPrivilegeCard) {
				AlertII.show(HtmlUtil.colorSubstitude(LangWelfare.L1),null,function(type:AlertType){
					if(type == AlertType.YES) {
						EventManager.dispatch(UIEventEnum.ModuleOpen,ModuleEnum.Welfare2,{tabType:PanelTabType.PrivilegeCard},ViewIndex.Two);
						this.hide();
					}
				},this,[AlertType.NO,AlertType.YES],[LangCommon.L27,LangWelfare.L3]);
				this.btn_autoFight.selected = false;
				return;
			}
			this.onAutoFight();
		}
		else if(btn == this.btn_double){
			if(!CacheManager.welfare2.isPrivilegeCard) {
				AlertII.show(HtmlUtil.colorSubstitude(LangWelfare.L2),null,function(type:AlertType){
					if(type == AlertType.YES) {
						EventManager.dispatch(UIEventEnum.ModuleOpen,ModuleEnum.Welfare2,{tabType:PanelTabType.PrivilegeCard},ViewIndex.Two);
						this.hide();
					}
				},this,[AlertType.NO,AlertType.YES],[LangCommon.L27,LangWelfare.L3]);
				this.btn_double.selected = false;
				return;
			}
			// Tip.showTip("" + this.fromCode);
			ProxyManager.welfare2.privilegeSetDouble(this.fromCode,this.btn_double.selected);
		}
	}

	private onAutoFight():void {
		if(this.timeIndex != -1) {
			egret.clearTimeout(this.timeIndex);
		}
		if(this.fromCode == CopyEnum.CopyWorldBoss) {
			CacheManager.bossNew.autoFight = this.btn_autoFight.selected;
		}
		else if(this.fromCode == CopyEnum.CopyGodBoss) {
			CacheManager.bossNew.autoFight2 = this.btn_autoFight.selected;
		}
		if(CacheManager.bossNew.autoFight || CacheManager.bossNew.autoFight2) {
			this.timeIndex = egret.setTimeout(function(){
				this.timeIndex = -1;
				if(CacheManager.bossNew.autoFight || CacheManager.bossNew.autoFight2) {
					EventManager.dispatch(LocalEventEnum.WorldBossAutoFight);
				}
			},this,2000);
		}
	}
}