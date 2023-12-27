class ActivityButtonItem extends ListRenderer {
	private c1:fairygui.Controller;
	private iconLoader:GLoader;
	private _hasTip:boolean = false;
	private iconEffect:UIMovieClip;
	public constructor() {
		super();
	}

	protected constructFromXML(xml:any):void {
		super.constructFromXML(xml);
		this.c1 = this.getController("c1");
		this.iconLoader = this.getChild("icon_loader") as GLoader;
	}

	public setData(data:any):void {
		this._data = data;
		let typeName:string = PanelTabType[data];
		this.iconLoader.load(URLManager.getModuleImgUrl("icon/" + ESpecialConditonType[typeName] + ".png",PackNameEnum.Activity));
		this.btnSelected = false;
		if(CacheManager.activity.checkShowEffect(data)) {
			if(!this.iconEffect) {
				this.iconEffect = UIMovieManager.get(PackNameEnum.MCHomeIcon);
				this.iconEffect.x = -25;
				this.iconEffect.y = -19;
				this.addChild(this.iconEffect);
			}
		}
		else if(this.iconEffect) {
			this.iconEffect.destroy();
			this.iconEffect = null;
		}

		if(this.iconEffect) {
			this.iconEffect.setPlaySettings(0,-1,-1);
		}
	}

	public set btnSelected(value:boolean) {
		this.c1.selectedIndex = value ? 1 : 0;
		// this.btn.selected = value;
	}

	public get hasTip():boolean {
		return this._hasTip;
	}

	public set hasTip(value:boolean) {
		this._hasTip = value;
	}

	public onShow():void {
		if(this.iconEffect) {
			this.iconEffect.destroy();
			this.iconEffect = null;
		}
		CacheManager.activity.isShowed[this._data] = true;
	}
}