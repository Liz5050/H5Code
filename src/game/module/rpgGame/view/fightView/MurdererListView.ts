class MurdererListView extends fairygui.GComponent {
	private list_murderer:List;
	public constructor() {
		super();
	}

	protected constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.list_murderer = new List(this.getChild("list_murderer").asList);
		this.list_murderer.list.addEventListener(fairygui.ItemEvent.CLICK,this.onItemClickHandler,this);
	}

	public updateList(murderers:EntityInfo[] = []):void {
		this.list_murderer.setVirtual(murderers);
	}

	private onItemClickHandler():void {
		let index:number = this.list_murderer.list.itemIndexToChildIndex(this.list_murderer.selectedIndex);
		let item:RpgFightPlayerItem = this.list_murderer.list.getChildAt(index) as RpgFightPlayerItem;
		let entity:RpgGameObject = item.getTarget();
		if(!entity || entity.isDead()) {	
			CacheManager.bossNew.battleObj = null;
			Tip.showTip(LangFight.LANG7);
			return;
		}
		if(entity != CacheManager.bossNew.battleObj) {
			CacheManager.king.stopKingEntity(true);
		}
		CacheManager.bossNew.battleObj = entity;
		CacheManager.battle.isNearAttack = false;
	}
}