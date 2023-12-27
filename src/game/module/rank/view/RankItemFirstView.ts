class RankItemFirstView extends fairygui.GComponent {
    private txt_vip:fairygui.GTextField;
    private txtName:fairygui.GTextField;
    private txtValue:fairygui.GTextField;
	// private img_fightRank:fairygui.GImage;
	private _rankData:any;
	public constructor() {
		super();
	}

	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
        this.txt_vip = this.getChild("txt_vip").asTextField;
        this.txtName = this.getChild("txt_name").asTextField;
        this.txtValue = this.getChild("txt_value").asTextField;
		// this.img_fightRank = this.getChild("img_fightRank").asImage;
	}

	public setData(data:any):void {		
		this._rankData = data;
		this.txt_vip.text = data.vipLevel_I > 0 ? "V": ""; //+ data.vipLevel_I 

		let propertys:string[] = CacheManager.rank.getRankPropertys(data);
		// this.img_fightRank.visible = false;
		if(propertys){
			this.txtName.text = propertys[0];
			if(data.toplistType_I == EToplistType.EToplistTypePlayerFight) {
				this.txtValue.text = propertys[3];
				// this.img_fightRank.visible = data.rank_I <= 10;
			}
			else {
				this.txtValue.text = propertys[2];
			}
		}
	}

	// private onClickHandler():void {
	// 	let selfEntityId:any = CacheManager.role.getSEntityId();
	// 	let entityId:any = {
	// 		roleIndex_BY:0, 
	// 		id_I: this._rankData.entityId_I, 
	// 		type_BY: EEntityType.EEntityTypePlayer, 
	// 		typeEx_SH: selfEntityId.typeEx_SH, 
	// 		typeEx2_BY: selfEntityId.typeEx2_BY 
	// 	};
	// 	EventManager.dispatch(LocalEventEnum.CommonViewPlayerMenu,{toEntityId:entityId},true);
	// }

	public get rankData():any {
		return this._rankData;
	}
}