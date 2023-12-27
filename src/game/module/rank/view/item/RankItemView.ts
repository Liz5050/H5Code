class RankItemView extends ListRenderer {
    private c1:fairygui.Controller;
    private txt_vip:fairygui.GTextField;
    private txtRank:fairygui.GTextField;
    private txtValue:fairygui.GTextField;
    private txtName:fairygui.GTextField;
	private img_fightRank:fairygui.GImage;
	public constructor() {
		super();
	}

	protected constructFromXML(xml:any):void {			
		super.constructFromXML(xml);
        this.c1 = this.getController("c1");
        this.txt_vip = this.getChild("txt_vip").asTextField;
        this.txtRank = this.getChild("txt_rank").asTextField;
        this.txtValue = this.getChild("txt_value").asTextField;
        this.txtName = this.getChild("txt_name").asTextField;
		this.img_fightRank = this.getChild("img_fightRank").asImage;
		this.addClickListener(this.onClickHandler,this);
	}

	public setData(data:any):void {		
		this._data = data;
		this.c1.selectedIndex = (data.rank_I > 0 && data.rank_I <= 3) ? data.rank_I - 1 : 0;
		// if(data.realmLevel_I > 0) {
		// 	let resId:string = URLManager.getIconUrl("name_" + data.realmLevel_I,URLManager.REALM_ICON);
		// 	this.realmIcon.load(resId);
		// }
		// else {
		// 	this.realmIcon.clear();
		// }
		this.txtRank.text = "" + data.rank_I;
		this.txt_vip.text = data.vipLevel_I > 0 ? "V" : "";//+ data.vipLevel_I

		let propertys:string[] = CacheManager.rank.getRankPropertys(data);
		this.img_fightRank.visible = false;
		if(propertys){
			this.txtName.text = propertys[0];
			if(data.toplistType_I == EToplistType.EToplistTypePlayerFight) {
				this.txtValue.text = "";
				this.img_fightRank.visible = data.rank_I <= 10;
			}
			else {
				this.txtValue.text = propertys[2];
			}
		}
	}

	private onClickHandler():void {
		let selfEntityId:any = CacheManager.role.getSEntityId();
		let entityId:any = {
			roleIndex_BY:0, 
			id_I: this._data.entityId_I, 
			type_BY: EEntityType.EEntityTypePlayer, 
			typeEx_SH: selfEntityId.typeEx_SH, 
			typeEx2_BY: selfEntityId.typeEx2_BY 
		};
		EventManager.dispatch(LocalEventEnum.CommonViewPlayerMenu,{toEntityId:entityId},true);
	}
}