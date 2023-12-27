class ShapeUpdateCommand implements ICommand{
	public constructor() {
	}

	public onMessage(data:any, msgId:number):void{
		let result:boolean = data.result;
		let addLucky:number = data.addLucky;
		Log.trace(Log.RPG, "******************result********************", result);
		Log.trace(Log.RPG, "********************addLucky******************", addLucky);
	}
}