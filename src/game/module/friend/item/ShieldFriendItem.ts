class ShieldFriendItem extends ListRenderer {
	private iconLoader: GLoader;
	private nameTxt: fairygui.GTextField;
	private deleteBtn: fairygui.GButton;

	public constructor() {
		super();
	}

	public constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.iconLoader = <GLoader>this.getChild("loader_icon");
		this.nameTxt = this.getChild("txt_name").asTextField;
		this.deleteBtn = this.getChild("btn_delete").asButton;
		this.addClickListener(this.clickIcon, this);
		this.deleteBtn.addClickListener(this.clickDeleteBtn, this);
	}

	public setData(data: any): void {
		this._data = data;
		if (data) {
			this.iconLoader.load(URLManager.getPlayerHead(data.career));
			this.nameTxt.text = `${data.name}(${CareerUtil.getLevelName(data.level, data.career)})`;
		}
	}

	private clickDeleteBtn(e: egret.TouchEvent): void {
		if (this._data) {
			EventManager.dispatch(LocalEventEnum.FriendRemove, this._data.entityId.id_I, EFriendFlag.EFriendFlagBlackList);//从屏蔽列表删除
			e.stopPropagation();
		}
	}

	private clickIcon(): void {
		EventManager.dispatch(LocalEventEnum.CommonViewPlayerMenu, { toEntityId: this._data.entityId });
	}
}