/**
 * 神器碎片可未激活或已激活时用的tips
 */
class ToolTipGodWPiece extends ToolTipGodWPieceBase {
	protected txtSource:fairygui.GTextField;
	protected txtFight:fairygui.GTextField;
	public constructor() {
		super(PackNameEnum.Common, "ToolTipGodWeaponPiece");
	}
	public initUI(): void {
		super.initUI();
		this.txtSource = this.getGObject("txt_source").asTextField;
		let panel_fight:fairygui.GComponent = this.getGObject("panel_fight").asCom;
		this.txtFight = panel_fight.getChild("txt_fight").asTextField;
	}
	public setToolTipData(toolTipData: ToolTipData) {
		super.setToolTipData(toolTipData);
		if (toolTipData) {
			let data:any = toolTipData.data; //神器表配置
			
			let s:string = "";
			if(data.taskCode){
				s = "通关主线剧情获得";
			}else{
				s = HtmlUtil.html(data.checkPoint+"",Color.GreenCommon);
				s = `通关第${s}关获得`;
			}
			this.txtSource.text= s;
			this.txtFight.text = WeaponUtil.getCombat(WeaponUtil.getAttrDict(data.attr))+"";
		}
		
	}
}