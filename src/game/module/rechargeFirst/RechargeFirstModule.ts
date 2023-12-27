/**
 * 首充
 * @author zhh
 * @time 2018-07-06 21:07:10
 */
class RechargeFirstModule extends BaseModule {
    private c1:fairygui.Controller;
    private cBtn:fairygui.Controller;
    private loaderBg:GLoader;
    private txtFightAdd:fairygui.GTextField;
    private btnReward:fairygui.GButton;
    private listRecharge:List;
    private listReward:List;

    private rewardData:ItemData[];
    private rechargeInfos:any[];
    private cnt_eff:fairygui.GComponent;
    private mc:UIMovieClip;
    private cnt0:fairygui.GComponent;

    //private equipEff:UIMovieClip;
    //private playerModel:PlayerModel;
    private clothModel:ModelShow;
    private weaponModel:ModelShow;
    private clickAreas:fairygui.GComponent[];
	public constructor() {
		super(ModuleEnum.RechargeFirst,PackNameEnum.RechargeFirst,"Main",LayerManager.UI_Popup);
        this.modal = true;		
	}
	public initOptUI():void{
        //---- script make start ----
        this.isOpenRecharge = false;
        this.c1 = this.getController("c1");
        
        this.loaderBg = <GLoader>this.getGObject("loader_bg");
        
        this.cnt0 = this.getGObject("cnt0").asCom;

        // this.txtFightAdd = this.getGObject("txt_fight_add").asTextField;
        this.btnReward = this.getGObject("btn_reward").asButton;
        this.cBtn =  this.btnReward.getController("c1");
        this.listRecharge = new List(this.getGObject("list_recharge").asList);
        this.listReward = new List(this.getGObject("list_reward").asList,{txtNameStroke:1,txtNameStrokeColor:0x170a07}); //

        this.btnReward.addClickListener(this.onGUIBtnClick, this);
        //---- script make end ----
        this.loaderBg.load(URLManager.getRechargeFirstBg());
        let info:any = ConfigManager.rechargeFirst.getRechargeFirstData();
        this.rewardData = RewardUtil.getStandeRewards(info.rewardStr);
        this.rechargeInfos = ConfigManager.mgRecharge.getFirstRecharge();

        this.cnt_eff = this.btnReward.getChild("cnt").asCom;

        this.mc = UIMovieManager.get(PackNameEnum.MCRcgBtn2);
        this.cnt_eff.addChild(this.mc);
        this.mc.visible = this.mc.playing = false;
        this.mc.scaleX = 1;
        this.mc.scaleY = 1;
        this.mc.x = 0; //this.btnReward.x - 174;
        this.mc.y = 0;//this.btnReward.y - 215;
    
        //this.equipEff = UIMovieManager.get(PackNameEnum.MCRCFWeapon,0,0);
        //this.cnt.addChild(this.equipEff);
        
        /*
        this.playerModel = new PlayerModel();
        this.clothModel = new ModelShow();
        this.cnt.displayListContainer.addChild(this.clothModel);
        
        let wpFashion:any = ConfigManager.mgFashion.getByPk(100101); 
        let clFashion:any = ConfigManager.mgFashion.getByPk(101101); 
        let modelWpDict: any = WeaponUtil.getAttrDict(wpFashion.modelIdList);
        let modelClDict: any = WeaponUtil.getAttrDict(clFashion.modelIdList);
              
        ShapeUtils.setPlayerModel(modelWpDict, wpFashion.type);
        ShapeUtils.setPlayerModel(modelClDict, clFashion.type);
        let weapons:any = ShapeUtils.getPlayerModel(roleIndex);
        weapons[EEntityAttribute.EAttributeWing] = 0;
        this.playerModel.updatePlayerModelAll(weapons,career);
        */
        let cnt1:fairygui.GComponent = this.getGObject("cnt1").asCom;
        this.clothModel = this.getModelByFashion(100101,this.cnt0.displayListContainer);;
        this.weaponModel = this.getModelByFashion(101101,cnt1.displayListContainer);

        this.clickAreas = [];
        for(let i:number = 0;i<2;i++){
            let cnt:fairygui.GComponent = this.getGObject(`cnt_light${i}`).asCom;
            let uiMc:UIMovieClip = UIMovieManager.get(PackNameEnum.MCRechargeLight);
            cnt.addChild(uiMc);
            let g:fairygui.GComponent = this.getGObject("cnt_area"+i).asCom;
            g.opaque = true;
            this.clickAreas.push(g);
            g.addClickListener(this.onClickWeapModel,this);
        }        

	}

    private onClickWeapModel(e:egret.TouchEvent):void{
        let idx:number = this.clickAreas.indexOf(e.target);
        if(idx>-1){
            let codes:number[] = [50010101,50020101];
            ToolTipManager.showByCode(codes[idx]);
        }
    }

    private getModelByFashion(code:number,parent:egret.DisplayObjectContainer):ModelShow{
        let fashionInfo:any = ConfigManager.mgFashion.getByPk(code);
        let shapeType:number = ShapeUtils.getModelShowType(fashionInfo.type);
        let roleIndex:number = 0;
        let career: number = CareerUtil.getBaseCareer(CacheManager.role.getRoleCareerByIndex(roleIndex));
        let modelDict:any = WeaponUtil.getAttrDict(fashionInfo.modelIdList);
        let m:ModelShow = new ModelShow(shapeType);
        m.setData(modelDict[career]);
        parent.addChild(m);
        return m;
    }

	public updateAll(data?:any):void{
        this.listReward.data = this.rewardData;
        this.listRecharge.data = this.rechargeInfos;
        let isRecharge:boolean = CacheManager.recharge.isCanFirstRchGetReward();
        this.mc.visible = this.mc.playing = isRecharge;
        let idx:number = 1;
        if(!isRecharge){
            idx = 0;            
        }
        this.cBtn.setSelectedIndex(idx);
        this.c1.setSelectedIndex(idx);
	}
    protected onGUIBtnClick(e:egret.TouchEvent):void{
        var btn: any = e.target;
        switch (btn) {
            case this.btnReward:
                ProxyManager.recharge.getFirstRecharge();
                let items:any[] = this.listReward.list._children;
                let baseItem:RechargeFirstRewardItem;
                for(let item of items){
                    baseItem = item as  RechargeFirstRewardItem;
                    let itd:ItemData = baseItem.getData(); 
                    let stp:egret.Point = baseItem.localToGlobal(0,0,RpgGameUtils.point);
                    MoveMotionUtil.itemMoveToBag([itd.getCode()],0,LayerManager.UI_Cultivate,stp.x,stp.y);                    
                }                
                break;

        }
    }
   
}