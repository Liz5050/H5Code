class StrongerUtil {
	private static strongerDatas: Array<any>;

	public constructor() {
	}

	public static checkTip(): boolean{
		let isOpen:boolean = ConfigManager.mgOpen.isOpenedByKey(MgOpenEnum.Stronger,false);
		if(isOpen){
			this.strongerDatas = ConfigManager.mgStronger.getData();
			for(let data of this.strongerDatas){
				if(StrongerUtil.isBtnTip(data)){
					return true;
				}
			}
		}
		return false;
	}

	public static isBtnTip(data: any): boolean{
		this.strongerDatas = ConfigManager.mgStronger.getData();
		switch(data.name){
			case this.strongerDatas[0].name:
				return CacheManager.player.isRealmTips();//境界提升
			case this.strongerDatas[1].name:
				return ShapeUtils.checkTips(MgOpenEnum.Wing, EShape.EShapeWing);//翅膀升级
			case this.strongerDatas[2].name:
				return ShapeUtils.checkTips(MgOpenEnum.Spirit, EShape.EShapeSpirit);//法宝升级
			case this.strongerDatas[3].name:
				return ShapeUtils.checkTips(MgOpenEnum.Magic, EShape.EShapeMagic);//神兵升级
			case this.strongerDatas[4].name:
				return CacheManager.player.isHasShapeTips();//外形幻化
			case this.strongerDatas[5].name:
				return CacheManager.refine.checkStrengthen();//装备强化
			case this.strongerDatas[6].name:
				return CacheManager.refine.checkInlayTip();//宝石镶嵌
			// case this.strongerDatas[7].name:
			// 	return CacheManager.petMountPet.checkUpgrade();//宠物进阶
			// case this.strongerDatas[8].name:
			// 	return CacheManager.mount.checkUpgrade();//坐骑进阶
			// case this.strongerDatas[9].name:
			// 	return CacheManager.petMountPet.checkSwallow();//宠物吞噬
			case this.strongerDatas[10].name:
				return CacheManager.rune.checkInlay();//符文镶嵌
			case this.strongerDatas[11].name:
				return CacheManager.rune.checkUpgrade();//符文升级
			case this.strongerDatas[12].name:
				return CacheManager.guild.isCanLevelUpVien;//仙盟心法
			case this.strongerDatas[13].name:
				return CacheManager.pack.backPackCache.isHasBetterEquip;//替换装备
			case this.strongerDatas[14].name:
				return false;//灵魂升级
		}
		return false;
	}
}