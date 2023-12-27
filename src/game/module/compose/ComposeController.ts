
class ComposeController extends BaseController{
	private module: ComposeModule;
	public isSmelt: boolean = false;
    private buyWindow: ComposeBuyWindow;

	public constructor() {
		super(ModuleEnum.Compose);
	}

	public initView():BaseModule{
        this.module = new ComposeModule();
        return this.module;
    }

	public addListenerOnInit(): void {
        this.addMsgListener(ECmdGame[ECmdGame.ECmdGameRefineSmelt], this.onSmelt, this);
		this.addMsgListener(ECmdGame[ECmdGame.ECmdGameRefineSmeltEquip], this.onSmeltEquip, this);
		this.addMsgListener(EGateCommand[EGateCommand.ECmdGateSmeltLimit], this.onSmeltLimit, this);

        this.addListen0(UIEventEnum.QuickComposeBuyOpen,this.onOpenQuickComposeBuy,this);
    }

    public addListenerOnShow(): void {
		this.addListen1(NetEventEnum.packBackPackItemsChange, this.backpackChange, this);
        this.addListen1(NetEventEnum.packPosTypeBagChange, this.backpackChange, this);
		this.addListen1(LocalEventEnum.ComposeSelectedEquip, this.selectedEquip, this);
		this.addListen1(LocalEventEnum.ComposeUnDressEquip, this.unDressEquip, this);
    }

	public afterModuleHide(): void {
		this.isSmelt = false;
	}

	/**
	 * 物品合成返回
	 * @param data S2C_SSmelt
	 */
	private onSmelt(data: any): void{
		if(this.isSmelt){
			this.module.composeItem(data);
		}
	}

	/**
	 * 装备合成（玩家装备、神兽装备）返回
	 * @param data S2C_SSmeltEquip
	 */
	private onSmeltEquip(data: any): void{
		if(!data.result){
			Tip.showTip("合成失败");
		}
		this.module.updateEquipCompose();
	}

    /**
     * 更新限合成物品的合成量
     *@param data SAttribute
     */
    private onSmeltLimit(data: any): void {
        let jobj = JSON.parse(data.valueStr_S);
        CacheManager.compose.limitGoods = jobj;
        EventManager.dispatch(NetEventEnum.ComposeLimitUpdate);
    }

	/**添加某个装备到合成的装备列表 */
	private selectedEquip(data: any): void{
		this.module.selectedEquip(data);
	}

	/**从合成列表卸下某个装备 */
	private unDressEquip(data: any): void{
		this.module.unDressEquip(data);
	}

	/**背包更新 */
	private backpackChange():void{
		if(this.module && this.module.isShow){
			this.module.updateMaterial();
		}
	}

    /**打开快速合成 */
    private onOpenQuickComposeBuy(code:number,cb:CallBack=null):void {
        if(!this.buyWindow) {
            this.buyWindow = new ComposeBuyWindow();
        }
        this.buyWindow.setBuyCb(cb);
        this.buyWindow.show(code);
    }

}