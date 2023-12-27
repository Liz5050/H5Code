/**
 * 图鉴获取途径界面
 */

class TrainIllustratePropGet extends BaseWindow {

    private _data:any;
    private _item:TrainIllustrateItem;
    private getList: List;
    private oHeight: number = 0;
    private itemCode: number;
    private cfg : any;

    public constructor() {
		super(PackNameEnum.TrainIllustratePanel, "TrainIllustratePropGet");
	}

    public initOptUI(): void{
        this._item = this.getGObject("illustrate_item") as TrainIllustrateItem;
        this._item.isUpgrateUI = true;
        this.getList = new List(this.getGObject("list_getItem").asList);
        this.getList.list.addEventListener(fairygui.ItemEvent.CLICK, this.onClickItem, this);
	}


    public updateAll(data: any = null): void {
        this.oHeight = 638;
		this.itemCode = data.position;
        this._data = data;
        this._item.setData(data, 0);
        this._item.setGrayed(false);
        this.getList.data = ConfigManager.propGet.getDataById(this.itemCode);
        this.frame.height = this.oHeight + 80 * (this.getList.data.length-1);
        this.view.setSize(this.view.width,this.frame.height*0.86 - 30);
        this.center();
	}

    private onClickItem(): void {
        EventManager.dispatch(LocalEventEnum.TrainHideGetWindow);
        EventManager.dispatch(LocalEventEnum.TrainHideIllustrateUpgrateView);
    }
}