class DefendCopyModelItem extends CopyModeBaseItem {
	private list_star: List;

	private txt_level: fairygui.GTextField;
	private loader_name: GLoader;
	private loader_model: GLoader;
	private img_lock: fairygui.GImage;
	private recordCode:number;
	public constructor() {
		super();
	}

	protected constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.list_star = new List(this.panel.getChild("list_star").asList);
		this.txt_level = this.panel.getChild("txt_level").asTextField;
		this.loader_name = <GLoader>this.panel.getChild("loader_2").asLoader;
		this.loader_model = <GLoader>this.panel.getChild("loader_1").asLoader;
		this.img_lock = this.panel.getChild("img_lock").asImage;

	}

	public setData(data: any, index: number): void {		
		this.itemIndex = index;
		var loadIdx: number = this.itemIndex + 1;
		this.loader_model.load(URLManager.getPackResUrl(PackNameEnum.Copy, "CopyModel_" + loadIdx));
		this.loader_name.load(URLManager.getPackResUrl(PackNameEnum.Copy, "CopyModelName_" + loadIdx));
		this.recordCode = CopyUtils.getRecordCode(data);	
		super.setData(data,index);
		this.updateStarList();
	}

	protected setOpenStatu(): void {
		this._isOpen = false;
		if (!CopyUtils.isLvOk(this._data)) {

			this.txt_level.text = this._data.enterMinLevel + "级开启";

		} else if (!CopyUtils.isPreCopyStarOk(this._data,this.recordCode)) {

			this.txt_level.text = "三星通关" + CopyUtils.getModelName(CopyUtils.getPreCopyInf(this._data)) + "模式解锁";

		} else if (CopyUtils.isRelateCopyOpen(this._data,this.recordCode)) {
			this.txt_level.text = "已开启";
			this._isOpen = true;
		}
		this.img_lock.visible = !this._isOpen;
		if (!this._isOpen) {
			this.loader_model.filters = EFilters.GRAYS;
			this.loader_name.filters = EFilters.GRAYS;
			this.txt_level.filters = EFilters.GRAYS;
		} else {
			this.loader_model.filters = null;
			this.loader_name.filters = null;
			this.txt_level.filters = null;
		}
	}

	private updateStarList(): void {			
		var star: number = CacheManager.copy.getCopyStar(this.recordCode, this._data.code);
		var data: any[] = [];
		for (var i: number = 0; i < CopyCache.COPY_MAX_STAR; i++) {
			data.push({ isOpen: star >= (i + 1) });
		}
		this.list_star.data = data;
	}

}