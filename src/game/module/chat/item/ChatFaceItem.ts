class ChatFaceItem extends ListRenderer {
	private static TOP_ALIGN_IDS:number[] = [3,10,11,21];
	private static BOTTOM_ALIGN_IDS:number[] = [9,12,34];
	private loaderFace:GLoader;

	public constructor() {
		super();
		
	}
	protected constructFromXML(xml:any):void{
		super.constructFromXML(xml);
	}
	public setData(data:any,index:number=-1):void{
		this._data = data;
		var resName:string = "emoji_"+this._data.id.toString();
		if(!this.loaderFace){
			this.loaderFace = ObjectPool.pop("GLoader");			
			this.loaderFace.setSize(44,44);			
		}		
		this.loaderFace.x = 0; 
		this.loaderFace.y = 0;
		this.loaderFace.align = fairygui.AlignType.Center;
		this.loaderFace.verticalAlign = fairygui.VertAlignType.Middle;
		this.addChild(this.loaderFace);
		this.loaderFace.load(URLManager.getPackResUrl(PackNameEnum.ChatFace,resName));
		
		
	}
	
	public dispose():void {        
		super.dispose();
	}

	public destroy():void{
		this.removeFromParent();
		if(this.loaderFace){
			this.loaderFace.destroy();
		}
		this.loaderFace = null;
	}
	

}