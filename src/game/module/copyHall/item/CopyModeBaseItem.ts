class CopyModeBaseItem extends ListRenderer {
	protected panel: fairygui.GComponent;
	protected _isOpen: boolean;
	public constructor() {
		super();
	}
	protected constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		var panel: fairygui.GComponent = this.getChild("panel_mode1").asCom;
		this.panel = panel;	

	}

	public setData(data:any,index:number):void{
		this._data = data;		
		this.setOpenStatu();
	}

	public setSelectStatu(value: boolean): void {
		var s: number = value ? 1 : 0.7;
		this.panel.scaleX = this.panel.scaleY = s;		
	}
	public get isOpen(): boolean {
		return this._isOpen;
	}
	protected initSelect():void{

	}
	protected setOpenStatu():void{
		
	}

}