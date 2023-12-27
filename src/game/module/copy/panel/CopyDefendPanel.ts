/**
 * 守卫神剑副本panel
 * @author zhh
 * @time 2018-09-25 16:42:22
 */
class CopyDefendPanel extends BaseCopyPanel {
    private txtRing:fairygui.GTextField;
    private txtRingTime:fairygui.GRichTextField;
    private txtMonster:fairygui.GRichTextField;
    private txtScore:fairygui.GRichTextField;
    private btnExit:fairygui.GButton;
    private btnLuck:fairygui.GButton;
    private btnDesc:fairygui.GButton;
    private listRole:List;
    private listSkill:List;
    private _timerHandler:number = 0;

	public constructor(copyInf:any) {
		super(copyInf,"CopyDefendPanel",PackNameEnum.Copy2);
	}
	public initOptUI(): void {
        super.initOptUI();
        //---- script make start ----
        this.txtRing = this.getGObject("txt_ring").asTextField;
        this.txtRingTime = this.getGObject("txt_ring_time").asRichTextField;
        this.txtMonster = this.getGObject("txt_monster").asRichTextField;
        this.txtScore = this.getGObject("txt_score").asRichTextField;
        this.btnExit = this.getGObject("btn_exit").asButton;
        this.btnLuck = this.getGObject("btn_luck").asButton;
        this.btnDesc = this.getGObject("btn_desc").asButton;
        this.listRole = new List(this.getGObject("list_role").asList);
        this.listSkill = new List(this.getGObject("list_skill").asList);

        this.btnExit.addClickListener(this.onGUIBtnClick, this);
        this.btnLuck.addClickListener(this.onGUIBtnClick, this);
        this.btnDesc.addClickListener(this.onGUIBtnClick, this);
        //this.listRole.list.addEventListener(fairygui.ItemEvent.CLICK,this.onGUIListSelect,this);
        this.listSkill.list.addEventListener(fairygui.ItemEvent.CLICK,this.onGUIListSelect,this);
        this.XPSetBtn.visible = true;
        //---- script make end ----
        this.setTimeTipsText("0",1);
		
	}
	public updateAll(data?:any):void{
		super.updateAll(data);
        this.updateMonsScore();
        this.updateRoleStatu();
        this.listSkill.data = ConfigManager.copy.getDefendSkills();
        
	}
    /**更新角色头像状态 */
    public updateRoleStatu():void{
        let roles:any[] = CacheManager.role.roles.concat();
        roles.sort(function (a:any,b:any):number{
            let careerA:number = a.career_I%1000; 
            let careerB:number = b.career_I%1000;
            if(careerA<careerB){
                return -1;
            }else if(careerA>careerB){
                return 1;
            }
            return 0;
        });
        this.listRole.data = roles;
    }

    /**
	 * 设置副本内中下位置的倒计时提示
	 */
	public setTimeTipsText(text: string,type:number): void {
		if (this.txtRingTime) { //boss数时间
            this.txtRingTime.text = App.StringUtils.substitude(LangCopyHall.L34,HtmlUtil.html(text,"#0df14b"));
		}		
	}
    public updateProcess(): void {		
		var str:string = "";
		if(CacheManager.copy.copyRingInf){
			//var leftRing:number = CacheManager.copy.copyRingInf.maxRing - CacheManager.copy.copyRingInf.curRing;
			str = CacheManager.copy.copyRingInf.curRing+"/"+CacheManager.copy.copyRingInf.maxRing;			
		}else{
			str = "0/1";
		}
		this.txtRing.text = `(${str})`;
		
	}
    /**更新积分和怪物数量 */
    public updateMonsScore():void{
        this.txtScore.text = App.StringUtils.substitude(LangCopyHall.L35,HtmlUtil.html(""+CacheManager.copy.defendScore,"#0df14b"));
        this.updateMonster();
        CommonUtils.setBtnTips(this.btnLuck,CacheManager.copy.luckCount>0);
    }
    public onShow(data?:any): void {
		super.onShow(data);
        this._timerHandler = egret.setInterval(this.onTimerRun,this,1000);
        //App.TimerManager.doTimer(1000,0,this.onTimerRun,this);
	}

    public hide(param: any = null, callBack: CallBack = null): void {
        super.hide(param,callBack);
        //App.TimerManager.remove(this.onTimerRun,this);
        if(this._timerHandler>=0){
            this._timerHandler = 0;
            egret.clearInterval(this._timerHandler);
        }
    }

    private onTimerRun():void{
        this.updateMonster();
        for(let i:number = 0;i<this.listSkill.data.length;i++){
            let info:any = this.listSkill.data[i];
            let cdInfo:any = CacheManager.copy.getDfSkillCd(info.id);
            let cur:number = egret.getTimer();
            let cidx:number = this.listSkill.list.itemIndexToChildIndex(i);
            let rend:DefendSkillItem;
            if(cidx>-1){
                rend = <DefendSkillItem>this.listSkill.list.getChildAt(cidx);
            }
            let curVal:number = 0;
            if(cdInfo && cdInfo.endTime>cur){
                //{skillId:valueNum,total:总时间(毫秒),endTime:结束时间戳}               
                curVal = cdInfo.endTime - cur; //剩余
                curVal = cdInfo.total - curVal;//已经过去的
                rend?rend.updateValue(curVal,cdInfo.total):null;
            }else{
                rend?rend.updateValue(0,0):null;
            }            
        }

        for(let i:number=0;i<this.listRole.data.length;i++){
            let cIdx:number = this.listRole.list.itemIndexToChildIndex(i);
            if(cIdx>-1){
                let roleItem:RoleStatusItem = <RoleStatusItem>this.listRole.list.getChildAt(cIdx);
                if(roleItem && CacheManager.copy.isDfReliveCd(roleItem.roleIndex)){
                    roleItem.updateTime();
                }
            }
        }

    }

    /**更新怪物数量 */
    private updateMonster():void{
        let n:number = CacheManager.map.getEntityNum(RpgObjectType.Monster,[ConfigManager.copy.dfProCode]);
        this.txtMonster.text = App.StringUtils.substitude(LangCopyHall.L36,HtmlUtil.html(""+n,"#0df14b"));
    }

    protected onGUIBtnClick(e:egret.TouchEvent):void{
        var btn: any = e.target;
        switch (btn) {
            case this.btnExit:
                break;
            case this.btnLuck:                
                EventManager.dispatch(LocalEventEnum.CopyShowCallBoss);
                break;
            case this.btnDesc:                 
                let copyInfo:any = ConfigManager.copy.getByPk(CopyEnum.CopyDefend);
                let desc:string = copyInfo.introduction?copyInfo.introduction:"这是说明内容\n哈哈哈第二行";
                desc = HtmlUtil.br(desc);
                EventManager.dispatch(UIEventEnum.BossExplainShow,{desc:desc});
                break;

        }
    }
    protected onGUIListSelect(e:fairygui.ItemEvent):void{
        var item:DefendSkillItem = <DefendSkillItem>e.itemObject;
        if(item){
            if(CacheManager.role.isRoleAllDie()){
                Tip.showRollTip("当前无角色存活");
                return;
            }
            let data:any = item.getData();
            if(CacheManager.copy.isDfSkillCd(data.id)){
                Tip.showLeftTip("技能冷却中,无法使用");
                return;
            }

            let cost:number = data.cost;
            if(CacheManager.copy.defendScore>=cost){
                let idx:number = item.itemIndex+1;
                ProxyManager.copy.useDefendSkill(idx);
                item.drawCircle();
            }else{
                Tip.showLeftTip("技能积分不足");
            }
            
        }
               
    }

}