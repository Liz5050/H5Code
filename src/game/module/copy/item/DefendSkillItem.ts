/**
 * 守卫神剑副本技能item
 * @author zhh
 * @time 2018-09-25 16:48:37
 */
class DefendSkillItem extends ListRenderer {

    private c1:fairygui.Controller;
	private txtCost:fairygui.GTextField;
	private cnt:fairygui.GComponent;
	private centerX:number = 0;
	private centerY:number = 0;
	private value:number;
	private shape: egret.Shape;
	private startAngle: number = -90;//起始角度，单位度。
	private maxValue:number = CopyCache.DF_SKILL_CD; 
	private rad: number = 56; //半径
	public constructor() {
		super();
		
	}
	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
        //---- script make start ----
        this.c1 = this.getController("c1");
		this.txtCost = this.getChild("txt_cost").asTextField;
		this.cnt = this.getChild("cnt").asCom;
		this.shape = new egret.Shape();
        (this.cnt.displayObject as egret.DisplayObjectContainer).addChild(this.shape);
		this.shape.x = 56;
		this.shape.y = 56;
		
        //---- script make end ----		

	}
	public setData(data:any,index:number):void{		
		this._data = data;
		this.itemIndex = index;
		this.txtCost.text = "-"+this._data.cost+"积分";
		this.c1.setSelectedIndex(index);
		if(!CacheManager.copy.isDfSkillCd(this._data.id)){
			this.shape.graphics.clear();
		}
		
	}
	public updateValue(newValue: number,maxValue:number): void {       
        if (this.value == newValue) return;
		this.maxValue = maxValue;
        this.value = newValue;
		if(this.value==0){
			this.shape.graphics.clear();
			return;
		}
        let newAngle = this.startAngle + ((newValue / this.maxValue) * 360) % 360;
        if (newValue >= this.maxValue) {
            newAngle = this.startAngle + 360;
        }
        this.changeGraphics(newAngle);
    }

	private changeGraphics(angle) {        
        this.shape.graphics.clear();
        this.shape.graphics.moveTo(0, 0);
        this.shape.graphics.beginFill(0,0.5); 
        this.shape.graphics.lineTo(this.centerX,-this.rad);
		let curPi:number = angle * Math.PI / 180;
        this.shape.graphics.drawArc(this.centerX,this.centerY,this.rad,curPi, 270 * Math.PI / 180, false);//this.startAngle * Math.PI / 180  angle * Math.PI / 180;
        this.shape.graphics.lineTo(this.centerX,this.centerY);
        this.shape.graphics.endFill();
    }

	public drawCircle():void{
		this.shape.graphics.clear();
        this.shape.graphics.moveTo(0, 0);
        this.shape.graphics.beginFill(0,0.5); 
        this.shape.graphics.lineTo(this.centerX,-this.rad);		
        this.shape.graphics.drawArc(this.centerX,this.centerY,this.rad,0, 360 * Math.PI / 180, false);//this.startAngle * Math.PI / 180  angle * Math.PI / 180;
        this.shape.graphics.lineTo(this.centerX,this.centerY);
        this.shape.graphics.endFill();
	}

}