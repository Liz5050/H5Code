class ServerItem extends LoginBaseItem {
	private loader_type:GLoader;
	public constructor() {
		super();
	}
	protected constructFromXML(xml:any):void{
		super.constructFromXML(xml);
		this.loader_type = <GLoader>this.getChild("loader_type");
	}
	public setData(data:any,index:number):void{
		super.setData(data,index);
		this.loader_type.load(URLManager.getPackResUrl(PackNameEnum.Login,"fluency"));
	}
}