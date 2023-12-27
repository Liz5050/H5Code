/**环形遮罩 */
class BaseMask extends egret.Shape{
	protected _radius:number;
	protected _color:number;
	protected _dir:number;
	private _centerX:number = 0;
	private _centerY:number = 0;
	private _startAngle: number;//起始角度，单位度。
	private _maxValue:number;
	private _curValue:number;
	private _alp:number;
	public constructor(radius:number,color:number=0,alp:number = 0.5,startAngle:number = -90,dir:number=1) {
		super();
		this._radius = radius;
		this._alp = alp;
		this._color = color;
		this._startAngle = startAngle%360;
		this._dir = dir;
	}
	/**
	 * 画个完整的圆
	 */
	public drawCircle():void{
		this.graphics.clear();
        this.graphics.moveTo(0, 0);
        this.graphics.beginFill(0,this._alp); 
        this.graphics.lineTo(this._centerX,-this._radius);		
        this.graphics.drawArc(this._centerX,this._centerY,this._radius,0, 360 * Math.PI / 180, false);//this.startAngle * Math.PI / 180  angle * Math.PI / 180;
        this.graphics.lineTo(this._centerX,this._centerY);
        this.graphics.endFill();
	}
	/**
	 * 更新
	 * @param curValue 当前值(传已经消耗的值)
	 * @param maxValue 最大值
	 */
	public updateValue(curValue: number,maxValue:number): void {       
        //if (this._curValue == curValue) return;
		this._maxValue = maxValue;
        this._curValue = curValue;		
		if(this._curValue>=this._maxValue || this._curValue==0){
			this.drawCircle();
			return;
		}
		let per:number = Math.min(curValue / this._maxValue,1);
        let newAngle = this._startAngle + per * 360 % 360;
		/*
        if (curValue >= this._maxValue) {
            newAngle = this._startAngle + 360;
        }
		*/
        this.changeGraphics(newAngle);
    }
	private changeGraphics(angle) {        
        this.graphics.clear();
        this.graphics.moveTo(0, 0);
        this.graphics.beginFill(0,this._alp); 
        this.graphics.lineTo(this._centerX,-this._radius);
		let curPi:number = angle * Math.PI / 180;
		if(this._dir==1){
			this.graphics.drawArc(this._centerX,this._centerY,this._radius,curPi, 270 * Math.PI / 180, false);
		}else{
			this.graphics.drawArc(this._centerX,this._centerY,this._radius,this._startAngle * Math.PI / 180,angle * Math.PI / 180, false);
		}        
        this.graphics.lineTo(this._centerX,this._centerY);
        this.graphics.endFill();
    }
}