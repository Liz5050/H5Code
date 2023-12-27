class TitleItemView extends ListRenderer {
    private c1:fairygui.Controller;
	private c2:fairygui.Controller;
    private timeTxt:fairygui.GRichTextField;
    private wearBtn: fairygui.GButton;
	private unloadBtn: fairygui.GButton;
	private btn_switch:fairygui.GButton;
	private titleProperty:TitlePropertyItemView;
	private mcTitle:MovieClip;
	private mcContainer:fairygui.GComponent;
	public constructor() {
		super();
	}

	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
        this.c1 = this.getController("c1");
		this.c2 = this.getController("c2");
        this.timeTxt = this.getChild("txt_time").asRichTextField;

        this.wearBtn = this.getChild("btn_wear").asButton;
		this.unloadBtn = this.getChild("btn_unload").asButton;
        this.btn_switch = this.getChild("btn_switch").asButton;

		this.titleProperty = this.getChild("title_property") as TitlePropertyItemView;
		this.mcContainer = this.getChild("title_container").asCom;
		this.mcTitle = new MovieClip();
		(this.mcContainer.displayObject as egret.DisplayObjectContainer).addChild(this.mcTitle);

		this.wearBtn.addClickListener(this.onWearTitleHandler,this);
		this.unloadBtn.addClickListener(this.onUnloadTitleHandler,this);
		// this.btn_switch.addClickListener(this.onSwitchProperty,this);
		this.getChild("touch_area").asGraph.addClickListener(this.onSwitchProperty,this);
	}

	public setData(data:any):void {		
		this._data = data;
		this.titleProperty.setData(data);
		if(CacheManager.title.isShowProperty(data.code)) {
			this.height = 510;
			this.c1.selectedIndex = 1;
			this.btn_switch.selected = true;
		}
		else {
			this.height = 148;
			this.c1.selectedIndex = 0;
			this.btn_switch.selected = false;
		}
		this.mcTitle.playFile(ResourcePathUtils.getRPGGame() + "title/" + data.icon,-1, ELoaderPriority.UI_EFFECT);
		this.updateTitleState();
	}

	private updateTitleState():void {
		if (CacheManager.title.isActive(this._data.code)) {
			if (CacheManager.title.isInUse(this._data.code,CacheManager.title.operationIndex)) {
				//激活已穿戴
				this.c2.selectedIndex = 2;
			}
			else {
				//激活未穿戴
				if(CacheManager.title.getUseTitle(CacheManager.title.operationIndex)) {
					//已穿戴其他称号
					this.wearBtn.title = "更  换";
				}
				else {
					this.wearBtn.title = "穿  戴";
				}
				this.c2.selectedIndex = 1;
			}
			if(this._data.existTime) {
				let title: any = CacheManager.title.getActiveTitle(this._data.code);
				if(title) {
					// let leftTime:number = title.endDt_DT - CacheManager.serverTime.getServerTime();
					this.timeTxt.text = "有效期至：" + HtmlUtil.html(App.DateUtils.formatDate(title.endDt_DT, DateUtils.FORMAT_Y_M_D_HH_MM_SS),Color.Green2)
				}
			}
			else {
				this.timeTxt.text = HtmlUtil.html("永久",Color.Green2);
				
			}
		}
		else {
			//未激活
			this.c2.selectedIndex = 0;
			this.timeTxt.text = "";
			// if (this._data.existTime && this._data.existTime > 0) {
				
			// 	this.timeTxt.text = "有效期：" + HtmlUtil.html(this._data.existTime + "天",Color.Green2);//App.DateUtils.getFormatBySecond(this._data.existTime * 60 * 60, 8);
			// }
			// else {
			// 	this.timeTxt.text = HtmlUtil.html("永久",Color.Green2);
			// }
		}
	}	

	private onSwitchProperty():void {
		this.btn_switch.selected = !this.btn_switch.selected;
		CacheManager.title.addShowProperty(this._data.code,this.btn_switch.selected);
		(this.parent as fairygui.GList).refreshVirtualList();
	}

	public selectedItem(value:boolean):void {
		if(this.btn_switch.selected == value) {
			return;
		}
		this.btn_switch.selected = value;
		CacheManager.title.addShowProperty(this._data.code,this.btn_switch.selected);
	}

	/**佩戴称号 */
	private onWearTitleHandler():void {
		EventManager.dispatch(LocalEventEnum.TitleUse,this._data.code);
	}

	/**卸下称号 */
	private onUnloadTitleHandler():void {
		EventManager.dispatch(LocalEventEnum.TitleUnload);
	}
}