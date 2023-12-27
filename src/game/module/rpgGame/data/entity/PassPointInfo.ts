class PassPointInfo extends EntityBaseInfo
{
	public passPointType:number;
	public passTo:PassToConfigVo[];
	public point:egret.Point;
	public process:number;
	public passPointId:number;
	public mapId:number;
	public offset:egret.Point;
	public constructor() 
	{
		super();
	}

	public setData(passPoint:any):void
	{
		this.passPointId = passPoint.passPointId;
		this.gName = passPoint.name;
		this.gType = EEntityType.EEntityTypePassPoint;
		this.passPointType = passPoint.passPointType;
		this.passTo = [];
		for(let i:number = 0; i < passPoint.passTo.length; i++)
		{
			let _passTo:PassToConfigVo = new PassToConfigVo();
			_passTo.setData(passPoint.passTo[i]);
			this.passTo.push(_passTo);
		}
		this.point = new egret.Point(passPoint.point.x,passPoint.point.y);
		this.gCol = this.point.x;
		this.gRow = this.point.y;
		this.process = passPoint.process;
		this.mapId = passPoint.mapId;
		this.offset = new egret.Point(passPoint.offset.x,passPoint.offset.y);
	}

	public get name():string
	{
		return this.gName;
	}
}