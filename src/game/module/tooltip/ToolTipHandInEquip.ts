/**
 * 上交装备
 */
class ToolTipHandInEquip extends ToolTipBase {
	private equipList: List;
	private itemDatas: Array<ItemData>;

	public constructor() {
		super(PackNameEnum.Common, "ToolTipHandInEquip");
	}

	public initUI(): void {
		super.initUI();
		this.equipList = new List(this.getGObject("list_equip").asList);
		this.getGObject("btn_handIn").addClickListener(this.handIn, this);
	}

	public setToolTipData(toolTipData: ToolTipData) {
		super.setToolTipData(toolTipData);
		this.itemDatas = this.toolTipData.data;
		this.equipList.setVirtual(this.itemDatas, this.setItemRenderer, this);
	}

	private setItemRenderer(index: number, listItem: fairygui.GComponent): void {
		let itemData: ItemData = this.itemDatas[index];
		let baseItem: BaseItem = <BaseItem>listItem.getChild("baseItem");
		let nameTxt: fairygui.GRichTextField = listItem.getChild("txt_name").asRichTextField;
		baseItem.itemData = itemData;
		nameTxt.text = itemData.getName(true);
		baseItem.enableToolTipOpt = false;
		baseItem.showBind();
	}

	private handIn(): void {
		let itemData: ItemData = this.equipList.selectedData;
		let baseItem:BaseItem = this.equipList.selectedItem;
		if (itemData != null) {
			EventManager.dispatch(LocalEventEnum.TaskHandInEquip, itemData.getUid());
			ToolTipManager.hide();
		} else {
			Tip.showTip("请选择要上交的装备");
		}
	}
}