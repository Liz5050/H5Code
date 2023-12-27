class RankSelfView extends BaseView {
	private realmIcon:GLoader;
	private rankTxt:fairygui.GTextField;
	private vipTxt:fairygui.GTextField;
	private nameTxt:fairygui.GTextField;
	private valueTxt1:fairygui.GTextField;
	private valueTxt2:fairygui.GTextField;
	public constructor(component:fairygui.GComponent) {
		super(component);
	}

	protected initOptUI():void {
		this.realmIcon = this.getGObject("loader") as GLoader;
		this.rankTxt = this.getGObject("txt_rank").asTextField;
		this.vipTxt = this.getGObject("txt_vip").asTextField;
		this.nameTxt = this.getGObject("txt_name").asTextField;
		this.valueTxt1 = this.getGObject("txt_guild").asTextField;
		this.valueTxt2 = this.getGObject("txt_other").asTextField;
	}

	/**
	 * 未上榜
	 */
	public setData(type:EToplistType,rank:number = -1,data:any):void {
		let roleInfo:EntityInfo = CacheManager.role.entityInfo;
		if(roleInfo.realmLevel_BY > 0) {
			let resId:string = URLManager.getIconUrl("name_" + roleInfo.realmLevel_BY,URLManager.REALM_ICON);
			this.realmIcon.load(resId);
		}
		else {
			this.realmIcon.clear();
		}
		this.rankTxt.text = rank > 0 ? rank + "" : 50 + "+";
		let vipLv:number = CacheManager.vip.vipLevel
		this.vipTxt.text = vipLv > 0 ? "V" + vipLv : "";
		this.nameTxt.text = roleInfo.name_S;
		let propertys:string[];
		let index:number = 0;
		if(rank > 0){
			propertys = CacheManager.rank.getRankPropertys(data);
			index = 1;
		}
		else {
			propertys = CacheManager.rank.getSelfRankInfo(type)
		}
		if(propertys) {
			this.valueTxt1.text = propertys[index];
			this.valueTxt2.text = propertys[index + 1];
		}
	}

	public updateAll():void {

	}
}