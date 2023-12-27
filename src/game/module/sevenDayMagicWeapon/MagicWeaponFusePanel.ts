/**
 * 七天法宝融合界面
 */
class MagicWeaponFusePanel extends BaseTabPanel {
	private fuseItem: Array<MagicWeaponFuseItem>;
	private fuseBtn: fairygui.GButton;
	private costGroup: fairygui.GGroup;
	private costTxt : fairygui.GTextField;

	/**模型展示 */
	private modelContainer: fairygui.GComponent;
	private modelBody: egret.DisplayObjectContainer;
	private model: ModelShow;

	private static itemNum: number = 5;
	private magicWeaponCode: number = 6;

	private cost : number;

	public initOptUI(): void {
		this.fuseItem = [];
		for(let i:number = 0; i < MagicWeaponFusePanel.itemNum; i++){
			let item: MagicWeaponFuseItem = <MagicWeaponFuseItem>this.getGObject(`fuseItem_${i+1}`);
			this.fuseItem.push(item);
		}

		this.fuseBtn = this.getGObject("btn_fuse").asButton;
		this.costGroup = this.getGObject("group_cost").asGroup;
		this.costTxt = this.getGObject("txt_cost").asTextField;
		this.fuseBtn.visible = true;
		this.costGroup.visible = true;

		this.modelContainer = this.getGObject("effectContainer").asCom;
		this.model = new ModelShow(EShape.EMagicweapon);
		this.modelBody = ObjectPool.pop("egret.DisplayObjectContainer");
		this.modelBody.addChild(this.model);
		(this.modelContainer.displayObject as egret.DisplayObjectContainer).addChild(this.modelBody);
		this.modelContainer.setScale(1.4, 1.4);

		this.fuseBtn.addClickListener( this.onClickFuseWeapon, this);
		this.cost = ConfigManager.const.getDict()["MixSpirit"].constValueEx;
		this.costTxt.text = ConfigManager.const.getDict()["MixSpirit"].constValueEx;
	}

	//根据缓存更新
	public updateAll(): void {
		this.updateItems();
		this.cost = ConfigManager.const.getDict()["MixSpirit"].constValueEx;
	}

	public updateItems(): void{
		let datas: Array<any> = ConfigManager.sevenDayMagicWeapon.select({});
		for(let i = 0; i < MagicWeaponFusePanel.itemNum; i++){
			this.fuseItem[i].setData(datas[i]);
		}
		this.model.setData(this.magicWeaponCode);
	}

	public onClickFuseWeapon() : void {
		var flag = MoneyUtil.checkEnough(EPriceUnit.EPriceUnitGold, this.cost ,true);
		if(flag) {
			ProxyManager.sevenDayMagicWeapon.fuseSevenDayMagicWeapon();
		}
	} 
}