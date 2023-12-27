/**
 * 仙盟抢boss头像item
 * @author zhh
 * @time 2018-12-10 11:38:32
 */
class GuildBossHeadItem extends ListRenderer {
    private loaderHead:GLoader;
    private txtName:fairygui.GTextField;
	private c1:fairygui.Controller;

	public constructor() {
		super();
		
	}
	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
        //---- script make start ----
        this.loaderHead = <GLoader>this.getChild("loader_head");
        this.txtName = this.getChild("txt_name").asTextField;
		this.c1 = this.getController("c1");
        //---- script make end ----	


	}
	public setData(data:any,index:number):void{		
		this._data = data;
		this.itemIndex = index;
		let isDeath:boolean = CacheManager.bossNew.isBossCd(this._data.bossCode);
		let bossInfo:any = ConfigManager.boss.getByPk(this._data.bossCode);
		this.txtName.text = bossInfo.name; 
		this.c1.setSelectedIndex(isDeath?1:0);
		let url:string = URLManager.getBossHeadIcon(this._data.bossCode);
		this.loaderHead.load(url);
		this.loaderHead.grayed = !CacheManager.crossBoss.isCanEnterGuildBoss(this._data.bossCode);
		let isTip:boolean = !CacheManager.crossBoss.isHasSelectGuildBoss() && !isDeath && CacheManager.guildNew.isJoinedGuild();
		CommonUtils.setBtnTips(this,isTip,87,4);
	}


}