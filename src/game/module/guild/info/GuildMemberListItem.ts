/**
 * 仙盟信息内成员列表项
 */
class GuildMemberListItem extends ListRenderer {
	private cPosition: fairygui.Controller;
	private cColor: fairygui.Controller;
	private avatarLoader: GLoader;
	private nameTxt: fairygui.GTextField;
	private levelTxt: fairygui.GTextField;
	private fightTxt: fairygui.GTextField;
	private contributionTxt: fairygui.GTextField;
	private onlineTxt: fairygui.GTextField;

	private guildPlayer: any;
	private publicMiniPlayer: any;

	public constructor() {
		super();
	}

	protected constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.cPosition = this.getController("c1");
		this.cColor = this.getController("c2");
		this.avatarLoader = this.getChild("loader_avatar") as GLoader;
		this.nameTxt = this.getChild("txt_name").asTextField;
		this.levelTxt = this.getChild("txt_level").asTextField;
		this.fightTxt = this.getChild("txt_fight").asTextField;
		this.contributionTxt = this.getChild("txt_offer").asTextField;
		this.onlineTxt = this.getChild("txt_state").asTextField;
	}

	public setData(data: any, index: number): void {
		this._data = data;
		this.guildPlayer = data;
		this.publicMiniPlayer = data.miniPlayer;
		this.nameTxt.text = this.publicMiniPlayer.name_S;
		this.levelTxt.text = this.publicMiniPlayer.level_SH + "";
		this.avatarLoader.load(URLManager.getPlayerHead(this.publicMiniPlayer.career_SH));
		this.fightTxt.text = this.publicMiniPlayer.warfare_L64 + "";
		this.contributionTxt.text = this.guildPlayer.contribution_I + "";
		if (this.publicMiniPlayer.online_BY) {
			this.onlineTxt.text = "在线";
		} else {
			let logoutDt:number = this.publicMiniPlayer.logoutDt_DT;
			let elapsed:number = Math.floor(new Date().getTime()/1000) - logoutDt;
			this.onlineTxt.text = App.DateUtils.getFormatBySecond(elapsed, 4);
		}

		let position: EGuildPosition = this.guildPlayer.position_I;
		this.cPosition.selectedIndex = this.getCIndex(position);
		if (index % 2 == 0) {
			this.cColor.selectedIndex = 0;
		} else {
			this.cColor.selectedIndex = 1;
		}
	}

	private getCIndex(position: EGuildPosition): number {
		if (position == EGuildPosition.EGuildLeader) {
			return 0;
		} else if (position == EGuildPosition.EGuildDeputyLeader) {
			return 1;
		} else if (position == EGuildPosition.EGuildPresbyter) {
			return 2;
		}
		return 3;
	}
}