/**
 * 七天法宝
 */
class SevenDayMagicWeaponController extends BaseController {
	private module: SevenDayMagicWeaponModule;

	public isFused : boolean;

	public constructor() {
		super(ModuleEnum.SevenDayMagicWeapon);
		this.isFused = false;
		// this.viewIndex = ViewIndex.Two;
	}

	public initView(): BaseModule {
		this.module = new SevenDayMagicWeaponModule();
		return this.module;
	}

	public addListenerOnInit(): void {
		this.addMsgListener(ECmdGame[ECmdGame.ECmdGameSevenDayMagicWeapon], this.sevenDayMagicWeapon, this);
		this.addMsgListener(EGateCommand[EGateCommand.ECmdGateShape] ,this.fuseBack ,this);
		this.addMsgListener(EGateCommand[EGateCommand.ECmdGateShapeList], this.checkShapeList, this);
		this.addListen0(LocalEventEnum.GetSevenDayMagicWeapon, this.getSevenDayMagicWeapon, this);
		this.addListen0(NetEventEnum.OnlineDaysUpdate, this.updatePanel, this);
		this.addListen0(LocalEventEnum.VipUpdate, this.updatePanel, this);
		this.addListen0(LocalEventEnum.TrainNewGodWeaponActive, this.onNewGodWeaponActive, this);
	}

	public addListenerOnShow(): void {
		// this.getSevenDayMagicWeapon();
	}

	/**七天法宝数据请求 */
	private getSevenDayMagicWeapon(): void{
		ProxyManager.sevenDayMagicWeapon.sevenDayMagicWeapon();
	}

	/**
	 * 七天法宝数据更新
	 * @param data S2C_SSevenDayMagicWeapon
	 */
	private sevenDayMagicWeapon(data: any): void{
		CacheManager.sevenDayMagicWeapon.updateActiveCode(data.codes.data_I);
		
		let dict: any = {};
		for(let code of data.codes.data_I){
			dict[code] = true;
		}
		CacheManager.sevenDayMagicWeapon.activeCodeDict = dict;

		EventManager.dispatch(NetEventEnum.SevenDayMagicWeaponUpdate);
		this.updatePanel();
		this.updateHomeIcon();
	}

	private fuseBack(data : any) : void {
		if( data.shape_I == EShape.EShapeSpirit) {
			if(this.isShow) {
				this.isFused = true;
				EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.MagicWeaponStrengthen);
			}
		}
	}

	private checkShapeList(data : any) : void {
		for(let i = 0; i < data.list.data.length; i++){
			var shape = data.list.data[i];
			if(shape.shape_I ==  EShape.EShapeSpirit) {
				this.isFused = true;
			}
		}
	}

	private updatePanel(): void{
		if(this.isShow){
			this.module.updateMagicWeapon();
		}
		this.updateHomeIcon();
	}

	private onNewGodWeaponActive(): void{
		this.updateHomeIcon();
	}

	private updateHomeIcon(): void{
		if(CacheManager.sevenDayMagicWeapon.isIconShow()){
			EventManager.dispatch(LocalEventEnum.AddHomeIcon,IconResId.SevenDayMagicWeapon);
			EventManager.dispatch(LocalEventEnum.HomeIconSetTip,IconResId.SevenDayMagicWeapon,CacheManager.sevenDayMagicWeapon.checkCanActived());
		}else{
			EventManager.dispatch(LocalEventEnum.RemoveHomeIcon,IconResId.SevenDayMagicWeapon);
		}
	}
}