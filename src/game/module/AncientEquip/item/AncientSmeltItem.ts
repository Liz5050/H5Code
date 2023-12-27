/**
 * 分解item
 * @author zhh
 * @time 2018-08-24 16:02:57
 */
class AncientSmeltItem extends ListRenderer {
    private txtEquipName:fairygui.GTextField;
    private txtGet:fairygui.GTextField;
    private txtTip:fairygui.GTextField;
    private btnSmelt:fairygui.GButton;
    private baseItem:BaseItem;


	public constructor() {
		super();
		
	}
	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
        //---- script make start ----
        this.txtEquipName = this.getChild("txt_equipName").asTextField;
        this.txtGet = this.getChild("txt_get").asTextField;
        this.txtTip = this.getChild("txt_tip").asTextField;
        this.btnSmelt = this.getChild("btn_smelt").asButton;
        this.baseItem = <BaseItem>this.getChild("baseItem");
        this.baseItem.isShowName = false;
        this.btnSmelt.addClickListener(this.onGUIBtnClick, this);
        //---- script make end ----


	}
	public setData(data:any,index:number):void{		
		this._data = data;
		this.itemIndex = index;
        let itemData:ItemData = this._data.item;
        let isRecom:boolean = false;
        if(itemData){
            this.baseItem.itemData = itemData; 
            this.txtEquipName.text = itemData.getName(false);
            let pos:number = itemData.getItemInfo().effect;
            isRecom = CacheManager.ancientEquip.isPosAct(this._data.roleIndex,pos);
            let cfg:any = ConfigManager.itemTransfer.getByPk(itemData.getCode());
            let getItem:ItemData = new ItemData(cfg.materialItemCode);
            this.txtGet.text = getItem.getName()+"x"+cfg.amount;
        } 
        this.txtTip.visible = isRecom;
	}
    protected onGUIBtnClick(e:egret.TouchEvent):void{
        var btn: any = e.target;
        switch (btn) {
            case this.btnSmelt:
                if(this._data){
                    let itemData:ItemData = this._data.item;
                    let uids:string[] = [itemData.getUid()];
                    EventManager.dispatch(LocalEventEnum.AncientEquipReqSmelt,{uids:uids,posType:EPlayerItemPosType.EPlayerItemPosTypeProp});
                }                
                break;

        }
    }


}