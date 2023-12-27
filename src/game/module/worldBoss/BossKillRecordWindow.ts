class BossKillRecordWindow extends BaseWindow {
	protected list_record:List;
	public constructor() {
		super(PackNameEnum.WorldBoss,"WindowKillRecord");
	}
	public initOptUI():void{
		this.list_record = new List(this.getGObject("list_record").asList);
	}

	public updateAll():void{

	}
	
	public update(data?:any):void{
		var inf:any = data[0];
		this.list_record.data = data;
	}
}