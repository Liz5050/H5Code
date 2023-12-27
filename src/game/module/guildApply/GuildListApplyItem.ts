/**
 * 仙盟列表申请项
 */
class GuildListApplyItem extends ListRenderer {
	private cRank: fairygui.Controller;
	private cColor: fairygui.Controller;
	private cState: fairygui.Controller;
	private rankTxt: fairygui.GTextField;
	private flagLoader: GLoader;
	private infoTxt: fairygui.GRichTextField;
	private stateTxt: fairygui.GTextField;
	/**SMiniGuildInfo */
	private miniGuildInfo: any;

	protected constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.cRank = this.getController("c1");
		this.cColor = this.getController("c2");
		this.cState = this.getController("c3");
		this.rankTxt = this.getChild("txt_rank").asTextField;
		this.stateTxt = this.getChild("txt_state").asTextField;
		this.flagLoader = <GLoader>this.getChild("loader_flag");
		this.infoTxt = this.getChild("txt_info").asRichTextField;
		this.getChild("btn_apply").addClickListener(this.clickApply, this);
	}

	public setData(data: any): void {
		this.miniGuildInfo = data;
		let rank: number = this.miniGuildInfo.rank_I;
		if (rank <= 3) {
			this.cRank.selectedIndex = rank - 1;
		} else {
			this.cRank.selectedIndex = 3;
			this.rankTxt.text = rank.toString();
		}
		if (rank % 2 == 0) {
			this.cColor.selectedIndex = 1;
		} else {
			this.cColor.selectedIndex = 0;
		}
		let info: string = `${this.miniGuildInfo.guildName_S}\n盟主：${this.miniGuildInfo.leaderName_S}\n成员：${this.miniGuildInfo.playerNum_I}/${this.miniGuildInfo.maxPlayerNum_I}\n等级：<font color="#fea700">${this.miniGuildInfo.level_I}</font>`;
		this.infoTxt.text = info;
		this.flagLoader.load(URLManager.getPackResUrl(PackNameEnum.Guild, `image_banner${this.miniGuildInfo.flag_I}`));
		if (this.miniGuildInfo.apply_B) {
			this.cState.selectedIndex = 2;
		} else {
			this.cState.selectedIndex = 0;
		}
		this.stateTxt.text = this.getStateName(this.miniGuildInfo.guildPromotionArea_BY);
	}

	public setButtonState(state: number): void {
		this.cState.selectedIndex = state;
	}

	/**更新文本值 */
	private updateTxt(name: string, value: string): void {
		this.getChild(name).asTextField.text = value;
	}

	private clickApply(): void {
		EventManager.dispatch(LocalEventEnum.GuildApply, { "guildId": this.miniGuildInfo.guildId_I });
		this.cState.selectedIndex = 2;
	}


	/**
	 * 获取争霸评级
	 */
	private getStateName(level: number): string {
		let name: string = "待定";
		if (level >= 1 && level <= 4) {
			name = "神级";
		} else if (level >= 5 && level <= 8) {
			name = "仙级";
		} else if (level >= 9 && level <= 12) {
			name = "天级";
		} else if (level >= 13 && level <= 16) {
			name = "地级";
		}
		return name;
	}
}