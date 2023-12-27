class TeamTargetChangePanel extends BaseTabPanel
{
	private sureBtn:fairygui.GButton;
	private targetList:List;
	private minSlider:Slider;
	private maxSlider:Slider;
	private curIndex:number = -1;
	public initOptUI():void
	{
		this.sureBtn = this.getGObject("btn_sure").asButton;
		this.sureBtn.addClickListener(this.onSureClickHandler,this);

		this.targetList = new List(this.getGObject("list_target").asList);
		this.targetList.list.addEventListener(fairygui.ItemEvent.CLICK, this.onSelectItem, this);
		this.minSlider = this.getGObject("slider_minLv") as Slider;
		this.maxSlider = this.getGObject("slider_maxLv") as Slider;

		this.minSlider.setChangeFun(this.onMinChange,this);
		this.maxSlider.setChangeFun(this.onMaxChange,this);
	}

	public updateAll()
	{
		let _targets:any[] = CacheManager.team.targets;
		this.targetList.data = _targets;
		this.targetList.scrollToView(0);
		let _teamTarget:any = CacheManager.team.teamTarget;
		this.curIndex = -1;
		let _index:number = 0;
		if(_teamTarget.type == EGroupTargetType.EGroupTargetNormal)
		{
			_index = 1;
		}
		else
		{
			_index = CacheManager.team.getCurTargetIndex();
		}
		this.setIndex(_index);
	}

	public selectByCopyCode(code:number):void{
		this.updateAll();
		let _targets:any[] = CacheManager.team.targets;
		var len:number = _targets.length;
		var idx:number = 0;
		for(var i:number = 0;i<len; i++){
			if(_targets[i].targetValue==code){
				idx = i;
				break;
			}
		}
		if(idx){
			this.setIndex(idx);
			this.changeTarHandler(false);
		}

	}	

	
	private onSelectItem(e: fairygui.ItemEvent):void
	{
		// let _item: TargetBtnItem = <TargetBtnItem>e.itemObject;
		// let _itemData:any = _item.getData();
		this.setIndex(this.targetList.selectedIndex);
	}

	private setIndex(index:number):void
	{
		if(this.curIndex == index) return;
		this.curIndex = index;
		if(this.targetList.selectedIndex != index)
		{
			this.targetList.selectedIndex = index;
		}
		this.updateSliderValue();
	}

	private updateSliderValue():void
	{
		let _selectData:any = this.targetList.selectedData;
		let _maxLv:number = ConfigManager.exp.configLength;
		if(_selectData)
		{
			this.minSlider.max = this.maxSlider.max = Math.min(_selectData.enterMaxLevel,_maxLv);
			this.minSlider.min = this.maxSlider.min = _selectData.enterMinLevel;

			this.minSlider.cusValue = _selectData.enterMinLevel;
			this.maxSlider.cusValue = Math.min(_selectData.enterMaxLevel,_maxLv);
		}
		else
		{
			this.minSlider.max = this.maxSlider.max = _maxLv;
			this.minSlider.min = this.maxSlider.min = 1;
			this.minSlider.cusValue = this.maxSlider.cusValue = 1;
		}
	}

	private onMinChange():void
	{
		this.minSlider.title = CacheManager.team.getLevelStr(this.minSlider.cusValue);
	}

	private onMaxChange():void
	{
		this.maxSlider.title = CacheManager.team.getLevelStr(this.maxSlider.cusValue);
	}

	private onSureClickHandler():void
	{
		this.changeTarHandler(true);
	}

	private changeTarHandler(isUpdate:boolean):void{
		let _targetCfg:any = this.targetList.selectedData;
		let _type:EGroupTargetType = _targetCfg.type;
		let _value:number = _targetCfg.targetValue;
		EventManager.dispatch(LocalEventEnum.TeamTargetChange, _type,_value,this.minSlider.cusValue,this.maxSlider.cusValue,isUpdate);
	}
}