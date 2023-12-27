/**
 * 神器碎片Item
 * @author zhh
 * @time 2018-06-11 15:10:24
 */
class GodWeaponPieceItem extends ListRenderer {
    private loaderImg:GLoader;
    private txtPiecename:fairygui.GRichTextField;
	private _toolTipData:ToolTipData;
	private actEff:UIMovieClip;
	private _isCanAct: boolean;

	public constructor() {
		super();
		
	}
	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
        //---- script make start ----
        this.loaderImg = <GLoader>this.getChild("loader_img");
        this.txtPiecename = this.getChild("txt_pieceName").asRichTextField;
        //---- script make end ----

	}
	public setData(data:any,index:number):void{		
		this._data = data;
		this.itemIndex = index;		
		let code:number = ObjectUtil.getConfigVal(this._data,"code");
		let piece:number = ObjectUtil.getConfigVal(this._data,"piece");
		let isAct:boolean = CacheManager.godWeapon.isGodWPieceAct(code,piece);
		if(!this._toolTipData){
			this._toolTipData = new ToolTipData();
		}
		this._toolTipData.data = this._data;
		let clr:string = isAct?Color.GreenCommon:"#f2e1c0";
		if(CacheManager.godWeapon.isGodWPieceCanAct(code,piece)){
			this._toolTipData.type = ToolTipTypeEnum.GodWeaponPieceAct;
		}else{
			this._toolTipData.type = ToolTipTypeEnum.GodWeaponPiece;
		}
		this.txtPiecename.fontSize = code==1?28:22;
		this.txtPiecename.text = HtmlUtil.html(this._data.pieceName,clr,false,0,"",true);
		
		let url:string = ConfigManager.godWeapon.getPieceUrl(this._data);
		this.loaderImg.clear();
		this.loaderImg.load(url);
		
		this._isCanAct = CacheManager.godWeapon.isGodWPieceCanAct(code,piece);
		this.addActEffect(this._isCanAct,code);

	}
	public get width():number{
		if(this.txtPiecename){
			return this.txtPiecename.x + this.txtPiecename.textWidth;
		}
		return 161;
	}

	public get toolTipData():ToolTipData{
		return this._toolTipData;
	}

	public addActEffect(isAdd:boolean,code:number):void{
		if(isAdd){
			if(!this.actEff){			
				this.actEff = UIMovieManager.get(PackNameEnum.MCOneKey);		
			}
			this.addChild(this.actEff);
			let isSpec:boolean = code==1;
			this.actEff.scaleX = isSpec?1.05:0.87;
			this.actEff.scaleY = 0.8;
			this.actEff.x = isSpec?-170:-145;
			this.actEff.y = -184;
			this.actEff.frame = 0;
		}else{
			if(this.actEff){
				this.actEff.destroy();
				this.actEff.removeFromParent();
				this.actEff = null;
			}
			
		}
		
	}

	public get isCanAct(): boolean {
		return this._isCanAct;
	}

}