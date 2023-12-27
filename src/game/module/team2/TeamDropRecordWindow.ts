class TeamDropRecordWindow extends BaseWindow {
    private record_list : List;
	private c1 : fairygui.Controller;

	public constructor() {
		super(PackNameEnum.Team2,"TeamDropRecordWindow",ModuleEnum.Team2);
	}

	public initOptUI():void {
		this.record_list = new List(this.getGObject("list_item").asList);
		this.c1 = this.getController("c1");
	}

	public updateAll(data : any):void {
		if(data.msgs.msgs.data.length == 0) {
			this.c1.setSelectedIndex(0);
		}
		else{
			this.c1.setSelectedIndex(1);
		}
		this.record_list.setVirtual(data.msgs.msgs.data);
	}

	
}