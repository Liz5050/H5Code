/**
 * 礼包选中窗口
 */

class PackGiftChooseWindow extends BaseWindow {
	private tipTxt: fairygui.GRichTextField;
	private itemList: List;
	private numberInput: NumberInput;
	private chooseBtn: fairygui.GButton;

	private itemData: ItemData;
	private rewards: Array<ItemData>;

	public constructor() {
		super(PackNameEnum.Pack, "WindowGiftChoose");
	}

	public initOptUI() {
		this.tipTxt = this.getGObject("txt_tip").asRichTextField;
		this.itemList = new List(this.getGObject("list_item").asList);
		this.numberInput = <NumberInput>this.getGObject("numberInput");
		this.numberInput.showExBtn = true;
		this.chooseBtn = this.getGObject("btn_choose").asButton;
		this.chooseBtn.addClickListener(this.clickChoose, this);
	}

	public updateAll(data: any = null): void {
		this.itemData = data.itemData;
		this.numberInput.max = this.itemData.getItemAmount();
		this.numberInput.value = 1;
		this.rewards = ConfigManager.chooseGiftBag.getRewards(this.itemData.getEffect());
		this.itemList.data = this.rewards;
		this.itemList.selectedIndex == -1;
		this.itemList.list.resizeToFit();
		this.view.setSize(this.view.width, this.frame.height * 0.8);
	}

	private clickChoose(): void {
		if (this.itemList.selectedIndex == -1) {
			Tip.showTip("请选择一个道具");
			return;
		}
		let num: number = this.numberInput.value;
		ProxyManager.pack.useItem(this.itemData.getUid(), num, [this.itemList.selectedIndex.toString()]);
		this.hide();
	}
}