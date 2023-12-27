/**
 * 星级评价
 * @author zhh
 * @time 2018-09-30 12:00:48
 */
class CopyStarPanel extends BaseContentView {
    private loaderStar:GLoader;
    private imgRadius:fairygui.GImage;
    private txtTime:fairygui.GTextField;
    private txtDesc:fairygui.GRichTextField;
    private txtExp:fairygui.GRichTextField;
    private curStar:number = -1;
    private _curCopyInf:any;
    private max:number = 0;
    private curStarTime:number = 0;
    private maskSp:BaseMask;
    private c1: fairygui.Controller;
    private timeIdx: number;
	public constructor(parent:fairygui.GComponent) {
		super(PackNameEnum.CopyStar,"CopyStarPanel",null,parent);
	}
	public initOptUI():void{
        //---- script make start ----
        this.c1 = this.getController('c1');
        this.loaderStar = <GLoader>this.getGObject("loader_star");
        this.imgRadius = this.getGObject("img_radius").asImage;
        this.txtTime = this.getGObject("txt_time").asTextField;
        this.txtDesc = this.getGObject("txt_desc").asRichTextField;
        this.txtExp = this.getGObject("txt_exp").asRichTextField;

        //---- script make end ----
        let r:number = Math.max(this.imgRadius.width,this.imgRadius.height)/2;
        this.maskSp = new BaseMask(r,0,1);
        this.displayListContainer.addChild(this.maskSp);
        this.maskSp.x = this.imgRadius.x + this.imgRadius.width/2;
        this.maskSp.y = this.imgRadius.y + this.imgRadius.height/2;
        this.imgRadius.displayObject.mask = this.maskSp;
	}

	public updateAll(data?:any):void{
		this._curCopyInf=data;
		this.c1.selectedIndex = ConfigManager.copy.getCopyType(this._curCopyInf.code) != ECopyType.ECopyCrossTeam ? 0 : 1;
	}

    private checkStar(passSec:number):boolean{
        let flag:boolean = false;       
        let process:number = CacheManager.copy.getCopyProcess(this._curCopyInf.code);
        let info:any = this.getStartInfo(this._curCopyInf.code,process);
        if(!info){
            return flag; 
        }
        let lastSec:number = 0;
        let starDropList:string = "";
        for(let i:number=3;i>=0;i--){
            let field:string = `star${i}Time`;
            if(passSec<info[field]){
                if(this.curStar != i){
                    this.curStar = i;
                    this.max = info[field] - lastSec;
                    this.curStarTime = info[field];
                    starDropList = info[`star${i}DropList`];
                    flag = true;
                }               
                break;
            }
            lastSec = info[field];
        }
        if(flag){
            this.maskSp.drawCircle();
            let clr:string = Color.Color_5;
            this.txtDesc.text = App.StringUtils.substitude(LangCopyHall.L39,HtmlUtil.html(this.curStarTime+"",clr),
            HtmlUtil.html(ConfigManager.copy.getCopyStarStr(this.curStar)+"",clr));
            if(starDropList){
                let item:ItemData = starDropList.indexOf(',') != -1 ? RewardUtil.getStandeRewards(starDropList)[0]:RewardUtil.getRewards(starDropList)[0];
                if (item.getItemInfo())this.txtExp.text = "奖励"+item.getName(false)+HtmlUtil.html(item.getItemAmount()+"",clr);
            }
        }else{
            this.maskSp.updateValue(passSec-lastSec,this.max);
        }        
        this.loaderStar.load(ConfigManager.copy.getCopyStarUrl(this.curStar));
        this.txtTime.text = App.DateUtils.getFormatBySecond(this.curStarTime-passSec);
        return flag;
    }

    private onTimer():void{
        //判断当前星级
		var copyEndTime:number = CacheManager.copy.copyEndTime;
        var leftSec:number = Math.floor((copyEndTime - egret.getTimer())/1000);
        leftSec = this._curCopyInf.stayTime - leftSec; //已经过去的时间
        if(leftSec>=0){            
            this.checkStar(leftSec);
        }
		
    }

    public onShow(data?:any): void {
		super.onShow(data);
        // App.TimerManager.doTimer(1000,0,this.onTimer,this);
        this.timeIdx = egret.setInterval(this.onTimer, this, 1000);
        this.checkStar(0);
        this.maskSp.drawCircle();
	}
    /**
     * 关闭
     * @param param 参数
     * @param callBack 显示成功后的回调
     */
    public hide(param: any = null, callBack: CallBack = null): void{
        super.hide(param,callBack);
        this.curStar = -1;
        this.curStarTime = 0;
        this.max = 0;
        this.txtTime && (this.txtTime.text = "00:00:00");
        // App.TimerManager.remove(this.onTimer,this);
        if (this.timeIdx > 0) {
            egret.clearInterval(this.timeIdx);
            this.timeIdx = 0;
        }
    }

    private getStartInfo(code: number, process: number):any {
        if (ConfigManager.copy.getCopyType(code) != ECopyType.ECopyCrossTeam) {
            return ConfigManager.copy.getCopyStarInf(code, process);
        }
        return ConfigManager.team.getCopyStarInf(code);
    }
}