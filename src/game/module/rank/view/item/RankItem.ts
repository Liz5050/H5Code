class RankItem extends ListRenderer {
	private controller1:fairygui.Controller;
	private controller2:fairygui.Controller;
	private realmIcon:GLoader;
	private rankTxt:fairygui.GTextField;
	private vipTxt:fairygui.GTextField;
	private nameTxt:fairygui.GTextField;
	private valueTxt1:fairygui.GTextField;
	private valueTxt2:fairygui.GTextField;
	public constructor() {
		super();
	}

	protected constructFromXML(xml:any):void{
		super.constructFromXML(xml);
		this.controller1 = this.getController("c1");
		this.controller2 = this.getController("c2");
		this.realmIcon = this.getChild("loader") as GLoader;
		this.rankTxt = this.getChild("txt_rank").asTextField;
		this.vipTxt = this.getChild("txt_vip").asTextField;
		this.nameTxt = this.getChild("txt_name").asTextField;
		this.valueTxt1 = this.getChild("txt_guild").asTextField;
		this.valueTxt2 = this.getChild("txt_value").asTextField;
	}

	public setData(data:any):void {
		this._data = data;
		this.controller1.selectedIndex = (data.rank_I % 2 == 0) ? 0 : 1;
		this.controller2.selectedIndex = (data.rank_I > 0 && data.rank_I <= 3) ? data.rank_I - 1 : 3;
		if(data.realmLevel_I > 0) {
			let resId:string = URLManager.getIconUrl("name_" + data.realmLevel_I,URLManager.REALM_ICON);
			this.realmIcon.load(resId);
		}
		else {
			this.realmIcon.clear();
		}
		this.rankTxt.text = "" + data.rank_I;
		this.vipTxt.text = data.vipLevel_I > 0 ? "V" : ""; // + data.vipLevel_I
		let propertys:string[] = CacheManager.rank.getRankPropertys(data);
		if(propertys){
			this.nameTxt.text = propertys[0];
			this.valueTxt1.text = propertys[1];
			this.valueTxt2.text = propertys[2];
		}
	}
}