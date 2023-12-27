class BossSetItem extends ListRenderer {
	private controller:fairygui.Controller;
	private controller2:fairygui.Controller;
	private nameTxt:fairygui.GTextField;
	private levelTxt:fairygui.GTextField;
	private followBtn:fairygui.GButton;
	private txt_limit:fairygui.GTextField;
	public constructor() {
		super();
	}

	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
		this.controller = this.getController("c1");
		this.controller2 = this.getController("c2");
		this.nameTxt = this.getChild("txt_name").asTextField;
		this.levelTxt = this.getChild("txt_level").asTextField;
		this.txt_limit = this.getChild("txt_limit").asTextField;
		this.followBtn = this.getChild("btn_check").asButton;
		this.followBtn.addClickListener(this.onClickHandler,this);
		// this.getChild("touch_area").asGraph.addClickListener(this.onClickHandler,this);
		// this.followBtn.addEventListener(fairygui.StateChangeEvent.CHANGED,this.onChangeHandler,this);
	}

	public setData(data:any,index:number):void {		
		this._data = data;
		this.controller.selectedIndex = index % 2;
		let bossCode:number = data.bossCode;
        let bossConfig:any = ConfigManager.boss.getByPk(bossCode);
		let isOpen:boolean = CacheManager.bossNew.getBossIsOpened(bossCode);
		this.nameTxt.text = bossConfig.name;

		let followSets:string[] = CacheManager.sysSet.getValue(LocalEventEnum.BossFollow);
		this.followBtn.selected = followSets.indexOf(this._data.bossCode) != -1 && isOpen;

		this.controller2.selectedIndex = isOpen ? 0 : 1;
		let gameBoss:any = ConfigManager.mgGameBoss.getByPk(bossCode);
		if(gameBoss && gameBoss.roleState) {
            //转生等级限制
            // this.txt_limit.text = gameBoss.roleState + "转开启";
			let maxRoleState:number = gameBoss.maxRoleState;
			if(gameBoss.maxRoleState > 0) {
				this.levelTxt.text = gameBoss.roleState + "转-" + gameBoss.maxRoleState + "转";
			}
			else {
				this.levelTxt.text = gameBoss.roleState + "转";
			}
        }
        else {
            // this.txt_limit.text = bossConfig.level + "级开启";
			this.levelTxt.text = "Lv." + bossConfig.level;
        }
		if(!isOpen) {
			let needVip:number = gameBoss.freeVip > 0 ? gameBoss.freeVip : 0;
			if(CacheManager.vip.vipLevel >= needVip) {
				this.txt_limit.text = "未满足挑战等级";
			}
			else {
				this.txt_limit.text = "未满足VIP等级";
			}
		}
	}

	private onClickHandler():void {
		// this.followBtn.selected = !this.followBtn.selected;
		this.onChangeFollow();
	}

	private onChangeFollow():void {
		let followSets:string[] = CacheManager.sysSet.getValue(LocalEventEnum.BossFollow);
		let setList:string[] = CacheManager.sysSet.getValue(LocalEventEnum.BossSetList);
		if(!setList) {
			setList = [];
		}
		if(setList.indexOf(this._data.bossCode) == -1) {
			setList.push(this._data.bossCode);
			CacheManager.sysSet.setValue(LocalEventEnum.BossSetList,setList,false);
		}
		let index:number = followSets.indexOf(this._data.bossCode);
		if(this.followBtn.selected) {
			if(index == -1) {
				followSets.push(this._data.bossCode);
			}
		}
		else {
			if(index != -1) {
				followSets.splice(index,1);
			}
		}
		CacheManager.sysSet.setValue(LocalEventEnum.BossFollow,followSets,false);
		CacheManager.bossNew.setFollowBoss(this._data.bossCode,this.followBtn.selected);
		// CacheManager.sysSet.setValue("WorldBossFollow_" + this._data.bossCode,bossSet,false);
		// CacheManager.bossNew.setFollowBoss(this._data.bossCode,this.followBtn.selected);
	}
}