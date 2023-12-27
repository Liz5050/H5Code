/**
 * 仙盟成员
 */
class GuildMemberPanel extends BaseTabPanel {
	private memberList: List;
	private numTxt: fairygui.GTextField;
	private exitBtn: fairygui.GButton;
	private toolTipData: ToolTipData;
	private sortBtns: Array<fairygui.GButton>;
	private members: Array<any>;

	public initOptUI() {
		this.memberList = new List(this.getGObject("list_member").asList);
		this.numTxt = this.getGObject("txt_number").asTextField;
		this.exitBtn = this.getGObject("btn_exit").asButton;
		this.exitBtn.addClickListener(this.clickExit, this);
		this.memberList.list.addEventListener(fairygui.ItemEvent.CLICK, this.onClickItem, this);

		this.sortBtns = [];
		let btnNames: Array<string> = ["btn_member", "btn_level", "btn_fight", "btn_contribution", "btn_online"];
		let btn: fairygui.GButton;
		for (let name of btnNames) {
			btn = this.getGObject(name).asButton;
			this.sortBtns.push(btn);
			btn.addClickListener(this.clickSortBtn, this);
		}
	}

	public updateAll() {
		EventManager.dispatch(LocalEventEnum.GuildGetMemberList, { "guildId": 0 });
	}

	public updateMembers(members: Array<any>): void {
		this.members = members;
		this.memberList.data = members;
		this.numTxt.text = `${this.getOnlineNum(members)}/${members.length}`;
		this.sortDefault();
	}

	private getOnlineNum(members: Array<any>): number {
		let num: number = 0;
		for (let m of members) {
			if (m.miniPlayer.online_BY) {
				num++;
			}
		}
		return num;
	}

	/**
	 * 默认排序。在线——>职位降序
	 */
	private sortDefault(): void {
		for (let btn of this.sortBtns) {
			btn.selected = false;
		}
		// this.sortByPosition(true);
		this.members.sort((a: any, b: any): number => {
			let aOnline: number = a.miniPlayer.online_BY;
			let bOnline: number = b.miniPlayer.online_BY;
			if (aOnline > bOnline) {
				return -1;
			} else if (aOnline < bOnline) {
				return 1;
			} else {
				return b.position_I - a.position_I;
			}
		});
	}

	private sortByPosition(isDesc: boolean): void {
		this.members.sort((a: any, b: any): number => {
			if (isDesc) {
				return b.position_I - a.position_I;
			} else {
				return a.position_I - b.position_I;
			}
		});
		this.memberList.data = this.members;
	}

	/**
	 * 点击排序按钮，默认降序
	 */
	private clickSortBtn(e: any): void {
		let btn: fairygui.GButton = e.target;
		let isDesc: boolean = !btn.selected;
		let name: string = btn.name;
		switch (name) {
			case "btn_member":
				this.sortByPosition(isDesc);
				break;
			case "btn_level":
				this.members.sort((a: any, b: any): number => {
					if (isDesc) {
						return b.miniPlayer.level_SH - a.miniPlayer.level_SH;
					} else {
						return a.miniPlayer.level_SH - b.miniPlayer.level_SH;
					}
				});
				break;
			case "btn_fight":
				this.members.sort((a: any, b: any): number => {
					if (isDesc) {
						return b.miniPlayer.warfare_I - a.miniPlayer.warfare_I;
					} else {
						return a.miniPlayer.warfare_I - b.miniPlayer.warfare_I;
					}
				});
				break;
			case "btn_contribution":
				this.members.sort((a: any, b: any): number => {
					if (isDesc) {
						return b.totalContribution_I - a.totalContribution_I;
					} else {
						return a.totalContribution_I - b.totalContribution_I;
					}
				});
				break;
			case "btn_online":
				this.members.sort((a: any, b: any): number => {
					if (isDesc) {
						return b.miniPlayer.online_BY - a.miniPlayer.online_BY;
					} else {
						return a.miniPlayer.online_BY - b.miniPlayer.online_BY;
					}
				});
				break;
		}
		this.memberList.data = this.members;
	}

	/**
	 * 退出/解散
	 */
	private clickExit(): void {
		EventManager.dispatch(LocalEventEnum.GuildExit);
	}

	private onClickItem(e: fairygui.ItemEvent): void {
		let item: GuildMemberListItem = <GuildMemberListItem>e.itemObject;
		if (item != null) {
			let guildPlayer: any = item.getData();
			let optList: Array<any> = CacheManager.guild.getMemberOptList(guildPlayer);
			if (optList.length > 0) {
				if (!this.toolTipData) {
					this.toolTipData = new ToolTipData();
				}
				this.toolTipData.data = optList;
				this.toolTipData.type = ToolTipTypeEnum.Opt;
				ToolTipManager.show(this.toolTipData);
			}
		}
	}
}