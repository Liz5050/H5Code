/**
 * 数字键盘输入
 */
class NumberKeyBoardView extends BasePopupView{
	public clickFun: Function;
	private caller: any;
	private inputNumber: number;

	public constructor() {
		super(PackNameEnum.Common, "NumberKeyBoardView");
	}

	public initUI(): void {
		for(let i = 0; i < 10; i++){
			let numBtn: fairygui.GButton = this.getChild("btn_num" + i).asButton;
			numBtn.addClickListener(this.clickNumBtn, this);
		}
		this.getChild("btn_clean").addClickListener(this.clickClean, this);
		this.getChild("btn_sure").addClickListener(this.clickCheck, this);
	}

	private clickClean(): void{
		if(this.clickFun != null){
			this.inputNumber = 0;
			this.clickFun.call(this.caller, -1);
		}
	}

	private clickCheck(): void{
		this.hide();
	}

	private clickNumBtn(e: any): void{
		let numBtn: fairygui.GButton = e.target.asButton;
		if(this.inputNumber == 0){
			this.inputNumber = Number(numBtn.title);
		}else{
			this.inputNumber = Number(`${this.inputNumber}${numBtn.title}`);
		}
		if(this.clickFun != null){
			this.clickFun.call(this.caller, Number(this.inputNumber));
		}
	}

	/**
	 * 设置输入改变回调函数
	 */
	public setCallBack(clickFun: Function, caller: any) {
		this.clickFun = clickFun;
		this.caller = caller;
		this.inputNumber = 0;
	}
}