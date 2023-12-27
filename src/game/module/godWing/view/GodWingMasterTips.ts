/**
 * 神羽大师tips
 * @author zhh
 * @time 2018-08-13 22:20:05
 */
class GodWingMasterTips extends BaseWindow {
    private c1:fairygui.Controller;
    private txtTip:fairygui.GTextField;
	private infoCom1:GodWingMasterInfo;
	private infoCom2:GodWingMasterInfo;

	public constructor() {
		super(PackNameEnum.GodWingEquipPanel,"GodWingMasterTips");
		this.isPopup = true;
	}
	public initOptUI():void{
        //---- script make start ----
        this.c1 = this.getController("c1");
        this.txtTip = this.getGObject("txt_tip").asTextField;
		this.infoCom1 = new GodWingMasterInfo(this.getGObject("infoCom1").asCom);
		this.infoCom2 = new GodWingMasterInfo(this.getGObject("infoCom2").asCom);
        //---- script make end ----

	}

	public updateAll(data?:any):void{
		let curLv:number = data.curLevel;
		let isAct:boolean = curLv>0;
		curLv = Math.max(curLv,1);
		let cond:any = {cultivateType:ECultivateType.ECultivateTypeStrengExAccessory,subtype:EStrengthenExType.EStrengthenExTypeWing,level:curLv};
		let curInfo:any = ConfigManager.cultivateSuit.select(cond)[0];
		let comData:any = {roleIndex:data.roleIndex};
		comData.info = curInfo;
		comData.curLv = data.curLevel;
		comData.isAct = isAct;
		this.infoCom1.updateAll(comData);
		let idx:number = 1;
		if(isAct){
			cond.level++;
			let nextInfo:any = ConfigManager.cultivateSuit.select(cond)[0];
			if(nextInfo){ //有下一阶
				idx = 0;
				comData.info = nextInfo;
				comData.isAct = false;
				this.infoCom2.updateAll({info:nextInfo,curLv:data.curLevel,isAct:false});
			}
		}
		this.c1.setSelectedIndex(idx);
		let h:number = this.txtTip.y + this.txtTip.height;
		this.view.setSize(this.view.width,h);
	}

}