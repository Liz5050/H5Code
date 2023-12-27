class PackItemUpdateCommand implements ICommand {
	private changedPacks: any;
	private changedPacksPoses: any;
	private changedItems: Array<any>;
	private updateCode: number;
	private flyItemDatas: Array<ItemData>;

	public constructor() {

	}

	/**
	 * @param data SSeqPlayerItemUpdate
	 */
	public onMessage(data: any, msgId: number): void {
		this.flyItemDatas = null;
		this.updateCode = data.code_I;
		if (ConfigManager.updateCode.isShow(this.updateCode)) {
			this.flyItemDatas = [];
		}
		this.changedPacks = {};
		this.changedPacksPoses = {};
		this.changedItems = data.playerItemUpdates.data;
		let itemCodes:number[] = [];
		let isAddItem:boolean = false;//是否是增加物品
		for (let splayerItemUpdate of this.changedItems) {
			
			let fromPosType: number = splayerItemUpdate.fromPosType_I;
			let toPosType: number = splayerItemUpdate.playerItem.posType_I;
			if(splayerItemUpdate.updateAmount_I > 0) {
				itemCodes.push(splayerItemUpdate.playerItem.itemCode_I);
			}

			let packCache: PackBaseCache = CacheManager.pack.getPackCacheByPosType(toPosType);
			if (packCache) {
				let updateType: number = splayerItemUpdate.updateType_I;
				let itemData: ItemData = new ItemData(splayerItemUpdate.playerItem);
				let posIndex: number = splayerItemUpdate.posIndex_I;
				let addAmount: number = itemData.getItemAmount();
				// packCache.addItemIndex(splayerItemUpdate);
				if (updateType == 1) {//add
					let isAddEquip:boolean = false;
					this.changedPacks[toPosType] = posIndex;
					if (!this.changedPacksPoses[toPosType]) {
						this.changedPacksPoses[toPosType] = [];
					}
					if (ItemsUtil.isTaskItem(itemData)) {
						if (packCache.updateItemAtIndex(posIndex, itemData)) {
							this.changedPacksPoses[toPosType].push(posIndex);
							EventManager.dispatch(NetEventEnum.packBackTaskItemChange, itemData);
						}
					}
					if (packCache.addItemToIndex(posIndex, itemData)) {
						this.changedPacksPoses[toPosType].push(posIndex);
					}
					if (toPosType != EPlayerItemPosType.EPlayerItemPosTypeLottery) {
						EventManager.dispatch(NetEventEnum.packBackAddItem, itemData, addAmount, this.updateCode);
						this.dispatchQuickUse(itemData,toPosType,this.updateCode);											
					}
					//处理飘物品
					if (this.flyItemDatas != null) {
						if (toPosType == EPlayerItemPosType.EPlayerItemPosTypeBag ||
							toPosType == EPlayerItemPosType.EPlayerItemPosTypeBeast ||
							toPosType == EPlayerItemPosType.EPlayerItemPosTypeSoul) {
							this.flyItemDatas.push(itemData);
						}
					}
					//商店购买
					if (this.updateCode == 200) {
						// MoveMotionUtil.itemMoveToTop(itemData.getCode(), true, splayerItemUpdate.updateAmount_I);
					}		
					isAddEquip = EPlayerItemPosType.EPlayerItemPosTypeBag==toPosType && ItemsUtil.isEquipItem(itemData);
					if(isAddEquip && CacheManager.task.isNewPlayerStage){ //
						let dressPos: EDressPos = ItemsUtil.getEqiupPos(itemData);
						if(dressPos>-1 && CareerUtil.isCareerMatch(itemData.getCareer(),0)){
							let equiped: ItemData = CacheManager.pack.rolePackCache.getItemAtIndex(dressPos);
							if (WeaponUtil.getScoreBase(itemData) > WeaponUtil.getScoreBase(equiped) && this.updateCode != 1624) {
								EventManager.dispatch(LocalEventEnum.PackQuickUseEquip,itemData);
							}
						}						
					}		
					// 红装、或者守护神剑副本获得心法飘提示
					let isRedEquip:boolean = isAddEquip && ConfigManager.updateCode.isEquipTips(this.updateCode) && itemData.getColor()>=EColor.EColorRed;
					//let isHeart:boolean = CacheManager.copy.isInCopyByType(ECopyType.ECopyMgNormalDefense) && ItemsUtil.isHeartMethod(itemData);
					if(isRedEquip){
						EventManager.dispatch(LocalEventEnum.HomeShowReceiveItemTips,itemData);
					}
										
				} else if (updateType == 2) {//del
					if (ItemsUtil.isTaskItem(itemData)) {
						if (packCache.removeItemByUid(itemData.getUid())) {
							this.changedPacks[toPosType] = posIndex;
						}
					} else {
						if (packCache.removeItemAtIndex(posIndex)) {
							this.changedPacks[toPosType] = posIndex;
						}
					}
				} else if (updateType == 4) {//update
					if (ItemsUtil.isTaskItem(itemData)) {
						let addNum: number = packCache.updateItemAtIndex(posIndex, itemData);
						if (addNum > 0) {
							this.changedPacks[toPosType] = posIndex;
						}
						if (fromPosType == toPosType && addNum > 0) {
							EventManager.dispatch(NetEventEnum.packBackAddItem, itemData, addNum, this.updateCode);
							this.dispatchQuickUse(itemData,toPosType,this.updateCode);
											
						}
					} else {
						if (ItemsUtil.isEquipSpritItem(itemData)) {//守护特殊处理
							if (fromPosType == toPosType) {//续费引引起的更新
								let old: ItemData = packCache.getItemByUid(itemData.getUid());
								let oldTime: number = Math.floor(old.getItemExtInfo()["exist"]);
								let nowTime: number = Math.floor(new Date().getTime() / 1000);
								if (oldTime < nowTime) {
									oldTime = nowTime;
								}
								let addDay: number = Math.floor((itemData.getItemExtInfo()["exist"] - oldTime) / 86400);
								if (addDay > 0) {
									Tip.showTip(`${itemData.getName()}成功续期了${addDay}天`);
								}
								if (old.isExpire) {
									packCache.updateItemAtIndex(posIndex, itemData);
									if (CacheManager.pack.rolePackCache.getItemAtIndex(EDressPos.EDressPosSpirit) == null) {//未装备守护
										EventManager.dispatch(UIEventEnum.PackQuickUseItem, { "itemData": itemData, "isShowCountdown": true });
									}
								}
							}
						}
						let addNum: number = packCache.updateItemAtIndex(posIndex, itemData);
						this.changedPacks[toPosType] = posIndex;
						
						let isReplace: boolean = false;
						if (fromPosType == toPosType && addNum > 0) {
							EventManager.dispatch(NetEventEnum.packBackAddItem, itemData, addNum, this.updateCode);		
							this.dispatchQuickUse(itemData,toPosType,this.updateCode);
						}
						if (fromPosType != toPosType) {//物品从fromPosType移动到posType。需要从原背包中删除
							CacheManager.pack.getPackCacheByPosType(fromPosType).removeItemByUid(itemData.getUid());
							this.changedPacks[fromPosType] = true;
							let isUndress: boolean = (fromPosType == EPlayerItemPosType.EPlayerItemPosTypeRole && toPosType == EPlayerItemPosType.EPlayerItemPosTypeBag && this.changedItems.length == 1);
							isReplace = (fromPosType == EPlayerItemPosType.EPlayerItemPosTypeBag && toPosType == EPlayerItemPosType.EPlayerItemPosTypeRole && this.changedItems.length == 2);
							if (fromPosType == EPlayerItemPosType.EPlayerItemPosTypeBag && toPosType == EPlayerItemPosType.EPlayerItemPosTypeWarehouse) {
								Tip.showTip(`${itemData.getName(true)}存入仓库`);
							} else if (fromPosType == EPlayerItemPosType.EPlayerItemPosTypeWarehouse && toPosType == EPlayerItemPosType.EPlayerItemPosTypeBag) {
								Tip.showTip(`${itemData.getName(true)}取出成功`);
							} else if (isUndress || isReplace) {
								/*
								
								//先屏蔽快速使用装备
								if (ItemsUtil.isEquipSpritItem(itemData)) {
									if (isUndress) {
										EventManager.dispatch(UIEventEnum.PackQuickUseItem, { "itemData": itemData, "isShowCountdown": false });
									}
								} else {
									//仅仅脱装备或者替换装备后的穿装备，快速使用当前最高评分的装备
									let dressPos: EDressPos = ItemsUtil.getEqiupPos(itemData);
									let bestItemData: ItemData = CacheManager.pack.backPackCache.getBestScoreEquip(dressPos);
									if (!bestItemData.isExpire) {//已过期，如小鬼怪
										let equiped: ItemData = CacheManager.pack.rolePackCache.getItemAtIndex(dressPos);
										if (WeaponUtil.getScoreBase(bestItemData) > WeaponUtil.getScoreBase(equiped)) {
											EventManager.dispatch(UIEventEnum.PackQuickUseItem, { "itemData": bestItemData, "isShowCountdown": true });
										}
									}
								}
								
								*/

							}
							if(isReplace){
								EventManager.dispatch(LocalEventEnum.EquipReplaceRole,itemData);
							}

						}

						

						//处理飘物品
						if (addNum > 0 && this.flyItemDatas != null) {
							if (toPosType == EPlayerItemPosType.EPlayerItemPosTypeBag ||
								toPosType == EPlayerItemPosType.EPlayerItemPosTypeBeast ||
								toPosType == EPlayerItemPosType.EPlayerItemPosTypeSoul) {
								this.flyItemDatas.push(itemData);
							}
						}
					}

					//商店购买
					if (this.updateCode == 200) {
						// MoveMotionUtil.itemMoveToTop(itemData.getCode(), true, splayerItemUpdate.updateAmount_I);
					}
				}
			}
		}

		//基本背包变动过
		if (this.changedPacks[EPlayerItemPosType.EPlayerItemPosTypeBag] != null) {
			EventManager.dispatch(NetEventEnum.packBackPackItemsChange);
		}

		//人物背包变动过
		if (this.changedPacks[EPlayerItemPosType.EPlayerItemPosTypeRole] != null) {
			EventManager.dispatch(NetEventEnum.packRolePackItemsChange, this.changedPacks[EPlayerItemPosType.EPlayerItemPosTypeRole]);
		}

		//符文背包变动过
		if (this.changedPacks[EPlayerItemPosType.EPlayerItemPosTypeRune] != null) {
			EventManager.dispatch(NetEventEnum.packPosTypeRuneChange);
		}

		//道具背包变动过
		if (this.changedPacks[EPlayerItemPosType.EPlayerItemPosTypeProp] != null) {
			EventManager.dispatch(NetEventEnum.packPosTypePropChange);
		}

		//装备寻宝仓库更新
		if (this.changedPacks[EPlayerItemPosType.EPlayerItemPosTypeLottery] != null) {
			EventManager.dispatch(NetEventEnum.packPosTypeLotteryChange);
		}
		//战纹寻宝仓库更新
		if (this.changedPacks[EPlayerItemPosType.EPlayerItemPosTypeLotteryRune] != null) {
			EventManager.dispatch(NetEventEnum.packPosTypeLotteryRuneChange);
		}
		//混元寻宝仓库更新
		if (this.changedPacks[EPlayerItemPosType.EPlayerItemPosTypeLotteryAncient] != null) {
			EventManager.dispatch(NetEventEnum.packPosTypeLotteryAncientChange);
		}


		if (this.flyItemDatas != null && this.flyItemDatas.length > 0) {
			let flyToBagItemCodes: Array<number> = [];
			let flyToTopItemCodes: Array<number> = [];
			for (let itemData of this.flyItemDatas) {
				let itemCode: number = itemData.getCode();
				if (itemData.getCategory() == ECategory.ECategoryProp) {
					if (itemData.getType() == EProp.EPropCoinBind || itemData.getType() == EProp.EPropForShow) {
						flyToBagItemCodes.push(itemCode)
					}
				} else {
					if (itemData.getColor() <= EColor.EColorBlue) {
						//飘到背包
						flyToBagItemCodes.push(itemCode);
					} else {
						flyToTopItemCodes.push(itemCode);
						// MoveMotionUtil.itemMoveToTop(itemCode);
					}
				}

			}
			//飘到背包
			if(!ConfigManager.updateCode.isFromScene(this.updateCode)) {
				MoveMotionUtil.itemMoveToBag(flyToBagItemCodes, 100, LayerManager.UI_Tips);
			}

			// var par: fairygui.GComponent = ConfigManager.updateCode.isFromScene(this.updateCode) ? LayerManager.UI_Cultivate : LayerManager.UI_Tips;
			// MoveMotionUtil.itemMoveToBag(flyToBagItemCodes, 100, par);
		}
		if(itemCodes.length > 0) {
			EventManager.dispatch(LocalEventEnum.PackUpdateCode, this.updateCode,itemCodes);
		}
	}

	private dispatchQuickUse(itemData:ItemData,toPosType:number,updateCode:number):void{		
		if(toPosType != EPlayerItemPosType.EPlayerItemPosTypeRole && !ConfigManager.updateCode.isGodEquipCode(updateCode)){ //非角色背包更新 就发事件
			EventManager.dispatch(LocalEventEnum.PackGetItemTip,{item:itemData});
		}
	}
	

}