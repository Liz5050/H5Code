/**
 * 神器碎片可激活时用的tips
 */
class ToolTipGodWPieceAct extends ToolTipGodWPieceBase {
	private txtNeed:fairygui.GTextField;
	private btnActivation:fairygui.GButton;
	public constructor() {
		super(PackNameEnum.Common, "ToolTipGodWeaponActivation");
	}
	public initUI(): void {
		super.initUI();
		this.btnActivation = this.getGObject("btn_activation").asButton;
		this.txtNeed = this.getGObject("txt_need").asTextField;
		this.btnActivation.addClickListener(this.onClickAct,this);
		GuideTargetManager.reg(GuideTargetName.GodWPieceActBtn, this.btnActivation);
	}
	public setToolTipData(toolTipData: ToolTipData) {
		super.setToolTipData(toolTipData);
		if (toolTipData) {
			let data:any = toolTipData.data; //神器表配置
			let infs:any[] = ConfigManager.godWeapon.getPieceList(data.code);
			let actPieces:number[] = CacheManager.godWeapon.getActPieces(data.code);
			let n:number = infs.length - actPieces.length;
			let nStr:string = HtmlUtil.html(n+"","#01ab24");
			let nameStr:string = HtmlUtil.html(data.name,"#01ab24");
			this.txtNeed.text = `1.再获得${nStr}个碎片可激活${nameStr}`+HtmlUtil.brText+"2.激活碎片可获得大量属性";
		}		
	}

	private onClickAct(e:any):void{
		let data:any = this.toolTipData.data;
		EventManager.dispatch(LocalEventEnum.TrainActGodWeaponPiece,data.code,data.piece);
		this.hide();
	}

}