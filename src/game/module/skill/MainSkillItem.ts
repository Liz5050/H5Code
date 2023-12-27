/**
 * 主界面技能项
 */
class MainSkillItem extends fairygui.GButton{
	public iconLoader: GLoader;
	private timeTxt:fairygui.GTextField;
	private cooldownGraph:fairygui.GGraph;
	private _skillData:SkillData;
	private leftSecond:number;

	//冷却
	private shape: egret.Shape;
	private graphics: egret.Graphics;
    private startAngle: number = -90;//起始角度，单位度。
	private currentAngle:number = -90;
	private _isCooldown:boolean = false;
	private currentCd:number = 0;

	public constructor() {
		super();
	}

	protected constructFromXML(xml: any): void {
        super.constructFromXML(xml);
		this.iconLoader = this.getChild("icon") as GLoader;
		this.timeTxt = this.getChild("txt_time").asTextField;
		this.timeTxt.text = "";
		this.iconLoader.clear();

		this.graphics = this.getChild("graph_cooldown").asGraph.graphics
    }

	public set skillData(skillData:SkillData){
		this._skillData = skillData;
		if(skillData){
			this.iconLoader.load(skillData.getIconRes());
			this.enabled = true;
		}else{
			this.iconLoader.clear();
			this.enabled = false;
		}
	}

	public get skillData():SkillData{
		return this._skillData;
	}

	public get cdGroup():number{
		return this._skillData.cdGroup;
	}

	public get isCooldown():boolean{
		return this._isCooldown;
	}

	/**
	 * 开始cd
	 * cd类型：0普通cd，1组cd
	 */
	public beginCD(cdType:number, cdTime:number = 0):void{
		if (cdType == 0 && Math.abs(this.leftSecond - (cdTime/1000+0.5>>0)) < 2)
				return;//相差小于2s的忽略
		this.resetCD();
		this.currentCd = cdType == 0 ? cdTime : this._skillData.cdGroupTime;
		if (this.currentCd <= 0) return;
		let count:number = this.currentCd/1000 + 0.5 >> 0;
		this.timeTxt.text = count > 1 ? count.toString() : "";
        this.leftSecond = count;
		App.TimerManager.doTimer(100, this.currentCd/100, this.updateTime, this, this.resetCD, this);
		App.TimerManager.doFrame(1, 0, this.graphUpdate, this);
		this._isCooldown = true;
	}

	private timeCount:number = 0;
	private updateTime():void{
		this.timeCount++;
		if (this.timeCount % 10 == 0)
		{
			this.leftSecond--;
			this.timeTxt.text = this.leftSecond.toString();
		}
	}

	/**
	 * 重置
	 */
	private resetCD():void{
        this.leftSecond = 0;
		this.timeCount = 0;
		this.timeTxt.text = "";
		this.currentAngle = -90;
		this.graphics.clear();
		App.TimerManager.remove(this.updateTime, this);
		App.TimerManager.remove(this.graphUpdate, this);
		this._isCooldown = false;
	}

	/**
	 * 倒计时效果
	 */
	private graphUpdate():void{
		let speed:number = 360/(this.currentCd/1000*60);
		this.currentAngle += speed;
		this.changeGraphics(this.currentAngle);
	}

	private changeGraphics(angle) {
        let r: number = 40;
		this.graphics.clear();
        this.graphics.moveTo(r, r);
        this.graphics.beginFill(0x000000, 1);
        this.graphics.lineTo(r, 0);
        this.graphics.drawArc(r, r, r, this.startAngle * Math.PI / 180, angle * Math.PI / 180, true);
        this.graphics.lineTo(r, r);
        this.graphics.endFill();
    }
}