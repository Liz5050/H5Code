/**
 * 获得物品提示
 * @author zhh
 * @time 2018-11-08 10:41:19
 */
class PackGetItemTip extends BaseContentView {
    private static DELAY:number = 3;
    private baseItem:BaseItem;
    private txtName:fairygui.GRichTextField;
    private txtTitle:fairygui.GRichTextField;
    private btnGo:fairygui.GButton;
    private loader_bg:GLoader;
    private _data:any;
    private count:number = 3;

	public constructor() {
		super(PackNameEnum.Pack,"PackGetItemTip",null,LayerManager.UI_DEMO);//有强制引导的时候也能点快速装备
        this.isPopup = false;
        //this.isShowCloseObj = true;
        this.modal = false;
        this.isAnimateShow = false;
        
	}

	public initOptUI():void{
        //---- script make start ----        
        this.loader_bg = <GLoader>this.getGObject("loader_bg");
        this.baseItem = <BaseItem>this.getGObject("baseItem");
        this.txtName = this.getGObject("txt_name").asRichTextField;
        this.btnGo = this.getGObject("btn_go").asButton;
        this.btnGo.addClickListener(this.onGUIBtnClick, this);
        //---- script make end ----
        this.baseItem.isShowName = false;
        this.loader_bg.load(URLManager.getModuleImgUrl('refreshBg.png',PackNameEnum.Boss));
        this.getGObject("btn_close").asButton.addClickListener(this.onCloseHandler,this);
	}

	public updateAll(data?:any):void{        
        //super.updateAll(data);        
        if(!(data.item instanceof ItemData) && !data.isPiece){
            this.hide();
            return;            
        }

        this._data = data;
		data.title?this.title = data.title:null;        
        if(data.isPiece){ //神器碎片
            let url:string = ConfigManager.godWeapon.getPieceUrl(data.item);            
            this.baseItem.itemData = null;
            this.baseItem.icoUrl = url;
            this.txtName.text = data.item.pieceName;
        }else{
            this.baseItem.itemData = data.item;
            this.txtName.text = this.baseItem.itemData.getName(true);
        }        
        this.btnGo.text = data.label;
        App.TimerManager.remove(this.onTimerRun,this);
        //未达到关卡限制 是装备倒计时自动穿戴
        if(ItemsUtil.isEquipItem(this._data.item) && !ItemsUtil.isKillItem(this._data.item) && ConfigManager.const.isItemQuickCpLimit()){
            this.count = PackGetItemTip.DELAY;           
            App.TimerManager.doTimer(1000,PackGetItemTip.DELAY,this.onTimerRun,this,this.useHandler,this);
            this.onTimerRun();
        }
	}
    private set title(value:string){
        this.txtTitle.text = value; 
    }
    private onTimerRun():void{
        this.btnGo.text = this._data.label+`(${HtmlUtil.colorSubstitude(LangCommon.L48, this.count)})`;
        this.count--;
    }

    public checkClose():void{
        if(this._data){
            if(this._data.isPiece){
                //神器碎片
                if(!CacheManager.godWeapon.isGodWPieceCanAct(this._data.item.code,this._data.item.piece)){
                    this.showNext();
                }
                return;
            }else if(ItemsUtil.isKillItem(this._data.item)){
                //必杀碎片
                let pos:number = (this._data.item as ItemData).getItemInfo().effectEx;
                if(!CacheManager.uniqueSkill.isanActiveOrUpgradeByPos(pos)){
                    this.showNext();
                }
                return;
            }            

            let isLowEq:boolean = ItemsUtil.isEquipItem(this._data.item) && (CacheManager.pack.rolePackCache.isDressed(this._data.item) || CacheManager.packQuickUse.getEquipRoleIndex(this._data.item)==-1);
            let item:ItemData = CacheManager.pack.getByUid(this._data.item.getUid(),this._data.item.getPosType());
            if( isLowEq || !item ){                
                this.showNext();
            }else{
                this.updateAll(CacheManager.packQuickUse.getQuickParam(item)); //刷新数量
            }            
        }
    }

    public isShowingItem(item:ItemData):boolean{
        //神器碎片归类是物品，但是不能被高战力的装备替换当前显示的神器碎片
        return !this._data.isPiece && !ItemsUtil.isEquipItem(item) && this._data.item instanceof ItemData && this._data.item.getCode()==item.getCode();
    }

    public getShowItemCount():number{
        let c:number = 0;
        if(!this._data.isPiece && this._data.item instanceof ItemData && !ItemsUtil.isEquipItem(this._data.item)){
            c = this._data.item.getItemAmount();
        }
        return 
    }

    /**判断当前显示的是否非装备 */
    public isNotEquip():boolean{
        return !this._data.isPiece && !ItemsUtil.isEquipItem(this._data.item);
    }

    public onShow(param: any = null): void{
        super.onShow(param);  
        
    }

    public updatePos(isByShow:boolean=false):void{
        this.setXY(fairygui.GRoot.inst.width - 210, fairygui.GRoot.inst.height - 613);
        
        /*
        if(isByShow){
            this.setXY(fairygui.GRoot.inst.width - 210, fairygui.GRoot.inst.height - 613);
        }else{
            egret.setTimeout(()=>{
                this.setXY(fairygui.GRoot.inst.width - 210, fairygui.GRoot.inst.height - 613);
            },this,35);
        }                       
        */
    }

    public show(param: any = null, callBack: CallBack = null):void{
        super.show(param,callBack);
        //this.updatePos(true);
    }

    private showNext():boolean{
        let item:any = CacheManager.packQuickUse.pop();
        if(item){
            this.updateAll(CacheManager.packQuickUse.getQuickParam(item));
            return true;
        }else{
            this.hide();
        }
        return false;
    }

    protected onCloseHandler() {
        if(!this.showNext()){
            this.hide();
        }        
    }
    protected onGUIBtnClick(e:egret.TouchEvent):void{
        var btn: any = e.target;
        switch (btn) {
            case this.btnGo:
                this.useHandler();
                break;
        }
    }
    private useHandler():void{
        if(!this._data.type){ //不传type或者type是0表示使用物品      
            
            if(this._data.isPiece){
                //打开神器界面 
                EventManager.dispatch(UIEventEnum.ModuleOpen,ModuleEnum.Skill,{tabType:PanelTabType.TrainGodWeapon});
            }else{
                if(ItemsUtil.isMonthTempPrivilegeCard(this._data.item)) {
				    EventManager.dispatch(UIEventEnum.ShowPrivilegeCardExpWindow);
			    }
                else {
                    EventManager.dispatch(LocalEventEnum.PackUse,this._data.item);
                }
            }            
            this.showNext();
        }else if(this._data.type==PackQuickUseCache.QUICK_USE_EQUIP){
            let roleIndex:number = ItemsUtil.isEquipItem(this._data.item)?CacheManager.packQuickUse.getEquipRoleIndex(this._data.item):-1;
            if(roleIndex>-1){ //装备
                CacheManager.packQuickUse.delLowEquip(this._data.item);
                EventManager.dispatch(LocalEventEnum.EquipToRole, this._data.item,roleIndex);
                this.showNext();         
            }else{
                this.hide();
            }
        }
             
    }

    public getHookData():any{
        return this._data;
    }

    public hide(param: any = null, callBack: CallBack = null):void{
        super.hide(param,callBack);
        App.TimerManager.remove(this.onTimerRun,this);
    }

}