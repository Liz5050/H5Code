/**
 * 扩展窗口
 */

class PackExtendWindow extends BaseWindow {
	private numberInput: NumberInput;
	private costTxt: fairygui.GTextField;
	private keyAmount: number;
	private ensureBtn: fairygui.GButton;
	private cancelBtn: fairygui.GButton;
	private extendCapacity: number;
	private cost: number;

	private _posType: EPlayerItemPosType;

	public constructor() {
		super(PackNameEnum.Pack, "WindowExtend");
	}

	public initOptUI() {
		this.numberInput = <NumberInput>this.getGObject("numberInput");
		this.costTxt = this.getGObject("txt_cost").asTextField;
		this.ensureBtn = this.getGObject("btn_ensure").asButton;
		this.cancelBtn = this.getGObject("btn_cancel").asButton;
		this.numberInput.min = 5;
		this.numberInput.max = 500;
		this.numberInput.addValue = 5;
		this.numberInput.value = 5;
		this.numberInput.setKeyBoard(false);
		this.numberInput.setChangeFun(this.calculateMoney, this);
		this.ensureBtn.addClickListener(this.checkGold, this);
		this.cancelBtn.addClickListener(this.packExtendWindowHide, this);
	}

	public set posType(posType: EPlayerItemPosType) {
		this._posType = posType;
	}

	public updateAll(): void {
		this.extendCapacity = CacheManager.pack.backPackCache.getExtendCapacity();
		this.numberInput.max = this.extendCapacity;
		this.numberInput.value = 5;
		this.calculateMoney();
	}

	/**发送扩容数据给服务端 */
	public sendAddBagCapacity(): void {
		let value: number = this.numberInput.value;
		EventManager.dispatch(LocalEventEnum.PackExtendSend, { "posType": this._posType, "value": value });
	}

	private packExtendWindowHide(): void {
		this.hide();
	}

	/**扩容金额计算 */
	private calculateMoney(): void {
		let capacity: number = CacheManager.pack.backPackCache.capacity;
		let newExtendCapacity: number = capacity + this.numberInput.value;
		let totalAdd: number = CacheManager.pack.backPackCache.getAddCapacity();
		let moneyCost: number = 0;
		for (let i = capacity + 5; i <= newExtendCapacity; i += 5) {
			moneyCost += Math.floor((i - 200 - totalAdd - 5) / 10) * 10 + 30;
		}
		this.cost = moneyCost;
		this.costTxt.text = this.cost.toString();
	}

	private checkGold(): void {
		if (MoneyUtil.checkEnough(EPriceUnit.EPriceUnitGold, this.cost)) {
			this.sendAddBagCapacity();
		} else {
			this.hide();
		}
	}

}