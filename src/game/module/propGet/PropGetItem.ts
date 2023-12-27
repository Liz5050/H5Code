/**
 * 资源获取跳转
 */
class PropGetItem extends ListRenderer {
	private nameTxt: fairygui.GTextField;
	private type: string;//跳转类型，GotoEnum

	public constructor() {
		super();
	}

	protected constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.nameTxt = this.getChild("txt_name").asTextField;
		this.addClickListener(this.click, this);
	}

	public setData(data: any, index: number): void {
		if (data) {
			this.nameTxt.text = data.name;
			this.type = data.type;
		}
	}

	private click(): void {
		EventManager.dispatch(LocalEventEnum.PropGetGotoLink,{type:this.type});		
		EventManager.dispatch(UIEventEnum.ModuleClose, ModuleEnum.PropGet);
		EventManager.dispatch(UIEventEnum.ModuleClose, ModuleEnum.SpecialEquip);
	}
}