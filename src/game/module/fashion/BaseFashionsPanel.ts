class BaseFashionsPanel extends BaseTabPanel{
	protected starsUpBtn: fairygui.GButton;
	protected activationBtn: fairygui.GButton;
	protected list_fashion:List;
	public constructor(view: fairygui.GComponent, controller: fairygui.Controller, index:number) {
		super(view, controller, index);
	}
	public initOptUI():void{

	}
	public updateAll():void{

	}
	protected setBtnTip(isTips:boolean):void{
		var btn:fairygui.GButton = this.starsUpBtn.visible?this.starsUpBtn:this.activationBtn;
		CommonUtils.setBtnTips(btn,isTips);
	}

	protected updateCurFashionItemTips():void{
		var item:FashionItem = <FashionItem>this.list_fashion.selectedItem;
		if(item){
			item.updateTips();
		}
	}

}