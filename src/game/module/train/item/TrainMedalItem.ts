/**
 * 勋章UI界面Item
 * @author zhh
 * @time 2018-07-27 14:41:47
 */
class TrainMedalItem extends ListRenderer {
    private loaderIco:GLoader;
    private txtName:fairygui.GTextField;
	private progressBar:UIProgressBar;
	private c1:fairygui.Controller;
	public constructor() {
		super();
		
	}
	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
        //---- script make start ----
        this.loaderIco = <GLoader>this.getChild("loader_ico");
        this.txtName = this.getChild("txt_name").asTextField;
		this.progressBar = <UIProgressBar>this.getChild("progressBar");
		this.c1 = this.getController("c1");
        //---- script make end ----
		this.progressBar.setStyle(URLManager.getPackResUrl(PackNameEnum.TrainMedalPanel,"bar_1"),URLManager.getPackResUrl(PackNameEnum.Common,"bg_1"),128,21,2,2);
		this.progressBar.labelType = BarLabelType.Current_Total;
		this.progressBar.labelSize = 18;
		this.progressBar.textColor = 0xffffff;
		//this.progressBar.textStroke = 1;
		//this.progressBar.textStrokeColor = 0x330000;		
		this.progressBar.isFixPos = true;
	}
	public setData(data:any,index:number):void{		
		this._data = data;
		let type:number = this._data;
		this.itemIndex = index;
		let nameStr:string = LangTrain.LangMedalItemName[type];
		this.txtName.text = nameStr;
		this.loaderIco.clear();
		this.loaderIco.load(ConfigManager.medal.getItemIcoUrl(type));
		let curTotalLv:number = CacheManager.medal.getStrenthenTypeTotalLv(type);	
		let needLv:number = ConfigManager.medal.getItemNeedLv(CacheManager.medal.curLevel+1,type);
		let isOk:boolean = curTotalLv>=needLv;
		let idx:number = isOk?1:0;
		this.c1.setSelectedIndex(idx); 
		this.progressBar.setValue(curTotalLv,needLv);
		Log.trace(Log.TEST,`当前勋章等级:${CacheManager.medal.curLevel}`,nameStr,"当前总等级:",curTotalLv,"需求等级:",needLv,"枚举类型:",type);
	}


}