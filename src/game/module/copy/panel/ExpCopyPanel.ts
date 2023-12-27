/**
 * 经验副本
 * @author zhh
 * @time 2018-05-28 19:30:47
 */
class ExpCopyPanel extends BaseCopyPanel {
	private txtMonster: fairygui.GRichTextField;
	private txtExpreward0: fairygui.GRichTextField;
	private txtExpreward1: fairygui.GRichTextField;
	/**最终值 */
	private curTotal:number[];
	/**当前值 */
	private current: number[];	
	/**每次增加的值 */
	private plus: number[];

	private timeCount: number = 20;//更新20次
	private c1:fairygui.Controller;


	public constructor(copyInf: any) {
		super(copyInf, "ExpCopyPanel");
	}
	public initOptUI(): void {
		super.initOptUI();
		//---- script make start ----
		let cnt:fairygui.GComponent = this.getGObject("cnt").asCom;
		this.txtMonster = cnt.getChild("txt_monster").asRichTextField;
		this.txtExpreward0 = cnt.getChild("txt_expReward0").asRichTextField;
		this.txtExpreward1 = cnt.getChild("txt_expReward1").asRichTextField;
		this.txtExpreward0.text = "0";
		this.txtExpreward1.text = "0";
		this.c1 = cnt.getController("c1");
		//---- script make end ----
		this.setController();

	}
	public updateAll(data?: any): void {
		//8.副本内杀怪经验显示就是配置的总经验除以已击杀数量显示 SNewExperienceCopyInfo
		super.updateAll(data);
		let killNum:number = 0;
		let totalExp: number = 0;
		let levelExp:number = 0;
		if (data) {
			killNum = data.killBossNum_I;
			let info:any = CopyUtils.getExpCopyRewardExp(data);
			totalExp = info.totalExp;			
			levelExp = info.levelExp;
			if(levelExp>0){
				this.c1.setSelectedIndex(1);
			}else{
				this.c1.setSelectedIndex(0);
			}
			if(!this.curTotal){
				this.curTotal = [0,0];
			}
			if(!this.current){
				this.current = [0,0];
			}
			if(!this.plus){
				this.plus = [0,0];
			}

			let b0:boolean = this.updateNumEffect(totalExp,0);
			let b1:boolean = this.updateNumEffect(levelExp,1);
			if(b0 || b1 ){				
				App.TimerManager.remove(this.updateValueText,this);
				App.TimerManager.doTimer(33, 0, this.updateValueText, this);				
			}			
							
		}		
		this.txtMonster.text = killNum + "/100";		
	}

	private updateValueText(): void {
		let c:number = 0;
		for(let i:number = 0;i<2;i++){
			this.current[i]+=this.plus[i];
			this.current[i] = Math.min(this.current[i],this.curTotal[i]);
			this['txtExpreward'+i].text = App.MathUtils.formatNum2(this.current[i]);//this.current[i] + "";
			if(this.current[i]>=this.curTotal[i]){
				c++;
			}
		}
		if(c==2){
			App.TimerManager.remove(this.updateValueText,this);
		}
		
	}
	
	private updateNumEffect(totalExp:number,idx:number):boolean{
		let addExp:number = totalExp - this.curTotal[idx]; //增加的经验值
		if(addExp>0){
			this.current[idx] = this.curTotal[idx];
			this.plus[idx] = Math.floor(addExp/this.timeCount);
			this.plus[idx] = Math.max(1,this.plus[idx]);		
			this.curTotal[idx] = totalExp; 					
			return true;		
		}
		return false;
	}
	
	protected updateProcess(): void {
		
	}

	public getRewardGPoint(idx:number):egret.Point{
		let key:string = 'txtExpreward'+idx;
		let p:egret.Point = this[key].parent.localToGlobal(this[key].x+this[key].width/2,this[key].y);
		return p;		
	}
	
	private resetArr(arr:number[]):void{
		if(arr){	
			arr[0] = 0;
			arr[1] = 0;
		}
		
	}
	private setController():void{
		let levelExp:number = ConfigManager.expCopy.getCopyLevelExp();
		this.c1.setSelectedIndex((levelExp>0?1:0));
	}

	public hide(param: any = null, callBack: CallBack = null): void {
		super.hide(param,callBack);
		App.ArrayUtils.emptyArr(this.current);
		this.resetArr(this.curTotal);
		this.resetArr(this.current);		
		this.plus = [];
		this.txtExpreward0.text = "0";
		this.txtExpreward1.text = "0";
		this.txtMonster.text = "0/100";
	}

}