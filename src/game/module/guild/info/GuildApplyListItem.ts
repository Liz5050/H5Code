/**
 * 仙盟信息内申请列表项
 */
class GuildApplyListItem extends ListRenderer {
	private cColor: fairygui.Controller;
	private cOper: fairygui.Controller;
	private avatarLoader: GLoader;
	private nameTxt: fairygui.GTextField;
	private levelTxt: fairygui.GTextField;

	private playerId: number;
	private publicMiniPlayer: any;

	public constructor() {
		super();
	}

	protected constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.cColor = this.getController("c1");
		this.cOper = this.getController("c2");
		this.avatarLoader = this.getChild("loader_avatar") as GLoader;
		this.nameTxt = this.getChild("txt_name").asTextField;
		this.levelTxt = this.getChild("txt_level").asTextField;
		this.getChild("btn_agree").addClickListener(this.clickAgree, this);
		this.getChild("btn_refuse").addClickListener(this.clickRefuse, this);

	}

	public setData(data: any, index: number): void {
		this.publicMiniPlayer = data;
		this.playerId = this.publicMiniPlayer.entityId.id_I;
		this.nameTxt.text = data.name_S;
		this.levelTxt.text = data.level_SH + "";
		this.avatarLoader.load(URLManager.getPlayerHead(CareerUtil.getBaseCareer(data.career_SH)));
		if (index % 2 == 0) {
			this.cColor.selectedIndex = 0;
		} else {
			this.cColor.selectedIndex = 1;
		}
		if (CacheManager.guild.isCanDealApply) {
			this.cOper.selectedIndex = 0;
		} else {
			this.cOper.selectedIndex = 1;
		}
	}

	/**
	 * 同意
	 */
	private clickAgree(): void {
		EventManager.dispatch(LocalEventEnum.GuildDealApply, { "playerId": this.playerId, "isAgree": true });
	}

	/**
	 * 拒绝TODO 事件未生效
	 */
	private clickRefuse(e: any): void {
		EventManager.dispatch(LocalEventEnum.GuildDealApply, { "playerId": this.playerId, "isAgree": false });
	}
}