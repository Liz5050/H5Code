/**
 * 图鉴UI界面Item
 */
class TrainIllustrateItem extends ListRenderer {
    
	private _loaderImg:GLoader;
	private _loaderFrame:GLoader;
	private _graphMask:fairygui.GGraph;

	private _itemData:ItemData;

	private _txtName:fairygui.GTextField;
	private _txtFight:fairygui.GTextField;

	private _imgKejihuo:fairygui.GImage;
	private _imgYimanji:fairygui.GImage;
	private _imgActived:fairygui.GImage;

	private _imgBounder: fairygui.GLoader;

	private _starDic:any = {};

	private _canActive:boolean = false;

	//特殊标记，是否用在升级界面
	public isUpgrateUI:boolean = false;

	public mc : UIMovieClip = null;

	public constructor() {
		super();
	}

	protected constructFromXML(xml:any):void {			
		this._loaderImg = this.getChild("loader_img") as GLoader;
		this._loaderFrame = this.getChild("loader_frame") as GLoader;
		this._imgBounder = this.getChild("kuang") as GLoader;
		this._txtName = this.getChild("txt_name").asTextField;
		this._txtFight = this.getChild("txt_fight").asTextField;

		for(let i:number=1; i<=10; i++) {
			let star:fairygui.GImage = this.getChild("star_"+i).asImage;
			if(star) {
				this._starDic[i] = star;
			}
		}

		this._imgKejihuo = this.getChild("img_kejihuo").asImage;
		this._imgYimanji = this.getChild("img_yimanji").asImage;

		//未激活蒙板
		this._graphMask = this.getChild("graph_mask").asGraph;
		this._imgActived = this.getChild("actived").asImage;
	}

	public get isCanActive():boolean {
		return this._canActive;
	}

	public setData(data:any, index:number):void {		
		this._data = data;

		this._loaderImg.load(URLManager.getModuleImgUrl("illustrate/img/subtype_" + data.subtype + "/pos_" + data.position + ".jpg", PackNameEnum.Train));

		this._itemData = data.itemData;
		let color:number;
		if(this._itemData.getItemInfo()) {
			color = this._itemData.getColor();
		}
		else {
			color = EColor.EColorRed;
		}
		this._txtName.text = data.posName;
		this._txtName.color = Color.ItemColorHex[color];
		
		this._loaderFrame.load(URLManager.getModuleImgUrl("illustrate/frame/color_" + color + ".png", PackNameEnum.Train));

		let level:number = CacheManager.cultivate.getCultivateLevel(0, ECultivateType.ECultivateTypeIllustrated, data.position);
		for(let i:number=1; i<=10; i++) {
			let star:fairygui.GImage = this._starDic[i];
			if(star) {
				if(i <= level) {
					star.visible = true;
				}
				else {
					star.visible = false;
				}
			}
		}

		let tempLevel = level == -1 ? 0 : level;
		let curConfigData:any = ConfigManager.cultivate.getByPKParams(ECultivateType.ECultivateTypeIllustrated, data.position, tempLevel);
		let attrDict:any = WeaponUtil.getAttrDict(curConfigData.attr);

		let times:number = 1;
		if(curConfigData.attrIndex == 1) {
			times = CacheManager.role.roles.length;
		}
		this._txtFight.text = (WeaponUtil.getCombat(attrDict) * times) + "";
		
		egret.Tween.removeTweens(this._imgKejihuo);
		this._canActive = false;
		this._imgBounder.grayed = false;
		if(level == -1) {
			if(ConfigManager.cultivate.checkCareerFix(curConfigData) && CacheManager.pack.propCache.getItemByCode(curConfigData.itemCode)) {
				this._imgKejihuo.visible = true;
				this._imgYimanji.visible = false;
				this._canActive = true;
				
				if(!this.isUpgrateUI) {
					this._imgKejihuo.scaleX = 1;
					this._imgKejihuo.scaleY = 1;
					egret.Tween.get(this._imgKejihuo, { loop: true }).to({ scaleX: 0.85, scaleY: 0.85 }, 600).to({ scaleX: 1, scaleY: 1 }, 600);
				}
				CommonUtils.setBtnTips(this, true, 181,9,false);
			}
			else {
				this._imgKejihuo.visible = false;
				this._imgYimanji.visible = false;
				this._imgBounder.grayed = true;
				CommonUtils.setBtnTips(this, false);
			}
			this._loaderImg.grayed = true;
			this._loaderImg.alpha = 0.7;
			this._graphMask.visible = false;
			this._imgActived.visible = false;
			if(this.isUpgrateUI) {
				this._loaderImg.alpha = 1;
			}
		}
		else {
			if(level >= ConfigManager.cultivate.getMaxLevel(ECultivateType.ECultivateTypeIllustrated, data.position)) {
				this._imgKejihuo.visible = false;

				//只有一级的图鉴，不显示已满级标示
				if(level == 0) {
					this._imgYimanji.visible = false;
				}
				else {
					this._imgYimanji.visible = true;
				}

				CommonUtils.setBtnTips(this, false);
			}
			else {
				this._imgKejihuo.visible = false;
				this._imgYimanji.visible = false;

				//可升级
				let exp:number = CacheManager.role.getMoney(EPriceUnit.EPriceUnitIllustratedExp);
				let nextConfigData:any = ConfigManager.cultivate.getByPKParams(ECultivateType.ECultivateTypeIllustrated, data.position, level+1);
				if(nextConfigData && exp >= nextConfigData.itemNum) {
					CommonUtils.setBtnTips(this, true, 181,9,false);
				}
				else {
					CommonUtils.setBtnTips(this, false);
				}
			}
			this._loaderImg.grayed = false;
			this._graphMask.visible = false;
			this._loaderImg.alpha = 1;
			this._imgActived.visible = true;
		}
		if(this._imgKejihuo.visible) {
			this.addEffect();
		}
		else {
			this.removeEffect();
		}
	}

	private addEffect () {
		if (this.mc == null){
			this.mc = UIMovieManager.get(PackNameEnum.MCIlltrainActive, -272, -247);
			this.mc.playing = true;
			this.mc.frame = 0;
		}
		this.addChild(this.mc);
	}

	private removeEffect() {
		if (this.mc) {
            UIMovieManager.push(this.mc);
            this.mc = null;
        }
	}

	public setGrayed(gray : boolean) {
		this._loaderImg.grayed = gray;
		this._imgBounder.grayed = gray;
	}
	

}