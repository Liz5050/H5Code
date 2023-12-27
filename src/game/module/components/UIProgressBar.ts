enum UIProgressBarType
{
	/**进度值资源可做九宫拉伸 */
	Normal,
	/**遮罩型，用于进度值不做九宫拉伸的资源 */
	Mask,
}
enum BarLabelType
{
	None,//不显示
	Only_Current,//仅显示current
	Current_Total,//显示current/total
	Percent,//显示百分比
	Current_Over_Total,//显示current/total（current可大于total） 
	Only_Current_Over,//仅显示current（current可大于total)
}
/**
 * 进度条组件
 * @author lizhi
 */
class UIProgressBar extends fairygui.GComponent
{
	public static PROPGRESS_UPDATE:string = "PROPGRESS_UPDATE";
	public static PROPGRESS_COMPLETE:string = "PROPGRESS_COMPLETE";
	private barMc: UIMovieClip;
	private gPreAsset:GLoader;
	private gBgAsset:GLoader;
	private gEffect:GLoader;
	private gProgressTxt:fairygui.GTextField;	
	private gLabelType:number = 0;
	private gBarType:UIProgressBarType;
	private gWidth:number;
	private gHeight:number;
	private gCurrent:number = -1;
	private gTotal:number = 1;
	private gOverCurrent:number = 0; //文本类型4需要
	private gMotionSize:number;

	private gOffsetX:number = 0;
	private gOffsetY:number = 0;
	
	private gWordLeft:string = "";
	private gWordRight:string = "";
	// private gShowEffect:boolean;//是否显示进度值特效
	private gEffectUrl:string;//进度条特效资源
	private gFormatValue:boolean = false;
	private _isFixPos:boolean = false;

	/**遮罩 */
	private gMaskRect:egret.Rectangle = new egret.Rectangle(0,0,0,0);

	public constructor() 
	{
		super();
	}

	protected constructFromXML(xml: any): void {
        super.constructFromXML(xml);

		this.gPreAsset = this.getChild("loader_bar") as GLoader;
		this.gPreAsset.autoSize = undefined;
		this.gBgAsset = this.getChild("icon") as GLoader;
		this.gEffect = this.getChild("loader_effect") as GLoader;
		this.gProgressTxt = this.getChild("title").asTextField;
		this.gProgressTxt.text = "";
		this.gProgressTxt.stroke = 0;
    }

	/**
	 * 设置进度条样式
	 * @param barAsset 进度值资源url
	 * @param bgAsset 进度条背景资源url
	 * @param width height 背景宽高
	 * @param offsetX offsetY 进度条相对背景资源偏移量
	 * @param barType 进度条类型 0改变宽高，1改变遮罩宽高
	 * @param cusSize是否应用自定义尺寸
	 */
	public setStyle(barAsset:string,bgAsset:string,width?:number,height?:number,offsetX:number = 0,offsetY:number = 0,barType:UIProgressBarType = UIProgressBarType.Normal,cusSize:boolean = false):void
	{
		if(cusSize) {
			this.gBgAsset.width = width;
			this.gBgAsset.height = height;
			this.gPreAsset.width = width - offsetX*2;
			this.gPreAsset.height = height - offsetY*2;
		}
		else {
			this.gPreAsset.width = this.width - offsetX*2;
			this.gPreAsset.height = this.height - offsetY*2;
			this.gBgAsset.width = this.width;
			this.gBgAsset.height = this.height;
		}

		this.gPreAsset.url = barAsset;
		this.gBgAsset.url = bgAsset;
		this.gPreAsset.x = offsetX;
		this.gPreAsset.y = offsetY;

		this.gOffsetX = offsetX;
		this.gOffsetY = offsetY;
		this.gWidth = this.gBgAsset.width - this.gOffsetX*2;
		this.gHeight = this.gBgAsset.height;
		this.gMaskRect.y = -20;
		this.gMaskRect.height = this.gHeight + 40;

		this.gBarType = barType;
	}

	// public setCusSize(width:number,height:number):void {
	// 	this.setSize(width,height);
	// 	this.gBgAsset.width = width;
	// 	this.gBgAsset.height = height;
	// 	this.gPreAsset.width = width - this.gOffsetX*2;
	// 	this.gPreAsset.height = height - this.gOffsetY*2;
	// 	this.gWidth = this.gBgAsset.width - this.gOffsetX*2;
	// 	this.gHeight = this.gBgAsset.height;
	// }


	public setBgAlpha(value:number):void{
		this.gBgAsset.alpha = value; 
	}

	public setBarAlpha(value:number):void{
		this.gPreAsset.alpha = value;
	}

	public setProgressOffsetY(offsetY:number):void{
		this.gProgressTxt.y = this.height/2 + offsetY;
	}
	
	/**
	 * 设置进度
	 * @param current 当前进度值
	 * @param total 总进度值
	 * @param needMotion 是否有缓动动画表现
	 * @param showBackMotion 进度条是否显示倒退缓动表现
	 */
	public setValue(current:number,total:number,needMotion:boolean = false,showBackMotion:boolean = false,time:number = 400):void
	{
		let _barWidth:number;
		if(this.gBarType == UIProgressBarType.Normal)
		{
			egret.Tween.removeTweens(this.gPreAsset);
			_barWidth = this.gPreAsset.width;
		}else
		{
			egret.Tween.removeTweens(this.gMaskRect);
			_barWidth = this.gMaskRect.width;
		}
		if(current < 0)current = 0;
		if(total <= 0)total = 1;
		
		if(this.gLabelType != BarLabelType.Only_Current_Over && this.gLabelType != BarLabelType.Current_Over_Total)
		{
			if(this.gCurrent == current && this.gTotal == total) return;
			if(current > total) current = total;
		}
		else 
		{
			if(this.gOverCurrent == current && this.gTotal == total) return;
			this.gOverCurrent = current;
			if(current > total) current = total;
		}
		
		this.gMotionSize = this.gWidth/total;
		let _targetW:number = current * this.gMotionSize;
		this.gTotal = total;
		if(needMotion)
		{
			if(!showBackMotion && _targetW <= _barWidth)
			{
				this.setBarWidth(_targetW);
				this.gCurrent = _targetW/this.gMotionSize;
				this.update();
				this.onTweenCompleteHandler();
			}
			else
			{
				this.addTween(_targetW,time);
			}
		}
		else
		{
			this.setBarWidth(_targetW);
			this.gCurrent = _targetW/this.gMotionSize;
			this.update();
		}
	}

	private setBarWidth(cusWidth:number)
	{
		if(this.gBarType == UIProgressBarType.Normal)
		{
			this.gPreAsset.width = cusWidth;
		}
		else
		{
			this.gMaskRect.width = cusWidth;
			this.gPreAsset.displayObject.mask = this.gMaskRect;
		}
		if(this.gEffectUrl && this.gEffectUrl != "") this.gEffect.x = this.gPreAsset.x + cusWidth;
	}

	private addTween(targetW:number,time:number):void
	{
		let _tw:egret.Tween;
		if(this.gBarType == UIProgressBarType.Normal)
		{
			_tw = egret.Tween.get(this.gPreAsset,{onChange:changeFunc,onChangeObj:this.gPreAsset});
		}
		else
		{
			_tw = egret.Tween.get(this.gMaskRect,{onChange:changeFunc,onChangeObj:this.gMaskRect});
		}

		_tw.to({width:targetW},time).call(this.onTweenCompleteHandler,this)
		
		let this_ = this;
		function changeFunc()
		{
			if(this_.gBarType == UIProgressBarType.Mask)
			{
				this_.gPreAsset.displayObject.mask = this_.gMaskRect;
			}
			if(this_.gEffectUrl && this_.gEffectUrl != "") this_.gEffect.x = this_.gPreAsset.x + this.width;
			this_.gCurrent = this.width/this_.gMotionSize;
			this_.update();	
		}
	}

	private onTweenCompleteHandler():void
	{
		this.dispatchEvent(new egret.Event(UIProgressBar.PROPGRESS_COMPLETE));
	}

	/**
	 * 进度条自定义文本内容
	 * @param strLeft 文本左侧字符
	 * @param strRight 文本右侧字符
	 */
	public setWord(strLeft:string,strRight:string = ""):void
	{
		this.gWordLeft = strLeft;
		this.gWordRight = strRight;
		this.update();
	}
	public setProgressText(text:string):void{
		this.gProgressTxt.text = text; 
	}

	public get progressTxt(): fairygui.GTextField {
	    return this.gProgressTxt;
    }

	private update():void
	{
		if(this.gLabelType != BarLabelType.None)
		{
			let _curValue:string = Math.round(this.gCurrent) + "";
			let _overValue:string = Math.round(this.gOverCurrent) + "";
			let _total:string = Math.floor(this.gTotal) + "";
			if(this.gFormatValue)
			{
				_curValue = App.MathUtils.formatNum2(Math.round(this.gCurrent));
				_overValue = App.MathUtils.formatNum2(Math.round(this.gOverCurrent));
				_total = App.MathUtils.formatNum2(Math.floor(this.gTotal));
			}
			// if(_curValue == this.gTotal) _curValue = this.gOverCurrent;
			switch(this.gLabelType)
			{
				case BarLabelType.Only_Current:
					this.gProgressTxt.text = (this.gWordLeft + _curValue + this.gWordRight);
					break;
				case BarLabelType.Current_Total:
					this.gProgressTxt.text = (this.gWordLeft + _curValue + "/" + _total + this.gWordRight);
					break;
				case BarLabelType.Percent:
					let _percent:number = Math.ceil(this.gCurrent / this.gTotal * 100);
					if(_percent >= 100) _percent = 100;
					this.gProgressTxt.text = (this.gWordLeft + _percent + "%") + this.gWordRight;
					break;
				case BarLabelType.Current_Over_Total:
					this.gProgressTxt.text = (this.gWordLeft + _overValue + "/" + _total) + this.gWordRight;
					break;
				case BarLabelType.Only_Current_Over:
					this.gProgressTxt.text = this.gWordLeft + _overValue + this.gWordRight;
					break;
			}
			if(this._isFixPos){
				this.gProgressTxt.x = this.width - this.gProgressTxt.width >> 1;
				this.gProgressTxt.y = this.height - this.gProgressTxt.height >> 1;
			}		
			this.dispatchEvent(new egret.Event(UIProgressBar.PROPGRESS_UPDATE));
		}
	}

	/**
	 * 当前进度值
	 */
	public get current():number
	{
		return this.gCurrent;
	}

	/**
	 * 当前进度值宽度
	 */
	public get barWidth():number
	{
		if(this.gBarType == UIProgressBarType.Normal)
		{
			return this.gPreAsset.width;
		}
		return this.gMaskRect.width;
	}

	/**进度值末端特效 */
	public showEffect(effectUrl:string,effectHeight:number,pivotX:number = 0.85)
	{
		this.gEffectUrl = effectUrl;
		this.gEffect.url = effectUrl;
		this.gEffect.y = (this.gHeight - effectHeight) / 2;
		this.gEffect.setPivot(pivotX,0,true);
		// this.gShowEffect = value;
	}

	/** label显示类型
	 * 0为不显示
	 * 1为显示current
	 * 2为显示current/total
	 * 3位显示百分比，
	 * 4为显示current/total（current可大于total） 
	 * 5为显示current（current可大于total）*/	
	public set labelType(value:BarLabelType)
	{
		this.gLabelType = value;
	}

	/**
	 * 是否将过大数字转化文字显示
	 */
	public set formatValue(value:boolean)
	{
		if(this.gFormatValue == value) return;
		this.gFormatValue = value;
		this.update();
	}

	/**
	 * 进度值文本颜色
	 */
	public set textColor(value:number)
	{
		if(this.gProgressTxt)this.gProgressTxt.color = value;
	}

	public set textStroke(value:number){
		if(this.gProgressTxt)this.gProgressTxt.stroke = value;
	}
	public set textStrokeColor(value:number){
		if(this.gProgressTxt)this.gProgressTxt.strokeColor = value;
	}
	public set labelSize(value:number)
	{
		this.gProgressTxt.fontSize = value;		
	}

	/**是否重新计算进度标签坐标 */
	public set isFixPos(value:boolean){
		this._isFixPos = value;
		if(this._isFixPos){
			this.gProgressTxt.setPivot(0,0,true);
			this.gProgressTxt.autoSize = fairygui.AutoSizeType.Both;
		}else{
			//默认
			this.gProgressTxt.setPivot(0.5,0.5,true);
			this.gProgressTxt.autoSize = fairygui.AutoSizeType.None;
		}
	}

	/**
	 * 设置特效进度条
	 */
	public setBarMc(pkgName: string, x: number = 0, y:number = 0): void {
		if (!this.barMc) {
			this.barMc = UIMovieManager.get(pkgName, x, y);
		}
		(this.gPreAsset["_container"] as fairygui.UIContainer).addChild(this.barMc.displayObject);
	}

	public destroy():void
	{
		egret.Tween.removeTweens(this.gPreAsset);
		egret.Tween.removeTweens(this.gMaskRect);
		this.removeChildren();
		this.dispose();
	}
}