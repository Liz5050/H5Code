/**
 * 动效工具类
 */
class MoveMotionUtil {
	/**
	 * 创建曲线移动动效 lizhi 2018年4月12日11:27:23
	 * @param disObj 显示对象 fairygui.GObject类型暂时未测试过
	 * @param endX endY 结束点
	 * @param controllerPts曲线控制点 具体控制点效果请参阅贝塞尔曲线预览http://myst729.github.io/bezier-curve/
	 */
	public static curveMoveTo(disObj: egret.DisplayObject | fairygui.GObject, endX: number, endY: number, controllerPts: number[], callBack: Function = null, caller: any = null, time: number = 1000): void {
		let _startTime: number = egret.getTimer();
		let _startX: number = disObj.x;
		let _startY: number = disObj.y;
		// let _endPt: egret.Point = new egret.Point(endX, endY);
		// let _startPt: egret.Point = new egret.Point(_startX, _startY);

		if (disObj.alpha != 1) {
			egret.Tween.get(disObj).to({ alpha: 1 }, Math.round(time / 3));
		}
		// egret.Tween.get(disObj, { onChange: onChange, onChangeObj: this }).to({ scaleX: 0.8, scaleY: 0.8 }, time).call(callBack, caller);
		egret.Tween.get(disObj, { onChange: onChange, onChangeObj: this }).wait(time).call(callBack, caller);

		function onChange() {
			let _curTime: number = egret.getTimer() - _startTime;
			let _pt: number[] = App.MathUtils.getBezierCurve(_startX, _startY,endX,endY, _curTime, time,controllerPts);
			//App.MathUtils.getBezierCurve(_startPt, _endPt, controllerPts, _curTime, time);
			if (_pt) {
				disObj.x = _pt[0];//_pt.x;
				disObj.y = _pt[1];//_pt.y;
			}
		}
	}

	/**
	 * 获得道具飞向背包
	 * @param itemCode 道具code
	 * @param delayTime 延迟时间
	 */
	private static waitList: number[] = [];
	private static waitListPosX:number[] = [];
	private static waitListPosY:number[] = [];
	private static isStart: boolean = false;
	public static itemMoveToBag(itemCodes: number[], delayTime: number = 100, parent: fairygui.GComponent = LayerManager.UI_Cultivate,startX?:number,startY?:number): void {
		if (!ControllerManager.home.isShow) {
			return;
		}

		if (MoveMotionUtil.isStart) {
			MoveMotionUtil.waitList = MoveMotionUtil.waitList.concat(itemCodes);
			if(startX && startY) {
				MoveMotionUtil.waitListPosX.push(startX);
				MoveMotionUtil.waitListPosY.push(startY);
			}
			return;
		}
		MoveMotionUtil.isStart = true;
		MoveMotionUtil.waitList = MoveMotionUtil.waitList.concat(itemCodes);
		if(startX && startY) {
			MoveMotionUtil.waitListPosX.push(startX);
			MoveMotionUtil.waitListPosY.push(startY);
		}
		MoveMotionUtil.startMove(delayTime, parent,startX,startY);
	}

    /**
	 * 通用表现：道具列表飘背包
     * @param {BaseItem[]} itemList
     * @param {number} delayTime
     * @param {fairygui.GComponent} parent
     */
	public static itemListMoveToBag(itemList:any[], delayTime: number = 0, parent: fairygui.GComponent = LayerManager.UI_Cultivate):void {
        let point: egret.Point;
        let baseItem: BaseItem;
        for (let item of itemList) {
            baseItem = item as BaseItem;
            point = baseItem.localToGlobal(0, 0, RpgGameUtils.point);
            MoveMotionUtil.itemMoveToBag([baseItem.itemData.getCode()], delayTime, parent, point.x, point.y);
        }
	}

	public static itemMoveToTop(itemCode: number, isBuy: boolean = false, addNum: number = 1): void {
		let itemData: ItemData = new ItemData(itemCode);
		let itemInfo: any = ConfigManager.item.getByPk(itemCode);
		if (!ItemsUtil.isTrueItemData(itemData)) {
			return;
		}
		let comp: fairygui.GComponent = FuiUtil.createComponent(PackNameEnum.Home, "ItemFlyComp");
		if (comp == null) {
			return;
		}
		let buyController: fairygui.Controller = comp.getController("c1");
		let itemTxt: fairygui.GRichTextField = comp.getChild("txt_itemname").asRichTextField;
		(comp.getChild("baseItem") as BaseItem).itemData = itemData;
		if (isBuy) {
			buyController.selectedIndex = 1;
			if (addNum > 1) {
				itemTxt.text = `${itemData.getName(true)}<font color = ${Color.ItemColor[itemData.getColor()]}>   x${addNum}</font>`;
			} else {
				itemTxt.text = `${itemData.getName(true)}`;
			}
		} else {
			buyController.selectedIndex = 0;
			itemTxt.text = `${itemData.getName(true)}`;
		}
		comp.x = Math.round(fairygui.GRoot.inst.width - 374);
		comp.y = 170;
		LayerManager.UI_Tips.addChild(comp);

		egret.Tween.get(comp).to({ x: Math.round((fairygui.GRoot.inst.width - 274) / 2), y: comp.y }, 300).call(function () {
			egret.Tween.get(comp).to({}, 1000).call(function () {
				comp.removeFromParent();
			});
		});
	}

	private static startMove(delayTime: number, parent: fairygui.GComponent,startX?:number,startY?:number): void {
		if (MoveMotionUtil.waitList.length > 0) {
			egret.setTimeout(MoveMotionUtil.startMove, this, delayTime, delayTime, parent,startX,startY);
		}
		else {
			MoveMotionUtil.isStart = false;
			return;
		}
		let _code: number = MoveMotionUtil.waitList.shift();
		if (!_code) return;
		if(MoveMotionUtil.waitListPosX.length > 0) {
			startX = MoveMotionUtil.waitListPosX.shift();
			startY = MoveMotionUtil.waitListPosY.shift();
		}

		let _itemInfo: any = ConfigManager.item.getByPk(_code);
		if (!_itemInfo) return;

		let _image: GLoader = ObjectPool.pop("GLoader");
		_image.touchable = false;
		_image.load(URLManager.getIconUrl(_itemInfo.icon, URLManager.ITEM_ICON));
		if(!startX && startX != 0) startX = 100;
		if(!startY && startY != 0) startY = fairygui.GRoot.inst.height - 350;
		let _endPt: egret.Point = OpenButtonCfg.getPackBtnPos();
		let _endX:number = _endPt.x;
		let _endY:number = _endPt.y;
		_image.x = startX;
		_image.y = startY;
		_image.alpha = 0;
		//LayerManager.UI_Cultivate.displayListContainer.addChild(_image.displayObject);
		parent.addChild(_image);

		let _dir: number = Math.round(Math.random() * 1) == 0 ? 1 : -1;
		let _cX: number = startX - 20;
		let _cY: number = startY - 300;
		// let _controllerPt: egret.Point = new egret.Point(_cX, _cY);
		MoveMotionUtil.curveMoveTo(_image, _endX, _endY, [_cX,_cY], function () {
			if (!_image) return;
			_image.destroy();
			_image = null;
			EventManager.dispatch(UIEventEnum.PackPlayEffect);
		});
		// function onComplete() {
		// 	_image.reset();
		// 	App.DisplayUtils.removeFromParent(_image);
		// 	_image = null;
		// }
	}

	private static expImgs:fairygui.GImage[] = [];
	/**
	 * 飘经验动效
	 * @param startPoint开始点
	 * @param endPoint结束点
	 * @param addExp 经验增长量，动态获取经验粒子数量
	 */
	public static startExpEffect(startPoint:egret.Point,endPoint:egret.Point,addExp:number = -1,ctrlX?:number,ctrlY?:number,direct?:number,isExp:boolean=true):void {
		let count:number = MoveMotionUtil.getExpEffectCount(addExp);
		let completeNum:number = 0;
		let endX:number = endPoint.x;
		let endY:number = endPoint.y;
		let startX:number = startPoint.x;
		let startY:number = startPoint.y;
		for(let i:number = 0; i < count; i++) { 
			let img:fairygui.GImage = MoveMotionUtil.expImgs.pop();
			if(!img) {
				img = FuiUtil.createObject(PackNameEnum.Common,"img_expStar").asImage;
			}
			img.x = startX;
			img.y = startY;
			let dir: number = i % 2 == 0 ? 1 : -1;
			if(direct!=null){
				dir = direct;
			}
			let cX: number = ctrlX!=null?ctrlX:endX + (Math.random() * 360 - 40) * dir;
			// dir = Math.random() < 0.5 ? 1 : -1;
			let cY: number = ctrlY!=null?ctrlY:startY - (Math.random() * 400 + 100);
			// let controllerPt: egret.Point = new egret.Point(cX, cY);
			// cX = endPoint.x + Math.random() * 300 * dir;
			// cY = endPoint.y - 180;
			// let controllerPt1: egret.Point = new egret.Point(cX, cY);
			egret.setTimeout(function() {
				LayerManager.UI_Tips.addChild(img);
				MoveMotionUtil.curveMoveTo(img, endX,endY, [cX,cY], function () {
					if (!img) return;
					img.removeFromParent();
					MoveMotionUtil.expImgs.push(img);
					completeNum ++;
					if(isExp && completeNum >= count) {
						EventManager.dispatch(NetEventEnum.roleExpUpdate);
					}
				},this,1000);
			},this,i*50)
		}
	}

	/**
	 * 根据经验增长量获取经验特效的粒子个数
	 */
	private static getExpEffectCount(addExp:number):number {
		if(addExp == -1) return 20;
		if(addExp >= 1000000) {
			return 35;
		}
		else if(addExp >= 100000) {
			return 20;
		}
		return 10;
	}

	public static itemMoveToBagFromPos(codes:number[],startX:number,startY:number):void {
		MoveMotionUtil.itemMoveToBag(codes,50,LayerManager.UI_Cultivate,startX,startY);
	}

	/**数值滚动 */
	public static setTxtNumberRoll(txt:fairygui.GTextField | egret.TextField,startNum:number,endNum:number,str:string = "",time:number = 1000,isFormat:boolean = true):void {
		if(!txt) return;
		let addNum:number = (endNum - startNum) / (time / 50);
		let num:number = startNum + addNum;
		let index:number = egret.setInterval(() => {
			if(num < endNum) {
				num += addNum;
				if(str != "") {
					txt.text = isFormat ? App.StringUtils.substitude(str,App.MathUtils.formatNum2(num)) : App.StringUtils.substitude(str,num);
				}
				else {
					txt.text = isFormat ? App.MathUtils.formatNum2(num) : num + "";
				}
			}
			else {
				egret.clearInterval(index);
				if(str != "") {
					txt.text = isFormat ? App.StringUtils.substitude(str,App.MathUtils.formatNum2(endNum)) : App.StringUtils.substitude(str,endNum);
				}
				else {
					txt.text = isFormat ? App.MathUtils.formatNum2(endNum) : endNum + "";
				}
			}
		},this,50);
		
	}
}
