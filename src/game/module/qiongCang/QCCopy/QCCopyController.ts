class QCCopyController extends SubController{
	public constructor() {
		super();
	}

	public getModule(): BaseModule {
		return this._module;
	}

	protected addListenerOnInit():void {
		this.addMsgListener(EGateCommand[EGateCommand.ECmdGatePushQiongCangCopyMsgList],this.onQCMsgList,this);
		this.addMsgListener(EGateCommand[EGateCommand.ECmdGatePushQiongCangCopyMsg],this.onQCMsgUpdate,this);
    }

    public addListenerOnShow(): void {
		
    }
	
	/**
	 * 下推数据
	 * SQiongCangMsgList
	 */
	private onQCMsgList(data:any):void{
		CacheManager.qcCopy.setFloorList(data,false); //是一个 SQiongCangMsg 数组
	}
	/**
	 * 更新单层数据
	 */
	private onQCMsgUpdate(data:any):void{
		CacheManager.qcCopy.setFloorList(data,true);
	}


}