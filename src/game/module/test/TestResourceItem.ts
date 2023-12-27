class TestResourceItem extends ListRenderer {
	private nameTxt: fairygui.GTextField;
	private itemList: List;
	private buyBtn: fairygui.GButton;
	private itemDatas: Array<ItemData>;

	protected constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.nameTxt = this.getChild("txt_system").asTextField;
		this.itemList = new List(this.getChild("list_item").asList);
		this.buyBtn = this.getChild("btn_receive").asButton;
		this.buyBtn.addClickListener(this.clickBuy, this);
	}

	public setData(data: any) {
		this.itemDatas = [];
		if (data != null) {
			this.nameTxt.text = data["name"];
			for (let code of (data["code"] + "").split("#")) {
				this.itemDatas.push(new ItemData(code));
			}
			this.itemList.data = this.itemDatas;
		}
	}

	private clickBuy(): void {
		for (let itemData of this.itemDatas) {
			let overlay: number = itemData.getOverlay();
			if (overlay == 0) {
				overlay = 1;
			}
			ProxyManager.test.addItem(itemData.getCode(), overlay);
		}
	}
}