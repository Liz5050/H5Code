/**
 * 神羽转换界面
 * @author zhh
 * @time 2018-08-09 11:31:39
 */
class GodWingTransformPanel extends BaseTabView{
    private baseItem:BaseItem;
    private imgGold:fairygui.GImage;
    private txtCost:fairygui.GTextField;
    private txtTip:fairygui.GTextField;
    private loaderBg:GLoader;
    private listItem:List;
    private listTran:List;
    private btnTranfer:fairygui.GButton;
    private tarItem:ItemData;
    private selectTarGrid:BaseItem;

	public constructor() {
		super();
	}

	protected initOptUI():void{
        //---- script make start ----
        this.loaderBg = <GLoader>this.getGObject("loader_bg");
        this.loaderBg.load(URLManager.getModuleImgUrl("bg.jpg",PackNameEnum.GodWing));
        this.baseItem = <BaseItem>this.getGObject("baseItem");
        this.baseItem.isNoneGray = true;
        this.imgGold = this.getGObject("img_gold").asImage;
        this.txtCost = this.getGObject("txt_cost").asTextField;
        this.txtTip = this.getGObject("txt_tip").asTextField;
        this.listItem = new List(this.getGObject("list_item").asList,{enableToolTip:true,toolTipBySelected:true});
        this.listTran = new List(this.getGObject("list_tran").asList,{isSelectStatus:true,isNoneGray:true,isResetSelect:true});
        this.listTran.isVirtualLastIndex = false;
        this.listItem.isVirtualLastIndex = false;
        this.btnTranfer = this.getGObject("btn_tranfer").asButton;
        //---- script make end ----
        this.listItem.list.addEventListener(fairygui.ItemEvent.CLICK,this.onGUIClickList,this);
        this.listTran.list.addEventListener(fairygui.ItemEvent.CLICK,this.onGUIClickList,this);
        this.btnTranfer.addClickListener(this.onClickBtn,this);
	}
	public updateAll(data?:any):void{
        let items:ItemData[] = CacheManager.godWing.getPackGodWings();
        items.sort(function (a:ItemData,b:ItemData):number{
            let cfgA:any = ConfigManager.mgStrengthenExAccessory.getByPk(a.getCode());
            let cfgB:any = ConfigManager.mgStrengthenExAccessory.getByPk(b.getCode());
            if(cfgA.level>cfgB.level){
                return -1;
            }else if(cfgA.level<cfgB.level){
                return 1;
            }else if(cfgA.type>cfgB.type){
                return -1;
            }else if(cfgA.type<cfgB.type){
                return 1;
            }
            return 0;
        });        
        let item:ItemData = <ItemData>this.listItem.selectedData;
        let idx:number = -1;
        if(item){
            for(let i:number = 0;i<items.length;i++){
               if(item.getCode()==items[i].getCode()){
                   idx = i;
                   break;
               } 
            }
        }
        this.txtTip.visible = items.length==0;
        this.listItem.setVirtual(items);
        this.listItem.selectedIndex = idx;
        this.updateInfo();      
	}
    
    private updateInfo():void{
        let item:ItemData = <ItemData>this.listItem.selectedData;
        this.baseItem.itemData = item;
        let sameLevelItems:ItemData[] = [null,null,null];
        let idx:number = -1;
        if(item){            
            sameLevelItems = ConfigManager.mgStrengthenExAccessory.getOtherTypeSameLevel(item.getCode());
            let cfg:any = ConfigManager.mgStrengthenExAccessory.getByPk(item.getCode());
            this.txtCost.text = ""+cfg.transMoneyCostAmount; //转换消耗的元宝      
            this.imgGold.visible = true;
            if(this.tarItem){
                for(let i:number=0;i<sameLevelItems.length;i++){
                    if(this.tarItem.getCode()==sameLevelItems[i].getCode()){
                        idx = i;
                        break;
                    }
                }
            }

        }else{
            this.txtCost.text = "";
            this.imgGold.visible = false;            
        }
        this.listTran.setVirtual(sameLevelItems);     
        this.listTran.selectedIndex = idx;   
        this.tarItem = this.listTran.selectedData;
        this.setTarGridStatus(false);
        this.selectTarGrid = this.listTran.selectedItem;
        this.setTarGridStatus(true);

    }

    private setTarGridStatus(b:boolean):void{
        if(this.selectTarGrid){
            this.selectTarGrid.setSelectStatus(b);
        }
    }

    private onGUIClickList(e:fairygui.ItemEvent):void{
        switch(e.target){
            case this.listItem.list:
                this.updateInfo();
                break;
            case this.listTran.list:
                this.tarItem = <ItemData>this.listTran.selectedData;
                this.selectTarGrid = this.listTran.selectedItem;
                break;
        }
        
    }

    private onClickBtn(e:any):void{
        let item:ItemData = <ItemData>this.listItem.selectedData;
        if(item && this.tarItem){
            let cfg:any = ConfigManager.mgStrengthenExAccessory.getByPk(item.getCode());
            if(MoneyUtil.checkEnough(cfg.transMoneyCostUnit,cfg.transMoneyCostAmount)){
                EventManager.dispatch(LocalEventEnum.GodWingReqTransfer,EStrengthenExType.EStrengthenExTypeWing,item.getCode(),this.tarItem.getCode(),1);
            }            
        }else{
            Tip.showLeftTip(LangGodWing.L1);
        }
    }
    public hide():void{
        super.hide();
        this.listItem.selectedIndex = -1;
        this.listTran.selectedIndex = -1;
        this.selectTarGrid = null;
        this.tarItem = null;
    }
    /**
	 * 销毁函数
	 */
	public destroy():void{
		super.destroy();
	}

}