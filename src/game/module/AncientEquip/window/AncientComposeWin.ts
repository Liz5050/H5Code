/**
 * 
 * @author zhh
 * @time 2018-08-27 15:42:17
 */
class AncientComposeWin extends BaseWindow {

    private baseitem0:AncientEquipItem;
    private baseitem1:AncientEquipItem;
    private baseitem2:AncientEquipItem;
    private baseitem3:AncientEquipItem;
    private baseitem4:AncientEquipItem;
    private baseitem5:AncientEquipItem;
    private baseitem6:AncientEquipItem;
    private baseitem7:AncientEquipItem;

    private loaderBg:GLoader;
    private loaderEquip:GLoader;
    private loaderIco:GLoader;
    private txtCost:fairygui.GRichTextField;
    private btnCompose:fairygui.GButton;
    private btnPath:fairygui.GButton;
    private itemLists:AncientEquipItem[];
    private curSelectItem:AncientEquipItem;
    private curMaterialItem:ItemData;
    private isItemOk:boolean = false;
    private _data:any;
    private pathItemCode:number;
    private equipContainer:fairygui.GComponent;
    private equipModel:ModelShow;
    /**是否可合成部位 */
    private isCanComposePos:boolean = false;
	public constructor() {
		super(PackNameEnum.AncientEquip,"AncientComposeWin")

	}
	public initOptUI():void{
        //---- script make start ----
        this.baseitem0 = <AncientEquipItem>this.getGObject("baseItem_0");
        this.baseitem1 = <AncientEquipItem>this.getGObject("baseItem_1");
        this.baseitem2 = <AncientEquipItem>this.getGObject("baseItem_2");
        this.baseitem3 = <AncientEquipItem>this.getGObject("baseItem_3");
        this.baseitem4 = <AncientEquipItem>this.getGObject("baseItem_4");
        this.baseitem5 = <AncientEquipItem>this.getGObject("baseItem_5");
        this.baseitem6 = <AncientEquipItem>this.getGObject("baseItem_6");
        this.baseitem7 = <AncientEquipItem>this.getGObject("baseItem_7");
        this.loaderBg = <GLoader>this.getGObject("loader_bg");
        this.loaderEquip = <GLoader>this.getGObject("loader_equip");
        this.loaderIco = <GLoader>this.getGObject("loader_ico");
        this.txtCost = this.getGObject("txt_cost").asRichTextField;
        this.btnCompose = this.getGObject("btn_smelt").asButton;
        this.btnPath = this.getGObject("btn_path").asButton;
        this.equipContainer = this.getGObject("equip_container").asCom;
        this.loaderBg.load(URLManager.getModuleImgUrl("bg/popup_bg.png",PackNameEnum.Common));

        this.btnCompose.addClickListener(this.onGUIBtnClick, this);
        this.btnPath.addClickListener(this.onGUIBtnClick, this);
        this.loaderIco.addClickListener(this.onGUIBtnClick, this);
        //---- script make end ----
        this.itemLists = [];
        for(let i:number=0;i<CacheManager.ancientEquip.dressEquipsType.length;i++){
            let item:AncientEquipItem = (<AncientEquipItem>this['baseitem'+i]);
            item.isNeedGray = false;
            item.addClickListener(this.onClickItem,this);
            this.itemLists.push(item);
        }
        // this.titleIcon = "AncientEquip_compose";
        // this.title = "";
        this.equipModel = new ModelShow(EShape.EAncientEquip);
        this.equipContainer.displayListContainer.addChild(this.equipModel);
	}

	public updateAll(data?:any):void{
        this._data = data;
		this.updatePosItem();
        if(data && data.type){
            let idx:number = CacheManager.ancientEquip.dressEquipsType.indexOf(data.type);
            this.changeSelect(this.itemLists[idx],true);
        }
	}
    
    public getData():any{
        return this._data;
    }
    private updatePosItem():void{
        let dressEquipsType:number[] = CacheManager.ancientEquip.dressEquipsType;
        let posItems:any[] = CacheManager.ancientEquip.getPosItemInfo();
        for(let i:number = 0;i<dressEquipsType.length;i++){
            this.itemLists[i].setData(posItems[i],i);
        }
    }
    private changeSelect(item:AncientEquipItem,isForce:boolean):void{
        if(!item){
            return;
        }
        if(this.curSelectItem!=item || isForce){
            if(this.curSelectItem){
                this.curSelectItem.setSelect(false);
            }
            this.curSelectItem = item;
            this.curSelectItem.setSelect(true);
            let data:any = this.curSelectItem.getData();
            let itemData:ItemData = data.item; 
            //let url:string = URLManager.getModuleImgUrl(`equip/${itemData.getCode()}.png`,PackNameEnum.AncientEquip);
            //this.loaderEquip.load(url);
            this.equipModel.setData(itemData.getCode());
            let pos:number = data.type;
            this.isCanComposePos = CacheManager.ancientEquip.isCanComposePos(pos);
            this._data.type = pos; 
            //读合成表 t_item_transfer
            let cfg:any = ConfigManager.itemTransfer.getByPk(itemData.getCode());
            // material_item_code amount transfer_limit //转换限制（1：只能分解（正向）；2：只能合成（反向）；3：可分解可合成（双向<1+2>））
            this.curMaterialItem = new ItemData(cfg.materialItemCode);
            this.curMaterialItem.itemAmount = cfg.amount;
            let hasNum:number = CacheManager.pack.propCache.getItemCountByCode2(cfg.materialItemCode);
            let needNum:number = cfg.amount;
            
            let pathName:string ="";
            let costUrl:string = "";
            if(ConfigManager.itemTransfer.isOnlySmelt(cfg)){
                pathName = itemData.getName();
                costUrl = itemData.getIconRes();
                this.pathItemCode = itemData.getCode();
                needNum = 1;
                hasNum = CacheManager.pack.propCache.getItemCountByCode2(itemData.getCode());
            }else{
                pathName = this.curMaterialItem.getName();
                costUrl = this.curMaterialItem.getIconRes();
                this.pathItemCode = this.curMaterialItem.getCode();
            }
            this.isItemOk = hasNum>=needNum;
            this.btnPath.text = "<u>"+App.StringUtils.substitude(LangAncientEquip.L4,pathName)+"</u>";
            let propGetCfg:any = ConfigManager.propGet.getByPk(this.pathItemCode);
            this.btnPath.visible = propGetCfg!=null; 
            this.loaderIco.load(costUrl);
            
            let clr:string = this.isItemOk?Color.GreenCommon:Color.RedCommon
            this.txtCost.text = HtmlUtil.html(hasNum+"/"+needNum,clr); 
            

        }
    }
    protected onGUIBtnClick(e:egret.TouchEvent):void{
        var btn: any = e.target;
        switch (btn) {
            case this.btnCompose:
                if(!this.isItemOk){
                    Tip.showLeftTip(LangAncientEquip.L6);
                    return;
                }
                if(!this.isCanComposePos){
                    Tip.showLeftTip(LangAncientEquip.L5);
                    return;
                }
                if(this.curSelectItem){
                    let data:any = this.curSelectItem.getData();
                    let itemData:ItemData = data.item; 
                    EventManager.dispatch(LocalEventEnum.AncientEquipReqCompose,{itemCode:itemData.getCode(),oper:2});                    
                }                
                break;
            case this.btnPath:
                if(this.pathItemCode){                    
                    EventManager.dispatch(LocalEventEnum.AncientEquipShowGainWin,{itemCode:this.pathItemCode,posType:this._data.type});
                }                 
                break;
            case this.loaderIco:
                if(this.pathItemCode){
                    ToolTipManager.showByCode(this.pathItemCode);
                }
                break;

        }
    }

    private onClickItem(e:egret.TouchEvent):void{
        let item:AncientEquipItem = <AncientEquipItem>e.target;
        this.changeSelect(item,false);
    }


}