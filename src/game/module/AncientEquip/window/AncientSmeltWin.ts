/**
 * 传世装备分解界面
 * @author zhh
 * @time 2018-08-24 15:51:31
 */
class AncientSmeltWin extends BaseWindow {
    private loaderBg:GLoader;
    private listItem:List;
    private gainView:AncientEquipGainView;
    private _data:any;
	public constructor() {
		super(PackNameEnum.AncientEquip,"AncientSmeltWin")

	}
	public initOptUI():void{
        //---- script make start ----
        this.loaderBg = <GLoader>this.getGObject("loader_bg");
        this.listItem = new List(this.getGObject("list_item").asList);
        this.gainView = new AncientEquipGainView(this.getGObject("gain_com").asCom);
        this.listItem.list.addEventListener(fairygui.ItemEvent.CLICK,this.onGUIListSelect,this);
        //---- script make end ----
        this.loaderBg.load(URLManager.getModuleImgUrl("bg/popup_bg.png",PackNameEnum.Common));
        // this.titleIcon = "AncientEquip_smelt";
        // this.title = "";
	}

	public updateAll(data?:any):void{
        this._data = data;
        if(this._data){
            let items:ItemData[] = CacheManager.pack.propCache.getByCT(ECategory.ECategoryProp,EProp.EPropForeverEquipProp);
            let datas:any[] = [];
            for(let i:number=0;i<items.length;i++){
                datas.push({roleIndex:this._data.roleIndex,item:items[i]});
            }
            this.listItem.setVirtual(datas);
            this.gainView.updateAll({itemCode:22000000});
        }		
        
	}
    public getData():any{
        return this._data;
    }
    protected onGUIListSelect(e:fairygui.ItemEvent):void{
        var item:ListRenderer = <ListRenderer>e.itemObject;
        if(item){
            
        }

        var list: any = e.target;
        switch (list) {
            case this.listItem.list:
                break;

        }
               
    }


}