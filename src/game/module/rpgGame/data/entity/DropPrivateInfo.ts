class DropPrivateInfo extends EntityInfo
{
	public sItemData:any;
	public startX:number;
	public startY:number;
	public ownerId:any;//获得者实体id
	public constructor() 
	{
		super();
	}

	public setData(posX:number,posY:number,sItem:any,startX:number,startY:number):void
	{
		this.gType = EEntityType.EEntityTypeDropItemPrivate;
		// this.points = [];
		// this.points.push(pt);
		this.sItemData = sItem;
		this.startX = startX;
		this.startY = startY;
		this.gCol = posX;
		this.gRow = posY;
	}

	//   SEntityId entityId;					//实体ID
        //   int mapId;									//地图
        //   SPoint point;								//坐标
        //   int bossCode;								//怪物code
        //   SEntityId captainId;				//队长ID
        //   SeqPlayerItem playerItem;   //物品列表
}