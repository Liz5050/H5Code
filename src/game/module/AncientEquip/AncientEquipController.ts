/**
 * 模块控制器
 * @author zhh
 * @time 2018-08-24 11:31:46
 */
class AncientEquipController extends BaseController {
	//工具生成的类名称不对就手动改吧
	private _moduleView:AncientEquipModule;
	private _composeWin:AncientComposeWin;
	private _smeltWin:AncientSmeltWin;
	private _gainWin:AncientGainWin;
	private _suitTip:AncientEquipSuitTip;
	private _skillTip:AncientEquipSkillTip;

	public constructor() {
		super(ModuleEnum.AncientEquip);
		this.viewIndex = ViewIndex.Two;
	}

	public initView(): any {
		if (!this._moduleView) {
			this._moduleView = new AncientEquipModule();
		}
		return this._moduleView;

	}

	public addListenerOnInit(): void {
		this.addMsgListener(ECmdGame[ECmdGame.ECmdGameBagItemTransfer],this.onItemTransfer,this);
		this.addMsgListener(ECmdGame[ECmdGame.ECmdGameBagSpecificItemTransDecompose],this.onSpecificItemTransDecompose,this);
	}
	
	public addListenerOnShow(): void {
		this.addListen1(LocalEventEnum.AncientEquipShowComposeWin,this.onShowComposeWin,this);
		this.addListen1(LocalEventEnum.AncientEquipShowSmeltWin,this.onShowSmeltWin,this);
		this.addListen1(LocalEventEnum.AncientEquipShowGainWin,this.onShowGainWin,this);
		this.addListen1(LocalEventEnum.AncientEquipHideSecondWin,this.onHideSecondWin,this);
		this.addListen1(LocalEventEnum.AncientEquipShowSuitTip,this.onSuitTip,this);
		this.addListen1(LocalEventEnum.AncientEquipShowSkillTip,this.onSkillTip,this);
		this.addListen1(LocalEventEnum.AncientEquipReqCompose,this.onReqCompose,this);
		this.addListen1(LocalEventEnum.AncientEquipReqSmelt,this.onReqSmelt,this);
		
		this.addListen1(NetEventEnum.CultivateInfoUpdateAncientEquip,this.onCulAncientEquip,this);
		this.addListen1(NetEventEnum.packPosTypePropChange, this.packPosTypePropChange, this);
	}

	private onReqCompose(data:any):void{
		ProxyManager.ancientEquip.compose(data.itemCode,data.oper);
	}

	private onReqSmelt(data:any):void{
		ProxyManager.ancientEquip.decompose(data.uids,data.posType);
	}

	private onCulAncientEquip():void{
		this._moduleView.updateAll();
	}
	/**
	 * 合成装备
	 * S2C_SItemTransfer
	 *  */
	private onItemTransfer(data:any):void{
		if(this.isShow){
			this._moduleView.updateAll();
		}

		this.updateComposeWin();
		if(data.result==0){
			Tip.showLeftTip(LangAncientEquip.L7);
		}

	}
	private updateComposeWin():void{
		if(this._composeWin && this._composeWin.isShow){
			this._composeWin.updateAll(this._composeWin.getData());
		}
	}

	private updateSmeltWin():void{
		if(this._smeltWin && this._smeltWin.isShow){
			this._smeltWin.updateAll(this._smeltWin.getData());
		}
	}

	/**
	 * 分解装备
	 * S2C_SSpecificItemTransDecompose
	 *  */
	private onSpecificItemTransDecompose(data:any):void{
		this.updateSmeltWin();
	}

	private onShowComposeWin(data:any):void{
		if(!this._composeWin){
			this._composeWin = new AncientComposeWin();
		}
		this._composeWin.show(data);
	}
	
	private onShowSmeltWin(data:any):void{
		if(!this._smeltWin){
			this._smeltWin = new AncientSmeltWin();
		}
		this._smeltWin.show(data);
	}

	private onShowGainWin(data:any):void{
		if(!this._gainWin){
			this._gainWin = new AncientGainWin();
		}
		this._gainWin.show(data);
	}

	private onHideSecondWin():void{		
		if(this._composeWin){
			this._composeWin.hide();
		}
		if(this._smeltWin){
			this._smeltWin.hide();
		}
		if(this._gainWin){
			this._gainWin.hide();
		}
	}

	private onSkillTip(data:any):void{
		if(!this._skillTip){
			this._skillTip = new AncientEquipSkillTip();
		}
		this._skillTip.show(data);
	}

	private onSuitTip(data:any):void{
		if(!this._suitTip){
			this._suitTip = new AncientEquipSuitTip();
		}
		this._suitTip.show(data);
	}

	private packPosTypePropChange():void{
		this._moduleView.updateAll();
		this.updateComposeWin();
		this.updateSmeltWin();
	}

}