/**
 * 仙盟信息
 */
class GuildInfoPanel extends BaseTabPanel {
	private nameTxt: fairygui.GTextField;
	private flagLoader: GLoader;
	private infoTxt: fairygui.GRichTextField;
	private levelTxt: fairygui.GTextField;
	private resourceBar: fairygui.GProgressBar;
	private resourceTxt: fairygui.GRichTextField;
	private noticeTxt: fairygui.GRichTextField;
	private profitTxt: fairygui.GTextField;
	private editBtn: fairygui.GButton;
	private getRewardBtn: fairygui.GButton;
	private tipBtn: fairygui.GButton;
	private upBtn: fairygui.GButton;
	private upImg: fairygui.GImage;

	private guildInfo: any;
	private guildCfg: any;


	public initOptUI() {
		this.nameTxt = this.getGObject("txt_name").asTextField;
		this.flagLoader = <GLoader>this.getGObject("loader_flag");
		this.infoTxt = this.getGObject("txt_info").asRichTextField;
		this.levelTxt = this.getGObject("txt_level").asTextField;
		this.resourceBar = this.getGObject("progressBar_resource").asProgress;
		this.resourceTxt = this.getGObject("txt_resources").asRichTextField;
		this.noticeTxt = this.getGObject("comp_notice").asCom.getChild("txt_notice").asRichTextField;
		this.profitTxt = this.getGObject("txt_profit").asTextField;

		this.upBtn = this.getGObject("btn_up").asButton;
		this.upBtn.addClickListener(this.clickUpLevel, this);
		this.upImg = this.getGObject("img_up").asImage;

		this.editBtn = this.getGObject("btn_modify").asButton;
		this.editBtn.addClickListener(this.clickModifyNotice, this);

		this.getRewardBtn = this.getGObject("btn_receive").asButton;
		this.getRewardBtn.addClickListener(this.clickGetProfit, this);

		this.tipBtn = this.getGObject("btn_explain").asButton;
		this.tipBtn.addClickListener(this.clickTipBtn, this);
	}

	public updateAll() {
	}

	/**
	 * @param guildInfo SGuildInfo
	 */
	public updateByGuildInfo(guildInfo: any): void {
		let playerGuildInfo: any = CacheManager.guild.playerGuildInfo;
		this.guildInfo = guildInfo;
		this.guildCfg = ConfigManager.guild.getByPk(guildInfo.level_I);
		this.nameTxt.text = guildInfo.guildName_S;
		this.flagLoader.load(URLManager.getPackResUrl(PackNameEnum.Guild, `image_banner${guildInfo.flag_I}`));
		let leader: any = guildInfo.leader;
		let info: string = `盟主：${leader.name_S}\n仙盟成员：${guildInfo.playerNum_I}/${guildInfo.maxPlayerNum_I}\n仙盟战力：<font color="#fea700">${guildInfo.warfare_L64}</font>\n争霸评级：<font color="#fea700">${playerGuildInfo.guildPromotionArea_BY}</font>`;
		this.infoTxt.text = info;
		this.levelTxt.text = guildInfo.level_I + "级";
		let notice: string = (guildInfo.purpose_S as string).replace(/\\n/gi, "\n")
		this.noticeTxt.text = notice;
		this.resourceTxt.text = `仙盟资金：${guildInfo.money_I}\n升级仙盟所需资金：${this.guildCfg.updateMoney}`;
		this.resourceBar.value = guildInfo.money_I;
		this.resourceBar.max = this.guildCfg.updateMoney;
		this.editBtn.visible = CacheManager.guild.isCanEditNotice;
		this.getRewardBtn.enabled = playerGuildInfo.hasDailyReward_B;
		this.upBtn.visible = CacheManager.guild.isCanLevelUp;
		this.upImg.visible = this.upBtn.visible;

		CommonUtils.setBtnTips(this.getRewardBtn, playerGuildInfo.hasDailyReward_B);
	}

	/**
	 * 升级
	 */
	private clickUpLevel(): void {
		if (this.guildInfo.money_I < this.guildCfg.updateMoney) {
			Tip.showTip("仙盟资金不足");
			return;
		}
		let tip: string = `是否花费<font color="#01AB24">${this.guildCfg.updateMoney}</font>资金升级仙盟？`;
		Alert.info(tip, () => {
			EventManager.dispatch(LocalEventEnum.GuildUpgrade);
		}, this);
	}

	/**修改公告 */
	private clickModifyNotice(): void {
		let level: number = ConfigManager.const.getConstValue("GuildPurposeChangeNeedLevel");
		if (CacheManager.guild.playerGuildInfo.level_BY < level) {
			Tip.showTip(`仙盟等级达到${level}级才可修改公告！`);
			return;
		}
		EventManager.dispatch(UIEventEnum.GuildNoticeOpen);
	}

	/**
	 * 领取福利
	 */
	private clickGetProfit(): void {
		EventManager.dispatch(LocalEventEnum.GuildGetDailyReward);
		this.getRewardBtn.enabled = false;
	}

	private clickTipBtn(): void {
		ToolTipManager.showInfoTip("仙盟盟主连续<font color='#01AB26'>48小时</font>未上线，盟主职位将自动转让给副盟主（如果不存在副盟主，将自动转让给历史贡献最高的玩家）", this.tipBtn);
	}
}