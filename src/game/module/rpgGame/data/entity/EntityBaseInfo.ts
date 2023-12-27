class EntityBaseInfo 
{
	public id:string;
	protected gName:string;
	protected gType:EEntityType;
	protected gCol:number;
	protected gRow:number;
	
	protected gSelfIndex:number = -1;
	public constructor() 
	{
	}

	public get selfIndex():number {
		return this.gSelfIndex;
	}

	public get name_S():string
	{
		return this.gName;
	}

	public set name_S(name: string)
	{
		this.gName = name;
	}

	public get type():EEntityType
	{
		return this.gType;
	}

	public set col(value:number)
	{
		this.gCol = value;
	}

	public set row(value:number)
	{
		this.gRow = value;
	}

	public get col():number
	{
		return this.gCol;
	}

	public get row():number
	{
		return this.gRow;
	}

	public get className():string
	{
		switch(this.gType)
		{
			case EEntityType.EEntityTypeNPC:
				return "Npc";
			case EEntityType.EEntityTypePassPoint:
				return "PassPointEntity";
			case EEntityType.EEntityTypeSceneEffect:
				return "SceneEffect";
		}
	}
}