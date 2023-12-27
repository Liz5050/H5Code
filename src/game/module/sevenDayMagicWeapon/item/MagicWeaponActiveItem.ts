class MagicWeaponActiveItem extends ListRenderer {
	private iconLoader: GLoader;
	private nameTxt: fairygui.GTextField;
	private condTxt: fairygui.GTextField;
	private levelTxt: fairygui.GTextField;
	private timeTxt: fairygui.GTextField;
	private statusController: fairygui.Controller;
	private curIndex: number;

	private endTime: number;

	public constructor() {
		super();
	}

	protected constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.iconLoader = <GLoader>this.getChild("loader_icon");
		this.nameTxt = this.getChild("txt_name").asTextField;
		this.condTxt = this.getChild("txt_cond").asTextField;
		// this.levelTxt = this.getChild("txt_level").asTextField;
		// this.timeTxt = this.getChild("txt_time").asTextField;
		this.statusController = this.getController("c1");
	}

	public setData(data: any): void {
		this._data = data;
		this.iconLoader.load(URLManager.getModuleImgUrl(`icon/${data.code}.png`, PackNameEnum.SevenDayMagicWeapon));
		this.nameTxt.text = data.name;

		let isTips: boolean = false;
		switch (CacheManager.sevenDayMagicWeapon.getMagicWeaponStatus(data)) {
			case 2:
				this.statusController.selectedIndex = 2;
				break;
			case 1:
				this.statusController.selectedIndex = 1;
				isTips = true;
				break;
			case 0:
				this.statusController.selectedIndex = 0;
				// let condStr: string = "";
				// condStr += `第${data.openDay}天\n`;
				// if(data.openVip && data.openVip != -1){
				// 	condStr += `或VIP\n${data.openVip}`;
				// }
				// condStr += "开启";
				// this.condTxt.text = condStr;
				this.condTxt.text = ConfigManager.sevenDayMagicWeapon.getCondStr(data.code);
				break;
		}

		let point: egret.Point = new egret.Point(95, 20);
		CommonUtils.setBtnTips(this, isTips, 95, 20, false);

	}
}