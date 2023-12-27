class RealmController extends BaseController {
	private realModule:RealmModule;

	public constructor() {
		super(ModuleEnum.Realm);
		this.viewIndex = ViewIndex.Two;
		this.addListenerOnShow
	}
	
	protected initView():any{
		if(!this.realModule){
			this.realModule = new RealmModule();
		}
		return this.realModule;
	}

	protected addListenerOnShow():void{
		this.addListen1(NetEventEnum.roleRealmUpdateed,this.onRealmUpdate,this);
		this.addListen1(NetEventEnum.packBackPackItemsChange, this.onPosTypeBagChange, this);
	}
	
	private onRealmUpdate():void{
		if(this.realModule){
			this.realModule.updateAll();
		}
	}
	 private onPosTypeBagChange():void{
        if(this.realModule){
			this.realModule.updateItem();
		}
    }

}