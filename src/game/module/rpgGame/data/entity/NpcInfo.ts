class NpcInfo extends EntityBaseInfo
{
	public passTo:PassToConfigVo[];
	public point:egret.Point;
	public npcType:number;
	public notShowInMap:number;
	public mapId:number;
	public offset:egret.Point;
	private _npcCfg:any;
	public constructor() 
	{
		super();
	}

	public setData(npcData:any):void
	{
		this.gType = EEntityType.EEntityTypeNPC;
		this.id = String(npcData.npcId);
		this.gName = npcData.name;
		this.passTo = [];
		for(let i:number = 0; i < npcData.passTo.length; i++)
		{
			let _passTo:PassToConfigVo = new PassToConfigVo();
			_passTo.setData(npcData.passTo[i]);
			this.passTo.push(_passTo);
		}
		this.npcType = npcData.npcType;
		this.notShowInMap = npcData.notShowInMap;
		this.mapId = npcData.mapId;
		this.point = new egret.Point(npcData.point.x,npcData.point.y);
		this.gCol = this.point.x;
		this.gRow = this.point.y;
		this.offset = new egret.Point(npcData.offset.x,npcData.offset.y);
	}

	public get npcCfg():any {
		if(!this._npcCfg) {
			this._npcCfg = ConfigManager.npc.getByPk(this.id);
		}
		return this._npcCfg;
	}
}