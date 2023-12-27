class ActivitySevenCategoryBtn extends ListRenderer{
	public constructor() {
		super();
	}

	protected constructFromXML(xml:any):void {
		super.constructFromXML(xml);
	}

	public setData(data:any):void {
		this._data = data;
		let day:number = Math.floor(data / 100);
		let cfgs:any[] = ConfigManager.activitySeven.getTaskItemCfgs(day,data);
		for(let i:number = 0; i < cfgs.length; i++) {
			if(cfgs[i].name) {
				this.title = cfgs[0].name;
				break;
			}
		}
	}
}