/**
 * 仙盟列表申请窗口
 */
class GuildApplyModule extends BaseModule {
	private c1: fairygui.Controller;
	private guildList: List;
	private nameInput: fairygui.GTextInput;
	private oneKeyBtn: fairygui.GButton;

	public constructor(moduleId: ModuleEnum, ) {
		super(moduleId, PackNameEnum.Guild, "WindowGuildListApply");
	}

	public initOptUI(): void {
		this.c1 = this.getController("c1");
		this.guildList = new List(this.getGObject("list_guild").asList);
		this.getGObject("btn_create").addClickListener(this.clickCreate, this);
		this.getGObject("btn_search").addClickListener(this.clickSearch, this);
		this.oneKeyBtn = this.getGObject("btn_oneKeyApply").asButton;
		this.oneKeyBtn.addClickListener(this.clickOneKeyApply, this);
		this.nameInput = this.getGObject("input_name").asTextInput;

		this.title = `${PackNameEnum.Guild}_0`;

		//红点
		CommonUtils.setBtnTips(this.oneKeyBtn, CacheManager.guild.isNeedNotice);
	}

	public updateAll(): void {

	}

	public updateByGuildId(guildId: number): void {

	}

	/**
	 * 根据搜索结果返回
	 * @param data S2C_SSearchGuilds
	 * myRank totalNum guilds
	 */
	public updateBySearchResponse(data: any): void {
		let totalNum: number = data.totalNum;
		this.guildList.data = data.guilds.data;
		let searchName: string = App.StringUtils.trimSpace(this.nameInput.text);
		if (searchName == "") {//没搜索条件
			if (totalNum == 0) {
				this.c1.selectedIndex = 1;//暂无仙盟
			} else {
				this.c1.selectedIndex = 0;
			}
		} else {
			if (totalNum == 0) {
				this.c1.selectedIndex = 2;//搜索不到
			} else {
				this.c1.selectedIndex = 0;
			}
		}
	}

	private clickCreate(): void {
		EventManager.dispatch(UIEventEnum.GuildCreateOpen);
	}

	private clickSearch(): void {
		let name: string = App.StringUtils.trimSpace(this.nameInput.text);
		EventManager.dispatch(LocalEventEnum.GuildSearch, { "name": name, "includeFull": true });
	}

	private clickOneKeyApply(): void {
		EventManager.dispatch(LocalEventEnum.GuildApplyOneKey);
	}
}