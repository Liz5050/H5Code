/**
 * 五色石药品
 * @author zhh
 * @time 2018-10-16 19:11:37
 */
class ColorStoneDrugItem extends ListRenderer {
    private loaderIcon:GLoader;
    private txtDrug1:fairygui.GTextField;
    private txtNum:fairygui.GRichTextField;
	private isMax:boolean;
	private hadNum:number = 0;
	private toolTipData:ToolTipData;
	private useNum:number = 0;
	private maxNum:number = 0;
	private curCfg:any;
	public constructor() {
		super();
		
	}
	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
        //---- script make start ----
        this.loaderIcon = <GLoader>this.getChild("loader_icon");
        this.txtDrug1 = this.getChild("txt_drug_1").asTextField;
        this.txtNum = this.getChild("txt_num").asRichTextField;
        //---- script make end ----
		this.addClickListener(this.onClick,this);

	}
	public setData(data:any,index:number):void{		
		this._data = data;
		this.itemIndex = index;
		let item:ItemData = <ItemData>this._data.item;
		this.loaderIcon.load(item.getIconRes());
		let roleIndex:number = this._data.roleIndex;
		let exInfo: any = CacheManager.role.getPlayerStrengthenExtInfo(EStrengthenExType.EStrengthenExTypeColorStone,roleIndex);
		let drugDict: any;
		if(exInfo && exInfo.drugDict){
			drugDict = StructUtil.dictIntIntToDict(exInfo.drugDict);
		}
		let n:number = drugDict && drugDict[item.getCode()]?drugDict[item.getCode()]:0;//已使用的数量
		this.useNum = n;
		this.txtNum.text = n + "";
		let lv:number = CacheManager.role.getPlayerStrengthenExLevel(EStrengthenExType.EStrengthenExTypeColorStone,roleIndex); 
		let cfg:any = ConfigManager.mgStrengthenEx.getByTypeAndLevel(EStrengthenExType.EStrengthenExTypeColorStone,lv);
		this.curCfg = cfg;
		let key:string = `drug${this.itemIndex+1}ItemMax`;
		let maxN:number = cfg && cfg[key]?cfg[key]:0; 
		this.maxNum = maxN; 
		let isMax:boolean = maxN>0 && n>=maxN; //是否达到使用上限
		this.isMax = isMax;
		this.hadNum = CacheManager.pack.getItemCount(item.getCode());
		this.txtDrug1.text = this.hadNum+'↑'; 
		this.txtDrug1.visible = this.hadNum > 0 && !isMax; 
	}
	/**点击弹出tooltip */
	public showDrugTip(): void {
		let itemData: ItemData = this._data.item;
		if (itemData) {
			if (!this.toolTipData) {
				this.toolTipData = new ToolTipData();
			}
			this.toolTipData.data = itemData;
			this.toolTipData.type = ToolTipTypeEnum.Drug2;
			let lv:number = CacheManager.role.getPlayerStrengthenExLevel(EStrengthenExType.EStrengthenExTypeColorStone,this._data.roleIndex); 
			let nextMaxInfo:any = ConfigManager.mgStrengthenEx.getNextMaxDrupInfo(EStrengthenExType.EStrengthenExTypeColorStone,lv,this.maxNum,this.itemIndex+1);
			let next:number =  nextMaxInfo?nextMaxInfo.stage:this.curCfg.stage;
			this.toolTipData.extData = {"useNum": this.useNum, "maxNum": this.maxNum,isMax:this.isMax,next:next};
			ToolTipManager.show(this.toolTipData);
		}
	}

	private onClick(e:any):void{
		//使用药品
		if(this.hadNum>0 && !this.isMax){
			EventManager.dispatch(LocalEventEnum.PlayerStrengthExUseDrug,
			EStrengthenExType.EStrengthenExTypeColorStone,this._data.roleIndex,this.itemIndex+1,1);
		}else{
			this.showDrugTip();
		}
				
	}


}