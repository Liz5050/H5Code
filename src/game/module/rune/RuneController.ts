class RuneController extends BaseController {
	private module: RuneModule;
	private runePackWindow: RunePackWindow;
	private runePandectWindow: RunePandectWindow;
	private runeAttrDetailView: RuneAttrDetailView;

	public constructor() {
		super(ModuleEnum.Rune);
		this.viewIndex = ViewIndex.Two;
	}

	public initView(): BaseModule {
		this.module = new RuneModule();
		return this.module;
	}

	public addListenerOnInit(): void {
		this.addMsgListener(EGateCommand[EGateCommand.ECmdGatePlayerRuneNew], this.playerRuneNew, this);
		// this.addListen0(NetEventEnum.moneyRuneCoin, this.updateRuneCoin, this);
		this.addListen0(UIEventEnum.RunePackClose, this.runePackClose, this);
		this.addListen0(LocalEventEnum.RuneDecompose, this.runeDecomposeHandler, this);
	}

	public addListenerOnShow(): void {
		this.addListen1(UIEventEnum.RunePandectOpen, this.runePandectOpen, this);
		this.addListen1(UIEventEnum.RunePackOpen, this.runePackOpen, this);
		this.addListen1(UIEventEnum.RuneDetailOpen, this.runeDetailOpen, this);
		this.addListen1(NetEventEnum.packPosTypeRuneChange, this.updateRunePack, this);

	}

	/**
	 * 符文登录推送，镶嵌升级返回
	 * @param data SSeqPlayerRune
	 */
	private playerRuneNew(data: any): void {
		// CacheManager.runeInlay.setData(data.list.data);
		CacheManager.rune.setData(data.playerRunes.data);
		if (this.isShow) {
			this.module.updataRuneInlay();
		}
		EventManager.dispatch(NetEventEnum.RuneInlayUpdate);
	}

	private runeDecomposeHandler(uids: Array<string>, amounts: Array<number>): void{
		ProxyManager.rune.decomposeRuneEx({"key_S": uids, "value_I": amounts});
	}

	/**符文背包变动过 */
	private updateRunePack(): void {
		if (this.isShow) {
			this.module.updataRuneDecompose();
		}
	}

	// /**更新符文碎片 */
	// private updateRuneCoin(): void {
	// 	if (this.isShow()) {
	// 		this.module.updataRuneExchange();
	// 	}
	// }

	/**
	 * 打开符文背包窗口
	 */
	private runePackOpen(inlayData: any = {}, roleIndex: number = -1): void {
		if (!this.runePackWindow) {
			this.runePackWindow = new RunePackWindow();
		}
		// this.runePackWindow.setHole(hole);
		let data: any = {"inlayData": inlayData, "roleIndex": roleIndex};
		this.runePackWindow.show(data);
	}

	/**
	 * 打开符文总览窗口
	 */
	private runePandectOpen(): void {
		if (!this.runePandectWindow) {
			this.runePandectWindow = new RunePandectWindow();
		}
		this.runePandectWindow.show();
	}

	/**
	 * 关闭符文背包窗口
	 */
	private runePackClose(): void {
		if (this.runePackWindow.isShow) {
			this.runePackWindow.hide();
		}
	}

	private runeDetailOpen(roleIndex: number): void{
		if (!this.runeAttrDetailView) {
			this.runeAttrDetailView = new RuneAttrDetailView();
		}
		this.runeAttrDetailView.show(roleIndex);
		this.runeAttrDetailView.center();
		
	}

}