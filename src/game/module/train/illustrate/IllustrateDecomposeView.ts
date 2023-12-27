/**
 * 图鉴分解
 */
class IllustrateDecomposeView extends BaseWindow {
	
	private controller: fairygui.Controller;
	private equipList: List;
	private itemDatas: Array<ItemData>;
	private btnGet : fairygui.GButton;

	public constructor() {
		super(PackNameEnum.TrainIllustratePanel, "WindowDecompose");
		
	}

	public initOptUI(): void{
		this.controller = this.getController("c1");
		this.equipList = new List(this.getGObject("list_equipDecompose").asList);
		this.btnGet = this.getGObject("btn_lottery").asButton;
		this.btnGet.addClickListener(this.clickToGet, this);
	}

	public clickToGet() : void {
		this.hide();
		EventManager.dispatch(UIEventEnum.GoToGetIllustrate);
	}

	/**模块显示时开启的监听 */
    protected addListenerOnShow(): void {
        //for override
        this.addListen1(LocalEventEnum.TrainIllustrateDecomposeClick, this.onDecomposeItemClick, this);
    }

	public updateAll(): void{
		this.itemDatas = [];
		let datas = WeaponUtil.getIllustratesCanDecompose();
		for(let data of datas) {
			for(let i=1; i<=data.getItemAmount(); i++) {
				this.itemDatas.push(data);
			}
		}
		this.updateEquipList();
	}

	public updateItemDatas(uid: string): void{
		if(this.itemDatas.length > 0){
			for(let i = 0; i < this.itemDatas.length; i++){
				if(this.itemDatas[i].getUid() == uid){
					this.itemDatas.splice(i, 1);//删除已分解的装备
					break;
				}
			}
			this.updateEquipList();
		}
	}

	private updateEquipList(): void{
		if(this.itemDatas.length > 0){
			this.controller.selectedIndex = 0;
		}else{
			this.controller.selectedIndex = 1;
		}
		this.equipList.setVirtual(this.itemDatas);
	}

	//点击移除
	private onDecomposeItemClick(uid:string):void {
		this.updateItemDatas(uid);
	}

}