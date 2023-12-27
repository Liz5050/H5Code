class BaseShapeCache implements ICache {
	public materialItems:Array<any>;
	public drugItems:Array<any>;

	public constructor() {
	}
	public clear():void{

	}

	protected getDrugs(shape:number,tarArr:ItemData[]=null):ItemData[]{
		var drugItems:ItemData[] = ShapeUtils.getDrugs(shape);		
		return drugItems;
	}
}