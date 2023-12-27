/**
 * 获得红装飘提示
 * @author zhh
 * @time 2018-07-25 15:27:15
 */
class ReceiveItemTips extends BaseContentView {
    private static _inst:ReceiveItemTips;
    private baseItem:BaseItem;
    private txtName:fairygui.GTextField;
    private txtDesc:fairygui.GTextField;

	public constructor() {
		super(PackNameEnum.ReceiveItemTips,"ReceiveItemTips",null,LayerManager.UI_Tips);
        this.touchable = false;
                
	}

    public static get inst(): ReceiveItemTips {
		if (!ReceiveItemTips._inst) {
			ReceiveItemTips._inst = new ReceiveItemTips();
		}
		return ReceiveItemTips._inst;
	}

	public initOptUI():void{
        //---- script make start ----
        this.baseItem = <BaseItem>this.getGObject("baseItem");
        this.txtName = this.getGObject("txt_name").asTextField;
        this.txtDesc = this.getGObject("txt_desc").asTextField;

        //---- script make end ----
        this.baseItem.isShowName = false;

	}

	public updateAll(data?:any):void{
		let item:ItemData = data.item;
        this.updateItem(item);
        this.x = data.x + (data.width - this.width) / 2;
		this.y = data.y;
        this.doTween();
	}
    private updateItem(item:ItemData):void{
        this.txtName.text = item.getName(true); 
        this.baseItem.itemData = item; 
    }
    private doTween(): void {
		let tw:egret.Tween = egret.Tween.get(this).to({ y: this.y - 162 }, 1000, egret.Ease.circOut).to({}, 1000);
        tw.call(this.doNext,this);
	}

    private doNext():void{
        this.hide();
        let item:ItemData = CacheManager.pack.getNextItemTipData();
        if(item){
            EventManager.dispatch(LocalEventEnum.HomeShowReceiveItemTips,item);
        }

    }

}