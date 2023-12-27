/**
 * 模块控制器
 * @author zhh
 * @time 2018-08-20 10:47:19
 */
class ForgeImmortalsController extends BaseController {
	//工具生成的类名称不对就手动改吧
	private _moduleView:ForgeImmortalsModule;
	//private _immortalItemWin:ForgeImmortalsUpgradeWin;
	private _skillTip:ImmortalSuitSkillTip;
	public constructor() {
		super(ModuleEnum.ForgeImmortals);
		this.viewIndex = ViewIndex.Two;
	}

	public initView(): any {
		if (!this._moduleView) {
			this._moduleView = new ForgeImmortalsModule();
		}
		return this._moduleView;

	}

	public addListenerOnInit(): void {
		this.addListen0(LocalEventEnum.ForgeImmortalOpt,this.onDealCmdType,this);
		this.addListen0(LocalEventEnum.ForgeImmortalShowSkillTips,this.onShowSkillTips,this);
		this.addListen0(NetEventEnum.CultivateInfoUpdateImmortal,this.onImmortalUpdate,this);
		
	}	
	public addListenerOnShow(): void {
		this.addListen1(NetEventEnum.packPosTypePropChange, this.packPosTypePropChange, this);
	}

	/**显示某个神兵物品的升级界面 */
	// private onShowItemInfoWin(data:any):void{
	// 	if(!this._immortalItemWin){
	// 		this._immortalItemWin = new ForgeImmortalsUpgradeWin();
	// 	}
	// 	this._immortalItemWin.show(data);
	// }
	 private onDealCmdType(data:any):void{
        switch(data.cmdType){
            case EImmortalCmd.EImmortalCmdUnLock://解锁
				if(!CacheManager.forgeImmortals.isImmortalCanAct(data.roleIndex,data.subType)){
					Tip.showLeftTip(LangForge.L3);
					return;
				}
				App.SoundManager.playEffect(SoundName.Effect_SkillUpgrade);
                break;
            case EImmortalCmd.EImmortalCmdUse: //使用

                break;
            case EImmortalCmd.EImmortalCmdCancle: //取消

                break;
            case EImmortalCmd.EImmortalCmdReplace: //替换

                break;
        }
		ProxyManager.cultivate.immortalsOpt(data.roleIndex,data.cmdType,data.subType);
    }
	
	private onShowSkillTips(data:any):void{
		if(!this._skillTip){
			this._skillTip = new ImmortalSuitSkillTip();
		}
		this._skillTip.show(data);
	}

	private onImmortalUpdate():void{
		if(this.isShow){
			this._moduleView.updateAll(this._moduleView.getData());
		}
		// if(this._immortalItemWin && this._immortalItemWin.isShow){
		// 	this._immortalItemWin.updateAll(this._immortalItemWin.getData())
		// }		
		EventManager.dispatch(LocalEventEnum.HomeSetBtnTip,ModuleEnum.Forge,CacheManager.forge.checkTips());
		
	}

	private packPosTypePropChange():void{
		this._moduleView.updateByProp();
	}


}