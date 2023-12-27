/**
 * 日常Tip
 */
class ToolTipDaily extends ToolTipBase {
	private iconLoader: GLoader;
	private nameTxt: fairygui.GTextField;
	private timeTxt: fairygui.GTextField;
	private activeTimeTxt: fairygui.GTextField;
	private levelTxt: fairygui.GTextField;
	private descTxt: fairygui.GTextField;
	private expTxt: fairygui.GTextField;
	private rewardList: List;

	private openCfg: any;

	public constructor() {
		super(PackNameEnum.Common, "ToolTipDaily");
	}

	public initUI(): void {
		super.initUI();
		this.iconLoader = <GLoader>this.getGObject("loader_icon");
		this.nameTxt = this.getGObject("txt_name").asTextField;
		this.timeTxt = this.getGObject("txt_time").asTextField;
		this.activeTimeTxt = this.getGObject("txt_activeTime").asTextField;
		this.levelTxt = this.getGObject("txt_level").asTextField;
		this.descTxt = this.getGObject("txt_desc").asTextField;
		this.expTxt = this.getGObject("txt_exp").asTextField;
		this.rewardList = new List(this.getGObject("list_reward").asList);
	}

	//t_mg_sword_pool_event
	public setToolTipData(toolTipData: ToolTipData) {
		super.setToolTipData(toolTipData);
		if (toolTipData) {
			let data: any = toolTipData.data;
			this.iconLoader.load(URLManager.getPackResUrl(PackNameEnum.Daily, `img_idx${data.idx}`));
			this.nameTxt.text = data.name;
			if (data.time != null) {
				this.timeTxt.text = `${CacheManager.daily.getEventTime(data.event)}/${data.time}`;
			}else{
				this.timeTxt.text = "";
			}
			this.activeTimeTxt.text = data.timeDesc;
			this.openCfg = ConfigManager.mgOpen.getByOpenKey(data.openKey);
			let level: number = 0;
			if (this.openCfg && this.openCfg.openLevel != null) {
				level = this.openCfg.openLevel;
			}
			this.levelTxt.text = `达到${level}级`;
			this.descTxt.text = data.desc;
			let exp: number = 0;
			if (data.exp != null) {
				exp = data.exp;
			}
			this.expTxt.text = exp.toString();
			this.rewardList.data = RewardUtil.getRewards(data.showReward);
		}
	}
}