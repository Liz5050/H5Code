/**
 * 跨服掉落记录
 * @author zhh
 * @time 2018-12-12 16:53:19
 */
class CrossDropLogPanel extends BaseTabView{
    private listLog:List;
	private infos:any[];
	private c1:fairygui.Controller;
	private loaderBg:GLoader;
	public constructor() {
		super();
	}

	protected initOptUI():void{
        //---- script make start ----
		this.loaderBg = <GLoader>this.getGObject("load_bg")
		this.c1 = this.getController("c1");
        this.listLog = new List(this.getGObject("list_log").asList);

        //---- script make end ----
		this.loaderBg.load(URLManager.getModuleImgUrl(PackNameEnum.CrossBoss,"cross_guild_bg"));

	}
	public updateAll(data?:any):void{
		this.infos = CacheManager.crossBoss.getDropLog(ECachedDropLogMsgCopyType.ECachedDropLogMsgCopyTypeGBIC);
		let idx:number = 1;
		if(this.infos && this.infos.length>0){
			this.listLog.setVirtual(this.infos,this.setItemRenderer,this);
			idx = 0;
		}
		this.c1.setSelectedIndex(idx);
	}

	private setItemRenderer(index: number, item: fairygui.GObject): void {
		if (item["setData"] == undefined) return;
		let logItem:CrossDropLogItem = <CrossDropLogItem>item;
		item["setData"](this.infos[index], index);		
		logItem.setSize(logItem.width,logItem.getHeight());
	}
	
    /**
	 * 销毁函数
	 */
	public destroy():void{
		super.destroy();
	}

}