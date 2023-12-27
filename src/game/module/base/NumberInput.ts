/**
 * 数字输入框
 */
class NumberInput extends fairygui.GComponent {
	private numTxt: fairygui.GRichTextField;
	private addbtn: fairygui.GButton;
	private minusBtn: fairygui.GButton;
	private addRightBtn:fairygui.GButton;
	private minusLeftBtn:fairygui.GButton;
	// private numKeyBoard: fairygui.GComponent;
	private inputView: NumberKeyBoardView;
	private clickLoader: fairygui.GLoader;
	private changeFun: Function;
	private caller: any;

	private _value: number = 1;
	private _min: number = 1;
	private _max: number = 999;
	private _addValue: number = 1;
	private _addMoreValue:number = 10;

	private _showExBtn:boolean = false;

	public minTipStr: string = "已经是最小数量";
	public maxTipStr: string = "已经是最大数量";

	public constructor() {
		super();
	}

	protected constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.numTxt = this.getChild("txt_num").asRichTextField;
		this.addbtn = this.getChild("btn_add").asButton;
		this.minusBtn = this.getChild("btn_minus").asButton;
		this.clickLoader = this.getChild("loader_click").asLoader;

		this.addRightBtn = this.getChild("btn_rightAdd").asButton;
		this.minusLeftBtn = this.getChild("btn_leftMinus").asButton;
		this.addRightBtn.visible = this.minusLeftBtn.visible = false;

		this.numTxt.addEventListener(egret.Event.CHANGE, this.onChanged, this);
		// this.clickLoader.addClickListener(this.clickNumTxt, this);
		this.addRightBtn.addClickListener(this.addClick,this);
		this.minusLeftBtn.addClickListener(this.minusClick,this);
		this.addbtn.addClickListener(this.addClick, this);
		this.minusBtn.addClickListener(this.minusClick, this);
		
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

	public set max(value: number) {
		this._max = value;
	}

	public get max(): number {
		return this._max;
	}

	public set value(value: number) {
		if (this._min != -this._addValue) {
			if (value < this._min) {
				value = this._min;
			}
		}
		if (this._max != -this._addValue) {
			if (value > this._max) {
				value = this._max;
			}
		}
		this._value = value;
		this.numTxt.text = value.toString();
	}

	public get value(): number {
		return this._value;
	}

	public set addValue(value: number) {
		this._addValue = value;
	}

	public get addValue(): number {
		return this._addValue;
	}

	public set addMoreValue(value:number) {
		this._addMoreValue = value;
	}

	public get addMoreValue():number {
		return this._addMoreValue;
	}

	public set showExBtn(value:boolean) {
		this._showExBtn = value;
		this.addRightBtn.visible = this.minusLeftBtn.visible = value;
	}

	private onChanged(): void {
        if(Number(this.numTxt.text).toString() == "NaN"){
            this.value = this._value;
        }else{
            this.value = Number(this.numTxt.text) || this._min;
        }
        if (this.changeFun != null && this.caller != null) {
            this.changeFun.apply(this.caller);
        }
	}

	private clickNumTxt(): void{
		if(!this.inputView){
			this.inputView = new NumberKeyBoardView();
		}
		let point:egret.Point = this.localToGlobal(0,0,RpgGameUtils.point);
		this.inputView.show(point.x - 98, point.y - 304);
		this.inputView.setCallBack(this.clickNum, this);
	}

	private addClick(evt:egret.TouchEvent): void {
		let btn:fairygui.GButton = evt.currentTarget as fairygui.GButton;
		let changeValue:number = btn == this.addbtn ? this.addValue : this.addMoreValue;
		if(this.value + changeValue > this.max){
			if(this.maxTipStr != ""){
				Tip.showTip(this.maxTipStr);
			}
		}
		this.value += changeValue;
		this.onChanged();
	}

	private minusClick(evt:egret.TouchEvent): void {
		let btn:fairygui.GButton = evt.currentTarget as fairygui.GButton;
		let changeValue:number = btn == this.minusBtn ? this.addValue : this.addMoreValue;
		if(this.value - changeValue < this.min){
			if(this.minTipStr != ""){
				Tip.showTip(this.minTipStr);
			}
		}
		this.value -= changeValue;
		this.onChanged();
	}

	private clickNum(value: number):void{
		if(value == -this._addValue){
			this.value = this.min;
		}else{
			this.value = value;
		}
		this.onChanged();
	}

	public setKeyBoard(value: boolean): void{
		this.clickLoader.touchable = value;
	}

}