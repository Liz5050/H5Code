class ForgeCastingLineItem extends BaseView {
	private controller:fairygui.Controller;
	public constructor(component:fairygui.GComponent) {
		super(component);
	}

	public initOptUI():void {
		this.controller = this.getController("c1");
	}

	public updateAll():void {

	}

	public set selected(value:boolean) {
		this.controller.selectedIndex = value ? 1 : 0;
	}	
}