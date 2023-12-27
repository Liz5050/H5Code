/**
 * 首充特惠礼包tips
 * @author zhh
 * @time 2018-11-28 11:04:12
 */
class ToolTipRechargeGift extends ToolTipBase {
    private c1:fairygui.Controller;
    private baseItem:BaseItem;
    private loaderBg:GLoader;
    private loaderClr:GLoader;
    private imgBg:fairygui.GImage;
    private txtDesc:fairygui.GRichTextField;
    private txtName:fairygui.GRichTextField;
    private txtInfo:fairygui.GRichTextField;
    private btnCost:fairygui.GButton;
    private btnVip:fairygui.GButton;
    private toolTipSource:ToolTipSouceEnum;
    private extData:any;

    private fightPanel:FightPanel;

    private modelContainer: fairygui.GComponent;
    private isVipOK:boolean = false;
    /**动态模型 */
    private model:any;
    private itemData:ItemData;
    private modelBody: egret.DisplayObjectContainer;

	public constructor() {
		super(PackNameEnum.Common, "ToolTipRechargeGift",LayerManager.UI_Popup);
	}

	public initUI(): void {
		super.initUI();
        //---- script make start ----
        this.c1 = this.getController("c1");
        this.baseItem = <BaseItem>this.getGObject("baseItem");
        this.loaderBg = <GLoader>this.getGObject("loader_bg");
        this.loaderClr = <GLoader>this.getGObject("loader_clr");
        this.imgBg = this.getGObject("img_bg").asImage;
        this.txtDesc = this.getGObject("txt_desc").asRichTextField;
        this.txtName = this.getGObject("txt_name").asRichTextField;
        this.txtInfo = this.getGObject("txt_info").asRichTextField;
        this.btnCost = this.getGObject("btn_cost").asButton;
        this.btnVip = this.getGObject("btn_vip").asButton;
        this.baseItem.isShowName = false;

        this.fightPanel = <FightPanel>this.getGObject("panel_fight");

        this.btnCost.addClickListener(this.onGUIBtnClick, this);
        this.btnVip.addClickListener(this.onGUIBtnClick, this);
        //---- script make end ----
        this.modelBody = ObjectPool.pop("egret.DisplayObjectContainer");        
        this.modelContainer = this.getGObject("model_container").asCom;        
        (this.modelContainer.displayObject as egret.DisplayObjectContainer).addChild(this.modelBody);
        this.loaderBg.load(URLManager.getModuleImgUrl("bg/equip_tips.png", PackNameEnum.Common));
	}

	public setToolTipData(toolTipData: ToolTipData) {
		super.setToolTipData(toolTipData);		
        
		this.toolTipSource = toolTipData.source;
		this.extData = toolTipData.extData;
		if (toolTipData) {
			let itemData:ItemData = <ItemData>toolTipData.data;
            this.itemData = itemData;
            this.loaderClr.load(URLManager.getModuleImgUrl(`recharge_color_${itemData.getColor()}.jpg`,PackNameEnum.Pack));
            this.baseItem.itemData = this.itemData;
            this.txtName.text = itemData.getName(true); 
            this.txtInfo.text = App.StringUtils.substitude(LangPack.L1,itemData.getItemAmount())+
            HtmlUtil.brText+App.StringUtils.substitude(LangPack.L2,itemData.getItemLevel());     
            this.txtDesc.text = itemData.getDesc();                   
            let itemInfo:any = itemData.getItemInfo();            
            let vipLimit:number = itemInfo.effectEx; //免费打开的VIP等级限制      
            let costYB:number = itemInfo.effectEx2; //VIP不足打开需要花费的元宝
            CacheManager.pack.isVipLimitedGiftBagClick = MoneyUtil.checkEnough(EPriceUnit.EPriceUnitGold,costYB,false);      
            this.c1.setSelectedIndex(0);
            this.isVipOK = CacheManager.vip.checkVipLevel(vipLimit)
            if(this.isVipOK){
                this.c1.setSelectedIndex(1);
            }
            if(ToolTipSouceEnum.Pack!=this.toolTipSource){
                this.c1.setSelectedIndex(2);
            }
            this.setModelShow(itemInfo);
            this.txtDesc.text = itemData.getDesc();                       
		}		
	}
    
    private setModelShow(itemInfo:any):void{
        if(itemInfo.extendStr){ //战力#模型类型#模型id#职业(时装才有效;配0取玩家主角);时装的话模型类型配0 模型id配t_mg_fashion的code                
            //加载模型
            let infos:string[] = (itemInfo.extendStr as string).split("#");
            this.fightPanel.updateValue(Number(infos[0]));
            let type:number =Number(infos[1]); //模型类型
            let codeOrId:number = Number(infos[2]);
            let isModelShow:boolean = true;
            if(type==0){
                isModelShow = false;
                //时装类型     
                
                let fashionData:any = ConfigManager.mgFashion.getByPk(codeOrId);
                if(!fashionData){
                    return;
                }
                if(fashionData.type==EFashionType.EFashionWeapon){
                    type = ShapeUtils.getModelShowType(fashionData.type);
                    codeOrId = fashionData.modelId; 
                    isModelShow = true;
                }else{                    
                    let modelDict: any = WeaponUtil.getAttrDict(fashionData.modelIdList);
                    let career: number = infos[3]?Number(infos[3]):CareerUtil.getBaseCareer(CacheManager.role.getRoleCareerByIndex(0));
                    let weapons: any;
                    ShapeUtils.setPlayerModel(modelDict, fashionData.type);
                    weapons = ShapeUtils.getPlayerModel(0);
                    if(!this.model){    
                        this.model = new PlayerModel();
                    }                    
                    this.model.updatePlayerModelAll(weapons, career);
                }                
            }
            if(isModelShow){
                if(!this.model){
                    this.model = new ModelShow(type);
                }   
                this.modelBody.x = 400;
                this.modelBody.y = 150;
                this.model.setShowType(type);
                this.model.setData(codeOrId);
            }
        }        
        this.modelBody.addChild(this.model);         
        
    }

    protected onGUIBtnClick(e:egret.TouchEvent):void{
        var btn: any = e.target;
        switch (btn) {
            case this.btnCost:
                if(this.isVipOK){
                    ProxyManager.pack.useItem(this.itemData.getUid(), 1, []);
                    this.hide();
                }else{
                    let itemInfo:any = this.itemData.getItemInfo();            
                    let vipLimit:number = itemInfo.effectEx; //免费打开的VIP等级限制
                    let costYB:number = itemInfo.effectEx2; //VIP不足打开需要花费的元宝
                    let tips:string = HtmlUtil.colorSubstitude(LangPack.L3,costYB,vipLimit);
                    Alert.alert(tips,()=>{
                        if(MoneyUtil.checkEnough(EPriceUnit.EPriceUnitGold,costYB)){
                            this.hide();
                            ProxyManager.pack.useItem(this.itemData.getUid(), 1, []);
                        }
                    },this);
                }                
                break;
            case this.btnVip:
                HomeUtil.open(ModuleEnum.VIP);
                this.hide();
                break;
        }
        
    }
    public onShow():void{
        super.onShow();
        EventManager.dispatch(LocalEventEnum.PackCheckPropTips);        
    }
    public hide(): void{
        super.hide();

    }
	
}