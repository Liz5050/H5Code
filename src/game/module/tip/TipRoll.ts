/**
 * 滚动Tip
 */
class TipRoll {
	/**
	 * 单次移动y轴矩离 
	 */
	private static FLY_HEIGHT: number = 80;
	/**
	 * 消息显示项高度  
	 */
	private static ITEM_HEIGHT: number = 43;
	/**
	 * 最大显示条数
	 */
	private static MAX_SHOW_ITEM_COUNT:number = 5;
	private static FLYING_ITEM_LIST: TipRollItem[] = [];
	public constructor() {
	}

	public show(message:string):void {
		if (message == "" || message == null) {
			return;
		}
		let item:TipRollItem = TipRollItem.getItem();
		if(item) {
			item.setText(message);
			this.flyMsgItem(item);
		}
	}

	private flyMsgItem(item: TipRollItem) {
		item.x = (fairygui.GRoot.inst.width - item.width) / 2;
		item.y = fairygui.GRoot.inst.height - 355;
		item.alpha = 0.1;

		let endPosY = item.y - TipRoll.FLY_HEIGHT;
		item.firstFlyPosY = endPosY;
		item.lastFlyPosY = item.y - (TipRoll.FLY_HEIGHT + ((TipRoll.MAX_SHOW_ITEM_COUNT - 1) * TipRoll.ITEM_HEIGHT));
		LayerManager.UI_Popup.addChild(item);

		TipRoll.FLYING_ITEM_LIST.unshift(item);
		egret.Tween.get(item).to({ alpha: 1, y: endPosY }, 300).call(this.onKeepShow, this, [item]);

		for (let i:number = TipRoll.FLYING_ITEM_LIST.length - 1; i >= 0; i--) {
			let lastItem = TipRoll.FLYING_ITEM_LIST[i];
			egret.Tween.removeTweens(lastItem);
			endPosY = lastItem.firstFlyPosY - i * TipRoll.ITEM_HEIGHT;
			if (endPosY < lastItem.lastFlyPosY) {
				this.onRemoveOverflowItem(lastItem);
				continue;
			}
			egret.Tween.get(lastItem).to({ alpha: 1, y: endPosY }, 300).call(this.onKeepShow, this, [lastItem]);
		}
	}

	/**
	 * 停留时间 
	 * 
	 */
	private onKeepShow(item: TipRollItem) {
		egret.Tween.get(item).wait(1000).call(this.onRemoveOverflowItem, this, [item]);
	}

	// /**
	//  * 滚动缓动显示结束
	//  * */
	// private onCompleteFunction(item: TipRollItem) {
	// 	egret.Tween.get(item).wait(delay).call(this.onRemoveOverflowItem, this, [item]);
	// }
	/**
	 * 移出溢出项
	 * */
	private onRemoveOverflowItem(item: TipRollItem) {
		egret.Tween.removeTweens(item);
		TipRoll.FLYING_ITEM_LIST.splice(TipRoll.FLYING_ITEM_LIST.indexOf(item), 1);
		egret.Tween.get(item).to({ alpha: 0, y: item.y - TipRoll.ITEM_HEIGHT}, 300).call(item.resetItem);
	}
}