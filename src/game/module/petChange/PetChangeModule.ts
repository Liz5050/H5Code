/**
 * 宠物幻形
 */

class PetChangeModule extends BaseTabModule{

	public constructor() {
		super(ModuleEnum.PetChange, PackNameEnum.PetChange);
	}

	public initOptUI():void{
		super.initOptUI();
		this.className = {
			[PanelTabType.PetChange]:["PetChangePanel",PetChangePanel],
		};
		this.tabBtnList.list.visible = false;
		this.descBtn.visible = true;
	}

	public updateAll():void{
		this.heightController.selectedIndex = 1;
	}

	public clickDesc(): void {
		let desc: string = "1、使用<font color='#09c73d'>宠物进阶丹</font>可以提升宠物星数，每满10星可以提升到下一阶。\n" +  
			"2、宠物激活即可开启<font color='#09c73d'>百步穿杨</font>天赋，可跟随玩家进行作战。\n" +  
			"3、提升宠物等阶可以提升宠物的属性，解锁<font color='#09c73d'>坚壁、生机、锋芒、巨熊</font>等四个技能，提升战力，增强战场统治力。\n" +  
			"4、不同等级的宠物可以使用不同数量的<font color='#09c73d'>宠物潜能丹</font>和<font color='#09c73d'>宠物飞升丹</font>，飞速提升宠物的属性。\n" +  
			"5、宠物可穿戴<font color='#09c73d'>灵簪、灵佩、灵冠、灵珠</font>四种装备，为宠物穿戴装备可以大幅提升宠物的战力；宠物装备无穿戴等级限制，可以在<font color='#09c73d'>背包-合成</font>页面升级成更高品阶的宠物装备。\n" +  
			"6、在幻形界面可以<font color='#09c73d'>幻化</font>宠物的外形，获得额外的属性和战力；使用宠物进阶丹同样可以提升宠物幻形的等阶，解锁<font color='#09c73d'>技能</font>，助你掌控战场节奏。\n" +  
			"7、多个宠物幻形的天赋激活后可<font color='#09c73d'>同时生效</font>，无需幻化，幻化只是改变宠物的外观";
        EventManager.dispatch(UIEventEnum.BossExplainShow,{desc:desc}); 
	}

	/**更新宠物幻形界面 */
    public updatePetChangePanel():void{
        if(this.curPanel instanceof PetChangePanel){
           this.curPanel.updatePanel();
        }
    }
    
    /**更新宠物幻形界面（祝福值更新） */
    public petChangeUpgrade(data: any):void{
        if(this.curPanel instanceof PetChangePanel){
           this.curPanel.onSuccess(data);
        }
    }

	/**
	 * 幻化成功
	 */
	public onChangeModelSuccess(): void {
		if(this.curPanel instanceof PetChangePanel) {
			this.curPanel.updateChangeList();
			this.curPanel.updateModel();
		}
	}

	/**
	 * 道具改版
	 */
	public onPropPackChange(): void {
		if(this.curPanel instanceof PetChangePanel) {
			this.curPanel.updateProp();
			this.curPanel.refreshChangeList();
		}
	}
}