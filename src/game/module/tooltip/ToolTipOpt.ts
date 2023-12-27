/**
 * 文本操作Tip
 */
class ToolTipOpt extends ToolTipBase {
	private optList: List;

	public constructor() {
		super(PackNameEnum.Common, "ToolTipOpt");
	}

	public initUI(): void {
		super.initUI();
		this.optList = new List(this.getGObject("list_opt").asList);
		this.optList.list.addEventListener(fairygui.ItemEvent.CLICK, this.onClickItem, this);
	}

	public setToolTipData(toolTipData: ToolTipData) {
		super.setToolTipData(toolTipData);
		if (toolTipData) {
			this.optList.data = toolTipData.data;
		} else {
			this.optList.data = null;
		}
		this.optList.list.resizeToFit();
	}

	/**点击操作 */
	private onClickItem(e: fairygui.ItemEvent): void {
		let txtOpt: TxtOpt = <TxtOpt>e.itemObject;
		if (txtOpt != null) {
			let data: any = txtOpt.getData()
			let optData: any = data.data;//SGuildInfo
			let playerId: number = -1;
			if (optData.miniPlayer != null) {
				let miniPlayer: any = optData.miniPlayer;
				playerId = miniPlayer.entityId.id_I;
			}

			switch (data.type) {
				case ToolTipOptEnum.GuildKickOut:
					EventManager.dispatch(LocalEventEnum.GuildKickOut, optData);
					break;
				case ToolTipOptEnum.GuildTransferLeader:
					EventManager.dispatch(LocalEventEnum.GuildTransferLeader, { "toPlayerId": playerId });
					break;
				case ToolTipOptEnum.GuildPromoteDeputyLeader:
					EventManager.dispatch(LocalEventEnum.GuildPromoteDeputyLeader, { "toPlayerId": playerId });
					break;
				case ToolTipOptEnum.GuildPromotePresbyter:
					EventManager.dispatch(LocalEventEnum.GuildPromotePresbyter, { "toPlayerId": playerId });
					break;
				case ToolTipOptEnum.GuildRelieveDeputyLeader:
					EventManager.dispatch(LocalEventEnum.GuildRelieveDeputyLeader, { "toPlayerId": playerId });
					break;
				case ToolTipOptEnum.GuildRelievePresbyter:
					EventManager.dispatch(LocalEventEnum.GuildRelievePresbyter, { "toPlayerId": playerId });
					break;
				case ToolTipOptEnum.ViewPlayerInfo:
					EventManager.dispatch(LocalEventEnum.CommonViewPlayerMenu, { "toEntityId": optData.miniPlayer.entityId });
					break;
			}
			ToolTipManager.hide();
		}
	}
}