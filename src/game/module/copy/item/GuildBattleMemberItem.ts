class GuildBattleMemberItem extends ListRenderer {
    private c1:fairygui.Controller;
    private loader_head:GLoader;
    private loader_vip:GLoader;
    private txt_name:fairygui.GTextField;
    private txt_score:fairygui.GTextField;
    private txt_fight:fairygui.GTextField;
    private txt_position:fairygui.GTextField;
	public constructor() {
		super();
	}

	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
        this.c1 = this.getController("c1");
        this.loader_head = <GLoader>this.getChild("loader_head");
        this.loader_vip = <GLoader>this.getChild("loader_vip");
        this.loader_vip.load(URLManager.getModuleImgUrl("V.png",PackNameEnum.GuildNew));
        this.txt_name = this.getChild("txt_name").asTextField;
        this.txt_score = this.getChild("txt_score").asTextField;
        this.txt_fight = this.getChild("txt_fight").asTextField;
        this.txt_position = this.getChild("txt_position").asTextField;
	}

	public setData(data:GuildBattlePlayerInfo,index:number):void{		
		this._data = data;
		this.itemIndex = index;
        this.loader_head.load(URLManager.getPlayerHead(CareerUtil.getBaseCareer(data.miniPlayer.career_SH)));
        this.loader_vip.visible = data.miniPlayer.vipLevel_BY > 0;
        this.txt_name.text = data.miniPlayer.name_S;
        this.txt_score.text = data.score + "";
        this.txt_fight.text = data.miniPlayer.warfare_L64.toString();
        this.txt_position.text = CacheManager.guildBattle.getPositionName(data.mapId);
        this.c1.selectedIndex = CacheManager.guildNew.checkIsLeader(data.miniPlayer.entityId) ? 1 : 0;
	}
}