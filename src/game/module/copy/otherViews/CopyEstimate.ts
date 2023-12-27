class CopyEstimate extends BaseContentView {
	protected txt_estimate:fairygui.GRichTextField;
	protected c1:fairygui.Controller;
	public curStar:number = 0;
	private _curCopyInf:any;
	private _curCopyStarInf:any;
	private _starTimeProps:string[];
	private _curCdEndTime:number = 0;
	public constructor() {
		super(PackNameEnum.Copy,"CopyEstimate");
		this._starTimeProps = ["threeStarTime","twoStarTime","oneStarTime","zeroStarTime"];
		this._starTimeProps.reverse();
	}

	public initOptUI():void{
		this.c1 = this.getController("c1");
		this.txt_estimate = this.getGObject("txt_estimate").asRichTextField;		
	}

	public updateAll():void{
		this._curCopyInf = ConfigManager.copy.getByPk(CacheManager.copy.curCopyCode);
		this._curCopyStarInf = ConfigManager.copyStar.getByPk(CacheManager.copy.curCopyCode);
		this.curStar = this.checkStar(true,true);
		this.c1.setSelectedIndex(this.curStar);
	}

	private checkStar(isText:boolean,isCalTime:boolean):number{
		//判断当前星级
		var copyEndTime:number = CacheManager.copy.copyEndTime;
		var leftSec:number = (copyEndTime - egret.getTimer())/1000;
		leftSec = this._curCopyInf.stayTime - leftSec; //已经过去的时间
		var curStar:number = 0;
		var text:string = "";
		if(leftSec<=this._curCopyStarInf.threeStarTime){
			//三星
			curStar = 3;
			text = "140%超高收益\n掉落！"
		}else if(leftSec>this._curCopyStarInf.threeStarTime && leftSec<=this._curCopyStarInf.twoStarTime){
			//2星
			curStar = 2;
			text = "100%物品掉落\n抓紧！"
		}else if(leftSec>this._curCopyStarInf.twoStarTime && leftSec<=this._curCopyStarInf.oneStarTime){
			//1星
			curStar = 1;
			text = "70%物品掉落\n加油！"
		}else if(leftSec>this._curCopyStarInf.oneStarTime){
			//0星
			curStar = 0;
			text = "50%物品掉落\n努力！"
		}
		if(isText){
			this.txt_estimate.text = text;
		}
		if(isCalTime){					
			var calSec:number = this._curCopyStarInf[this._starTimeProps[curStar]] - leftSec;
			this._curCdEndTime = calSec*1000 + egret.getTimer();
		}
		return curStar;
	}

	public update(data?:any):void{

	}

	public onTimer():boolean{
		var star:number = this.checkStar(false,false);
		var b:boolean = this.curStar!=star;
		if(!b){
			if(this.curStar>0){
				var left:number = this._curCdEndTime - egret.getTimer();
				left = Math.round(left/1000);
				var star:number = Math.max(this.curStar-1,0);
				this.txt_estimate.text =  App.DateUtils.getFormatBySecond(left,3)+`后降为\n${star}星`;
			}else{
				this.txt_estimate.text =  "50%物品掉落\n努力!";
			}
			
		}
		return b;
	}


}