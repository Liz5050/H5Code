/**
 * 法器升星
 */


class MagicWeaponStrengthenController extends BaseController {
    private module : MagicWeaponStrengthenModule;
    private windowSkillInfo : WindowSkillInfo;
    private windowDetail : WindowDetail;
    private isFirst:boolean = true;
    private win:SpiritResultWindow;
    public constructor() {
        super(ModuleEnum.MagicWeaponStrengthen);
        this.viewIndex = ViewIndex.One;
    }

    public initView() : BaseModule {
        this.module = new MagicWeaponStrengthenModule();
        return this.module;
    }

    public addListenerOnInit() : void {
		this.addMsgListener(EGateCommand[EGateCommand.ECmdGateSpiritCopyGetReward],this.onSpiritRewardStatus,this);
        this.addListen0(LocalEventEnum.UpLevelMgaicWeapon , this.OnRequestUpdateLvl, this);
        this.addMsgListener(ECmdGame[ECmdGame.ECmdGameShapeUpgradeEx],this.onUpdateSuccess,this);
        this.addMsgListener(EGateCommand[EGateCommand.ECmdGateShape] ,this.shapeBack ,this);
		this.addMsgListener(EGateCommand[EGateCommand.ECmdGateShapeList], this.checkShapeList, this);

    }

    public addListenerOnShow() : void {
        this.addListen1(UIEventEnum.SkillInfoOpen , this.OnClickShowStrengthen , this );
        this.addListen1(UIEventEnum.MagicWeaponDetailOpen , this.OnClickShowDetail , this);
        this.addListen1(LocalEventEnum.PlayerCopyInfoUpdate, this.onCopyInfoUpdate , this);
        this.addListen1(NetEventEnum.packPosTypePropChange, this.packPosTypePropChange, this);
        this.addListen1(NetEventEnum.packBackAddItem , this.packPosTypePropChange, this);
        
        
    }
    private shapeBack(data : any) : void {
        if(data.shape_I == EShape.EShapeSpirit) {
		    CacheManager.magicWeaponStrengthen.setShapeInfo(data);
		    EventManager.dispatch(LocalEventEnum.MagicWeaponUpdate);
        }

	}

	private checkShapeList(data : any) : void {
		for(let i = 0; i < data.list.data.length; i++){
			let shape = data.list.data[i];
			if(shape.shape_I ==  EShape.EShapeSpirit) {
				CacheManager.magicWeaponStrengthen.setShapeInfo(shape);
				EventManager.dispatch(LocalEventEnum.MagicWeaponUpdate);
			}
		}
	}

    public hide(data?: any):void{
		super.hide(data);
		this.viewIndex = ViewIndex.Two;
	}
    /**
     * 法宝副本奖励状态
     * SBool
     */
    private onSpiritRewardStatus(data:any):void{
        CacheManager.copy.setSpiritReward(data);        
        if(CacheManager.copy.isInCopyByType(ECopyType.ECopyMgSpirit)){
            if(!this.win){
                this.win = new SpiritResultWindow();
            }
            this.win.show();
        }
        if(this.isShow){
            this.module.setCopyTips();
            this.module.updateCopyPanel();            
        }
        
    }

    private OnClickShowStrengthen(data : any) : void {
        if(!this.windowSkillInfo){
            this.windowSkillInfo = new WindowSkillInfo();
        }
        this.windowSkillInfo.show(data);
    }
    
    private OnClickShowDetail(data : any) : void {
        if(!this.windowDetail) {
            this.windowDetail = new WindowDetail();
        }
        this.windowDetail.show(data);
    }

    private OnRequestUpdateLvl() {
        ProxyManager.magicweaponstrengthen.uplevelMagicWeapon( EShape.EShapeSpirit );
    }
    private onCopyInfoUpdate(data:any):void{
        this.module.updateCopyPanel();
    }

    private onUpdateSuccess() : void {
        if(this.module) {
            this.module.updateAll();
        }
        EventManager.dispatch(LocalEventEnum. MagicShapeDataUpdate);
    }

    private packPosTypePropChange() :void {
        if(this.module) {
            this.module.updateStrengthenPanel();
        }
    }
}