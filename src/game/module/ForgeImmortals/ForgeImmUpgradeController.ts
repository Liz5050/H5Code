class ForgeImmUpgradeController extends BaseController{
	private _moduleView:ForgeImmortalsUpgradeWin;
	public constructor() {
		super(ModuleEnum.ForgeImmUpgrade);
		this.viewIndex = ViewIndex.Two;
	}
	public initView(): any {
		if (!this._moduleView) {
			this._moduleView = new ForgeImmortalsUpgradeWin();
		}
		return this._moduleView;
	}
	public addListenerOnInit(): void {
				
	}	
	public addListenerOnShow(): void {
		this.addListen1(NetEventEnum.packPosTypePropChange, this.packPosTypePropChange, this);
		this.addListen1(NetEventEnum.CultivateInfoUpdateImmortal, this.onImmortalUpdate, this);
	}

	private onImmortalUpdate():void{
		ForgeImmortalsCache.POS_UP_CD = 0;
		let data:any = this._moduleView.getData();
		data.isOnline = true;
		this._moduleView.updateAll(data);	
		App.SoundManager.playEffect(SoundName.Effect_QiangHuaChengGong);	
	}
	private packPosTypePropChange():void{
		this._moduleView.updateAll(this._moduleView.getData());	
	}

}