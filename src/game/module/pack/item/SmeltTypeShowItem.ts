/**
 * 合成展示item
 * @author zhh
 * @time 2018-10-09 11:54:27
 */
class SmeltTypeShowItem extends ListRenderer {
    private btnSmelt:fairygui.GButton;
    private imgEq:fairygui.GImage;
    private listItem:List;
    private c1:fairygui.Controller;
    private c2:fairygui.Controller;
    private baseItem:BaseItem;
	public constructor() {
		super();
		
	}
	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
        //---- script make start ----
        this.c1 = this.getController("c1");
        this.c2 = this.getController("c2");
        this.imgEq = this.getChild("img_eq").asImage;
        this.btnSmelt = this.getChild("btn_smelt").asButton;
        this.listItem = new List(this.getChild("list_item").asList);
        this.baseItem = <BaseItem>this.getChild("baseItem");

        this.btnSmelt.addClickListener(this.onGUIBtnClick, this);
        //this.listItem.list.addEventListener(fairygui.ItemEvent.CLICK,this.onGUIListSelect,this);
        //---- script make end ----


	}
	public setData(data:any,index:number):void{		
		this._data = data;
		this.itemIndex = index;
        let materItems:ItemData[] = RewardUtil.getRewards(this._data.smeltMaterialList);
        let isAdd:boolean = materItems.length>1; //是否+号
        let tIdx:number;
        if(materItems.length>2){
            tIdx = 1;
        }else if(materItems.length>1){
            tIdx = 2;
        }else{
            tIdx = 0;
        }
        this.c1.setSelectedIndex(tIdx);

        let prod:ItemData = new ItemData(this._data.showItemCode);
        this.baseItem.itemData = prod;

        let smeltItems:any[] = [];
        let len:number = materItems.length;
        let isItemOK:boolean = true;

        for(let i:number=0;i<len;i++){
            let idx:number = 0;
            if(isAdd){
                if(i==len-1){
                    idx = 2; //
                }else{
                    idx = 0;//+号
                }
            }else{
                //必然是X号;也有=号
                idx = 1;
            }            
            if(isItemOK){
                let info:any = ConfigManager.smeltPlan.getSmeltCateInfo(this._data.smeltCategory,this._data.smeltType);
                let code:number = materItems[i].getCode();
                let c:number = CacheManager.pack.getItemCount(code,true);
                if(info.smeltClass==ESmeltClassType.ESmeltClassTypePetEquip && CacheManager.pet.isEquip(code)){
                    c++;                    
                }
                if(c<materItems[i].getItemAmount()){
                    isItemOK = false;
                }
            }
            smeltItems.push({item:materItems[i],tIdx:tIdx,idx:idx,isItemOK:isItemOK});           
        }        

        this.listItem.data = smeltItems;
        let idx:number = !isItemOK?1:0;
        this.c2.setSelectedIndex(idx);
        App.DisplayUtils.grayButton(this.btnSmelt,!isItemOK,!isItemOK);
        this.listItem.list.setBoundsChangedFlag();
        this.baseItem.grayed = !isItemOK;
        this.imgEq.grayed = !isItemOK;
        this.baseItem.setColorMcGrayed(!isItemOK);
        CommonUtils.setBtnTips(this.btnSmelt,isItemOK);
	}
    protected onGUIBtnClick(e:egret.TouchEvent):void{
        var btn: any = e.target;
        switch (btn) {
            case this.btnSmelt:
                EventManager.dispatch(LocalEventEnum.ComposeReqPlan,this._data.smeltPlanCode);
                App.SoundManager.playEffect(SoundName.Effect_QiangHuaChengGong);
                break;

        }
    }
    /*
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
    */


}