class ToolTipCompose  extends ToolTipBase {
	private btnList: fairygui.GList;
	private gemList: fairygui.GList;
	private itemDatas: Array<ItemData>;
	private equipUids: string;
	private pos: number;
	private _data: any;

	public constructor() {
		super(PackNameEnum.Common, "ToolTipCompose");
	}

	public initUI(): void {
		super.initUI();
		// this.btnList = this.getGObject("list_btn").asList;
		this.gemList = this.getGObject("list_gem").asList;
		this.gemList.addEventListener(fairygui.ItemEvent.CLICK, this.clickItem, this);
		
	}

	public setToolTipData(toolTipData: ToolTipData){
		super.setToolTipData(toolTipData);
		let items: ItemData[];
		this.itemDatas = [];
		this._data = toolTipData.data;
		if(toolTipData.extData){
			this.pos = toolTipData.extData["pos"];
			this.equipUids = toolTipData.extData["uids"];
		}
		// this.getItemsCanCompose();
		items = WeaponUtil.getItemsCanCompose(toolTipData.data);
		for(let itemData of items){
			if(!this.equipUids[`${itemData.getUid()}`]){
				this.itemDatas.push(itemData);
			}
		}
		this.gemList.removeChildrenToPool();
		if(this.itemDatas.length > 0){
			for(let itemData of this.itemDatas){
				let item: fairygui.GComponent = this.gemList.addItemFromPool().asCom;
				let baseItem: BaseItem = <BaseItem>item.getChild("baseItem");
				let mosaicTxt: fairygui.GTextField = item.getChild("txt_name").asTextField;
				baseItem.itemData = itemData;
				baseItem.touchable = false;
				mosaicTxt.text = itemData.getName();
			}
		}
	}

	private clickItem(e: any):void{
		let baseItem: BaseItem = e.itemObject.getChild("baseItem");
		// let itemData = baseItem.itemData;
		let equipData: any = {"itemData": baseItem.itemData, "pos": this.pos};
		EventManager.dispatch(LocalEventEnum.ComposeSelectedEquip, equipData);
		ToolTipManager.hide();
	}
}