/**
 * 符文背包窗口
 */
class RunePackWindow extends BaseWindow{
	private controller: fairygui.Controller;
	private numberTxt: fairygui.GTextField;
	private towerBtn: fairygui.GButton;
	private runeInlayItem: RunePackItem;
	private runeList: List;
	private inlayData: any;
	private _hole: number;
	private _roleIndex: number;
	private packItem: Array<any>;

	public constructor() {
		super(PackNameEnum.Rune, "WindowRunePack");
	}
	public initOptUI():void{
		// this.numberTxt = this.getGObject("txt_number").asTextField;
		this.controller = this.getController("c1");
		this.towerBtn = this.getGObject("btn_tower").asButton;
		this.runeInlayItem = <RunePackItem>this.getGObject("runeInlayItem").asCom;
		this.runeList = new List(this.getGObject("list_rune").asList);
		this.runeList.list.addEventListener(fairygui.ItemEvent.CLICK, this.onClickItem, this);
		this.towerBtn.addClickListener(this.clickTowerBtn, this);
	}

	/**
	 * @param hole 当前选择镶嵌/替换符文孔位 
	 */
	public updateAll(data: any):void{
		this.inlayData = data["inlayData"]
		this._roleIndex = data["roleIndex"];
		if(this.inlayData["hole"]){
			this._hole = this.inlayData["hole"];
		}else{
			this._hole = -1;
		}
		this.updateInlayRune();
		this.updateRuneList();
	}

	/**点击打开符文塔 */
	private clickTowerBtn(): void{
		// EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.CopyHall, { "tabIndex": 0 , "cName": "c2"});
		EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.CopyHall, { "tabType": PanelTabType.CopyHallTower });
		this.hide();
	}

	private updateInlayRune(): void{
		if(this.inlayData["item"]){
			let itemData: ItemData = new ItemData(this.inlayData["item"]);
			let data: any = {"itemData": itemData, "inlay": 2, "level": this.inlayData["level"]}
			this.runeInlayItem.setData(data);
			this.controller.selectedIndex = 1;
		}else{
			this.controller.selectedIndex = 0;
		}
	}

	/**更新符文背包列表 */
	private updateRuneList():void{
		let inlayStatus: number = 0; 
		let level: number = 0;
		let itemDatas: Array<ItemData> = CacheManager.rune.getInlayItem();
		this.packItem = [];
		for(let itemData of itemDatas){
			if(CacheManager.rune.hasRuneType(this._roleIndex, itemData, this._hole)){
				inlayStatus = 0;
			}else{
				inlayStatus = 1;
			}

			level = itemData.getItemExtInfo().level;
			this.packItem.push({"itemData": itemData, "inlay": inlayStatus, "level": level, "hole": this._hole, "roleIndex": this._roleIndex});
		}
		this.sortRunePack();
		this.runeList.setVirtual(this.packItem);
		if(this.packItem.length > 0){
			this.runeList.scrollToView(0);
		}

		if(this.packItem.length > 0) {
			let runePackItem: RunePackItem = <RunePackItem>this.runeList.list._children[0];
			GuideTargetManager.reg(GuideTargetName.RunePackWindowPackItem1, runePackItem.dressRuneBth);
		}
	}

	/**符文背包排序 */
	public sortRunePack():void{
		if(this.packItem && this.packItem.length > 0){
			this.packItem.sort((a: any, b:any): number =>{
				return this.getRuneSort(a,b);
				// return this.getRuneSort(a) - this.getRuneSort(b);
			});
		}
	}

	public getPackItem(index:number=0):RunePackItem{
		return <RunePackItem>this.runeList.list._children[index];
	}

	private getRuneSort(a:any, b:any):number{
		// if(CacheManager.runeInlay.isCanInlay(this._roleIndex, data["itemData"], this._hole)){
		// 	data["inlay"] = 1;//可镶嵌或替换属性
		// 	return -(data["itemData"].getColor()*100 + data["itemData"].getType());//先按颜色排，再根据type排
		// }else{
		// 	data["inlay"] = 0;//已有属性
		// 	return data["itemData"].getCode()-(data["itemData"].getColor()*50 + data["itemData"].getType());//已镶嵌属性排后面
		// }
		if(a.inlay > b.inlay){
			return -1;
		}else if(a.inlay < b.inlay){
			return 1;
		}else{
			if(a.itemData.getColor() > b.itemData.getColor()){
				return -1;
			}else if(a.itemData.getColor() < b.itemData.getColor()){
				return 1;
			}else{
				if(a.level > b.level){
					return -1;
				}else if(a.level < b.level){
					return 1;
				}else{
					if(a.itemData.getType() > b.itemData.getType()){
						return -1;
					}else if(a.itemData.getType() < b.itemData.getType()){
						return 1;
					}else{
						return 0;
					}
				}
			}
		}
	}

	/**点击符文物品项 */
	private onClickItem(e: fairygui.ItemEvent): void{
		// let runePackItem: RunePackItem = <RunePackItem>e.itemObject;
		// if(this._hole > -1){
		// 	ProxyManager.rune.dressRune(this._hole, runePackItem.getData().getUid());
		// }
		// this.hide();
	}
}