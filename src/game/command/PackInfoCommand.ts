class PackInfoCommand implements ICommand {
	public constructor() {
	}

	public onMessage(data: any, msgId: number): void {
		let posType_I: number = data.posType_I;
		let packCache:PackBaseCache = CacheManager.pack.getPackCacheByPosType(posType_I);
		if(packCache) packCache.setSbag(data);
		if (posType_I == EPlayerItemPosType.EPlayerItemPosTypeBag) {//基本背包
			// CacheManager.pack.backPackCache.setSbag(data)
			EventManager.dispatch(NetEventEnum.packPosTypeBagChange)
		} else if (posType_I == EPlayerItemPosType.EPlayerItemPosTypeWarehouse) {//仓库
			// CacheManager.pack.warePackCache.setSbag(data)
			EventManager.dispatch(NetEventEnum.packPosTypeWarehouseChange)
		} else if (posType_I == EPlayerItemPosType.EPlayerItemPosTypeRole) {//角色背包，穿上的装备等
			// CacheManager.pack.rolePackCache.setSbag(data)
			EventManager.dispatch(NetEventEnum.packPosTypeRoleChange)
		} else if (posType_I == EPlayerItemPosType.EPlayerItemPosTypeLottery) {//神秘宝藏（寻宝）
			// CacheManager.pack.lotteryEquipPack.setSbag(data)
			EventManager.dispatch(NetEventEnum.packPosTypeLotteryChange);
		} 
		else if(posType_I == EPlayerItemPosType.EPlayerItemPosTypeLotteryRune) {//战纹寻宝背包
			EventManager.dispatch(NetEventEnum.packPosTypeLotteryRuneChange);
		}
		else if(posType_I == EPlayerItemPosType.EPlayerItemPosTypeLotteryAncient) {//混元寻宝背包
			EventManager.dispatch(NetEventEnum.packPosTypeLotteryAncientChange);
		}
		else if (posType_I == EPlayerItemPosType.EPlayerItemPosTypeDelegate) {//副本委托背包
			// CacheManager.pack.delegatePackCache.setSbag(data)
			EventManager.dispatch(NetEventEnum.packPosTypeDelegateChange)
		} else if (posType_I == EPlayerItemPosType.EPlayerItemPosTypeRune) {//符文背包
			// CacheManager.pack.runePackCache.setSbag(data)
			EventManager.dispatch(NetEventEnum.packPosTypeRuneChange)
		} else if (posType_I == EPlayerItemPosType.EPlayerItemPosTypeShapeEquip) {//外形装备背包
			// CacheManager.pack.shapeEquipPackCache.setSbag(data)
			EventManager.dispatch(NetEventEnum.packPosTypeShapeEquipChange)
		} else if (posType_I == EPlayerItemPosType.EPlayerItemPosTypeSoul) {//灵魂背包
			// CacheManager.pack.soulPackCache.setSbag(data)
			EventManager.dispatch(NetEventEnum.packPosTypeSoulChange)
		} else if (posType_I == EPlayerItemPosType.EPlayerItemPosTypeBeast) {//神兽背包
			// CacheManager.pack.beastPackCache.setSbag(data)
			EventManager.dispatch(NetEventEnum.packPosTypeBeastChange)
		} else if (posType_I == EPlayerItemPosType.EPlayerItemPosTypeProp) {//道具背包
			// CacheManager.pack.propCache.setSbag(data)
			EventManager.dispatch(NetEventEnum.packPosTypePropChange);
		}
	}
}