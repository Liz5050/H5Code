/**
 * 变强窗口
 */

class StrongerWindow extends BaseWindow{
	private buttonList: fairygui.GList;
	private strongerDatas: Array<any>;

	public constructor() {
		super(PackNameEnum.Home, "Stronger");
	}

	public initOptUI(): void{
		this.buttonList = this.getGObject("list_button").asList;
		this.strongerDatas = ConfigManager.mgStronger.getData();
	}

	public updateAll(): void{
		this.updateList();
		//true可替换装备
		let isHasBetterEquip:boolean = CacheManager.pack.backPackCache.isHasBetterEquip;
	}

	private updateList(): void{
		this.buttonList.removeChildrenToPool();
		for(let data of this.strongerDatas){
			if(StrongerUtil.isBtnTip(data)){
				let button: fairygui.GButton = this.buttonList.addItemFromPool().asButton;
				button.title = data.name;
				button.addClickListener(this.clickButton, this);
			}
		}
	}

	private clickButton(e: any): void{
		let button: fairygui.GButton = e.target.asButton;
		switch(button.title){
			case this.strongerDatas[0].name:
				// EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Player);
				EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Realm);//境界提升
				break;
			case this.strongerDatas[1].name:
				EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Player, {"tabIndex": 1});//翅膀升级
				break;
			case this.strongerDatas[2].name:
				EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Player, {"tabIndex": 2});//法宝升级
				break;
			case this.strongerDatas[3].name:
				EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Player, {"tabIndex": 3});//神兵升级
				break;
			// case this.strongerDatas[4].name:
			// 	EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.ShapeChange, {"tabIndex": 0});//外形幻化
			// 	break;
			case this.strongerDatas[5].name:
				EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Refine, {"tabIndex": 0});//装备强化
				break;
			case this.strongerDatas[6].name:
				EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Refine, {"tabIndex": 1});//宝石镶嵌
				break;
			// case this.strongerDatas[7].name:
			// 	EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.PetMount, {"tabIndex": 0});//宠物进阶
			// 	break;
			// case this.strongerDatas[8].name:
			// 	EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.PetMount, {"tabIndex": 1});//坐骑进阶
			// 	break;
			// case this.strongerDatas[9].name:
			// 	EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.PetMount, {"tabIndex": 0});//宠物吞噬
			// 	break;
			case this.strongerDatas[10].name:
				EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Rune, {"tabIndex": 0});//符文镶嵌
				break;
			case this.strongerDatas[11].name:
				EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Rune, {"tabIndex": 0});//符文升级
				break;
			case this.strongerDatas[12].name:
				EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Guild, {"tabIndex": 2});//仙盟心法
				break;
			case this.strongerDatas[13].name:
				EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Pack, {"tabIndex": 0});//替换装备
				break;
			case this.strongerDatas[14].name:
				// EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Refine, {"tabIndex": 1});//灵魂升级
				break;
		}
		this.hide();
	}
}