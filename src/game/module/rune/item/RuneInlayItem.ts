/**
 * 符文镶嵌项 
 */
class RuneInlayItem extends fairygui.GButton{
	private levelTxt: fairygui.GRichTextField; 
	private txtBgImg: fairygui.GImage;
	public iconLoader: GLoader;
	private conditionController: fairygui.Controller;
	private _runeData: any;
	private roleIndex: number;


	public constructor() {
		super();
	}

	public constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.levelTxt = this.getChild("txt_level").asRichTextField;
		this.txtBgImg = this.getChild("img_txtBg").asImage;
		this.iconLoader = this.getChild("loader") as GLoader;
		this.conditionController = this.getController("c1");
	}

	public setData(runeData: any, roleIndex: number):void{
		let itemDatas: Array<ItemData> = CacheManager.rune.getInlayItem();
		let isBtnTip: boolean = false;
		this.roleIndex = roleIndex;
		this._runeData = runeData;
		this.levelTxt.text = "";
		if(runeData["open"]){
			this.touchable = true;
			if(runeData["item"]){
				let itemData: ItemData = new ItemData(runeData["item"]);
				this.iconLoader.load(itemData.getIconRes());
				this.levelTxt.text = `<font color='${Color.ItemColor[itemData.getColor()]}'>${itemData.getName()} Lv.${runeData["level"]}</font>`;
				this.conditionController.selectedIndex = 2;
				if(CacheManager.rune.canUpgradeRune(runeData) || CacheManager.rune.isHasHigtRune(runeData)){
					isBtnTip = true;
				}
			}
			else{
				this.conditionController.selectedIndex = 1;
				for(let itemData of itemDatas){
					if(CacheManager.rune.isCanInlay(this.roleIndex, itemData, runeData["hole"])){
						isBtnTip = true;
						break;
					}
				}
			}
		}
		else{
			this.touchable = false;
			this.conditionController.selectedIndex = 0;
			this.txtBgImg.visible = false;
			if(runeData["nextOpen"]){
				this.levelTxt.text = `通关<font color='${Color.Green2}'>诛仙塔${runeData["nextOpen"]}层</font>开启`;
				this.txtBgImg.visible = true;
			}
		}
		CommonUtils.setBtnTips(this, isBtnTip, 94, 23,false);
	}

	public getData(): any{
		return this._runeData;
	}

	public getSelected(): number{
		return this.conditionController.selectedIndex;
	}
}