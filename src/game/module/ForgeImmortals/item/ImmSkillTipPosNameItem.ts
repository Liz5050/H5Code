/**
 * 部位名称item
 * @author zhh
 * @time 2018-08-21 14:31:54
 */
class ImmSkillTipPosNameItem extends ListRenderer {
    private txtName:fairygui.GRichTextField;
	private callW:number = 100;

	public constructor() {
		super();
		
	}
	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
        //---- script make start ----
        this.txtName = this.getChild("txt_name").asRichTextField;

        //---- script make end ----


	}
	public setData(data:any,index:number):void{		
		this._data = data;
		this.itemIndex = index;
		//培养表配置 roleIndex		
		let curSuitLv:number = this._data.curSuitLv;//CacheManager.forgeImmortals.getSuitLevel(this._data.roleIndex,this._data.info.subType);
		this._data.isNext?curSuitLv++:null; //下一阶的item
		let posTarlv:number =  CacheManager.forgeImmortals.suitLvToPosLv(curSuitLv);
		let posLv:number = CacheManager.forgeImmortals.getImmortalLevel(this._data.roleIndex,this._data.info.position);
		let clr:string = posLv < posTarlv?Color.Color_9:Color.Color_7;
		// 当前套装等级 目标等级
		this.txtName.text = HtmlUtil.html(data.info.posName,clr);
		this.callW = this.txtName.width;		
	}

	public get width():number{
		return this.callW;
	}
	


}