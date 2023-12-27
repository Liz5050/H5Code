class FashionPlayerItem extends ListRenderer {
	private iconLoader:GLoader;
	private timeTxt: fairygui.GRichTextField;
	private statusController: fairygui.Controller;
	private curIndex: number;

	private endTime: number;
	private name_str : string;
	private time_str : string;
	private lvl_str : string;

	public constructor() {
		super();
	}

	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
		this.iconLoader = <GLoader>this.getChild("loader_icon");
		this.timeTxt = this.getChild("txt_time").asRichTextField;
		this.statusController = this.getController("c1");
	}

	public setData(data:any):void {
		this._data = data;
		this.curIndex = CacheManager.fashionPlayer.operationIndex;
		let itemCfg: any = ConfigManager.item.getByPk(data.propCode);
		let star: number = CacheManager.fashionPlayer.getFashionStar(this.curIndex, data.code);
		this.name_str = data.name;
		this.lvl_str = `<font color=${Color.Color_5} size=20>${star}级</font>`;
		if (itemCfg) {
			this.iconLoader.load(URLManager.getIconUrl(itemCfg.icon, URLManager.ITEM_ICON));
		}
		App.TimerManager.remove(this.onCountTime, this);
		this.time_str = "";
		if(CacheManager.fashionPlayer.isFashionActived(this.curIndex, data.code)){
			if(!data.timeLimit){
				this.time_str = `<font color = ${Color.GreenCommon}>永久</font>`;
				this.timeTxt.text = this.lvl_str + "\n" + this.name_str + "\n" + this.time_str;
			}else{
				this.endTime = CacheManager.fashionPlayer.getFashionEndTime(this.curIndex, data.code);
				if(this.endTime){
					this.onCountTime();
					App.TimerManager.doTimer(1000, 0, this.onCountTime, this);
				}
			}
		}
		this.timeTxt.text = this.lvl_str + "\n" + this.name_str + "\n" + this.time_str;
		if(CacheManager.fashionPlayer.isCurFashion(this.curIndex, data.type, data.code)){
			this.statusController.selectedIndex = 1;
		}else{
			this.statusController.selectedIndex = 0;
		}

		CommonUtils.setBtnTips(this, CacheManager.fashionPlayer.checkTipsByIndexAndData(this.curIndex, data));
	}

	private onCountTime(): void{
		let leftTime: number = this.endTime - CacheManager.serverTime.getServerTime();
		this.time_str = App.DateUtils.getTimeStrBySeconds(leftTime, DateUtils.FORMAT_1);
		this.time_str = (this.time_str == "0") ? "" : this.time_str;
		this.timeTxt.text = this.lvl_str + "\n" + this.name_str + "\n" + this.time_str;
		if(this.time_str == "0"){
			ProxyManager.fashionPlayer.checkFashionEndDt();
		}
	}

}