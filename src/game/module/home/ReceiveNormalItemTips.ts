/**
 * 获得普通物品的提示
 * @author zxd
 * @time 2018-09-25
 */

class ReceiveNormalItemTips extends BaseContentView {

    private static _inst:ReceiveNormalItemTips;
    private baseItem:BaseItem;
    private txtName:fairygui.GRichTextField;


    public constructor() {
		super(PackNameEnum.Home,"ItemReceive",null,LayerManager.UI_Tips);
	}

    public static get inst(): ReceiveNormalItemTips {
		if (!ReceiveNormalItemTips._inst) {
			ReceiveNormalItemTips._inst = new ReceiveNormalItemTips();
		}
		return ReceiveNormalItemTips._inst;
	}

    public initOptUI():void{
        //---- script make start ----
        this.baseItem = <BaseItem>this.getGObject("baseItem");
        this.txtName = this.getGObject("txt_name").asRichTextField;

        //---- script make end ----
        this.baseItem.isShowName = false;

	}

    public updateAll(data?:any) : void {
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
		egret.Tween.get(this).to({ y: this.y - 162 }, 1000, egret.Ease.circOut).to({}, 1000).call(() => {
			this.doNext();
		}, this);
	}

    private doNext():void{
        this.hide();
        let item:ItemData = CacheManager.pack.getNextNormalItemTipData();
        if(item){
            EventManager.dispatch(LocalEventEnum.HomeShowReceiveNormalItemTips,item);
        }

    }


}