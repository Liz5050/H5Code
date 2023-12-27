class Slider extends fairygui.GSlider {
	private numTxt: fairygui.GTextField;
	private addbtn: fairygui.GButton;
	private minusBtn: fairygui.GButton;
	private changeFun: Function;
	private caller: any;

	private _min: number = 1;

	public constructor() {
		super();
	}

	protected constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		let _com:fairygui.GObject = this.getChild("levelTxt");
		if(_com)
		{
			this.numTxt = _com.asTextField;
		}
		this.addbtn = this.getChild("btn_add").asButton;
		this.minusBtn = this.getChild("btn_minus").asButton;

		this.addbtn.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onAddTouchBeginHandler,this)
		this.minusBtn.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onMinusTouchBeginHandler,this)
		this.addEventListener(fairygui.StateChangeEvent.CHANGED, this.onChanged, this);

		// //禁用点击改变值，否则点击+-按钮时值自动计算
		// this.changeOnClick = false;
	}

	/**
	 * 设置输入改变回调函数
	 */
	public setChangeFun(changeFun: Function, caller: any) {
		this.changeFun = changeFun;
		this.caller = caller;
	}

	public set min(value: number) {
		this._min = value;
	}

	public get min(): number {
		return this._min;
	}

	public set title(value:string)
	{
		if(!this.numTxt) return;
		this.numTxt.text = value;
	}

	public set cusValue(value:number)
	{
		this.value = value;
		if (this.changeFun != null && this.caller != null) {
			this.changeFun.apply(this.caller);
		}
	}

	public get cusValue():number
	{
		return this.value;
	}	

	private onAddTouchBeginHandler(evt:egret.Event): void {
		if (this.cusValue < this.max) {
			this.cusValue += 1;
		}
		evt.stopImmediatePropagation();
	}

	private onMinusTouchBeginHandler(evt:egret.Event): void {
		if (this.cusValue > this._min) {
			this.cusValue -= 1;
		}
		evt.stopImmediatePropagation();
	}

	private onChanged(): void {
		if(this.cusValue < this._min){
			this.cusValue = this._min;
		}
		if(this.cusValue > this.max){
			this.cusValue = this.max;
		}
		if (this.changeFun != null && this.caller != null) {
			this.changeFun.apply(this.caller);
		}
	}
}