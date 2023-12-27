class ActivityDayButton extends ListRenderer{
	private c1:fairygui.Controller;
	public constructor() {
		super();
	}

	protected constructFromXML(xml:any):void {
		super.constructFromXML(xml);
		this.c1 = this.getController("c1");
	}

	public setData(data:any):void {
		this._data = data;
		this.title = "第" + data + "天";
		let info:ActivityInfo = CacheManager.activity.getActivityInfoByType(ESpecialConditonType.ESpecialConditonTypeActivity);
		this.c1.selectedIndex = info != null && info.openedDay >= data ? 1 : 0;
	}

	public get isOpen():boolean {
		return this.c1.selectedIndex == 1;
	}
}