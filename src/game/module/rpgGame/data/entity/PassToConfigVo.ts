class PassToConfigVo 
{
	public name:string;
	public passToId:number;
	public mapId:number;
	public toPoint:egret.Point;
	public constructor() 
	{
	}

	public setData(data:any):void
	{
		this.name = data.name;
		this.passToId = data.passToId;
		this.mapId = data.mapId;
		this.toPoint = new egret.Point(data.toPoint.x,data.toPoint.y);		
	}
}