/**
 * 个人boss功能
 * @author zhh
 * @time 2018-06-05 11:50:21
 */
class PersonalBossPanel extends BossNewBasePanel{
   
    private nextSelectBossCode:number = 0;
    private txt_fight:fairygui.GTextField;
	public constructor() {
		super();
        this.isDestroyOnHide = false;
	}

	public initOptUI():void{
        super.initOptUI();
        GuideTargetManager.reg(GuideTargetName.PersonalBossPanelChallangeBtn, this.btnChallange);
        this.txt_fight = this.getGObject("txt_fight").asTextField;
        // let green:string = "#ff7610";
        // let clrStr1:string = HtmlUtil.html("神装",green);
        // let clrStr2:string = HtmlUtil.html("神装碎片",green);
        // this.tips = "1、满足等级限制可开启对应等级的BOSS<font color='#ff7610'>神装</font>\n2、个人BOSS可掉落相应等级的各品质的装备，更有几率掉落<font color='#ff7610'>神装</font>和<font color='#ff7610'>神装碎片</font>\n3、个人BOSS挑战次数每天0点重置"

    }
    
    protected updateInf(mgBossInf:any):void{
        this.curMgBossInf = mgBossInf;
        let bossInf:any = ConfigManager.boss.getByPk(mgBossInf.bossCode);
        let items:ItemData[] = RewardUtil.getRewards(mgBossInf.showReward);
        this.isCanDelegate = CopyUtils.isCanDelegate(mgBossInf.copyCode,false);
        let copyCfg:any = ConfigManager.copy.getByPk(mgBossInf.copyCode);
        let color:number = Color.Red;
        if(CacheManager.role.combatCapabilities >= copyCfg.warfare) {
            color = Color.Green2;
        }
        this.txt_fight.color = color;
        this.txt_fight.text = "推荐战力：" + copyCfg.warfare;
        
        let isCanKill:boolean = CacheManager.bossNew.isPersonalCanKill(this.curMgBossInf);
        this.imgSymbol.visible = isCanKill;
        let idx:number = isCanKill?0:1;
        this.c1.setSelectedIndex(idx);
        this.txtBossname.text = bossInf.name+"("+ConfigManager.boss.getBossLevelStr(bossInf, true)+")";
        let fixStr:string = "可挑战";
        let limitStr:string = ConfigManager.mgGameBoss.getBossFixName(this.curMgBossInf)+fixStr;        
        this.txtLimit.text = limitStr; 
		this.setBossMc(bossInf);
        this.updateReward(items);
        let label:string = "挑 战";
        if(this.isCanDelegate){
            label = "快速挑战";
        }
        this.btnChallange.text = label;
    }
    protected getDfIndex(): number {
        if(this.nextSelectBossCode>0){
            for(let i:number=0;i<this.bossInfs.length;i++){
                if(this.bossInfs[i].bossCode==this.nextSelectBossCode){
                    this.nextSelectBossCode = 0;
                    return i;
                }
            }
            this.nextSelectBossCode = 0;
        }
        return 0;
    }
    protected setBossInfs():void{
        if(!this.bossInfs){
            this.bossInfs = ConfigManager.mgGameBoss.getByCopyType(ECopyType.ECopyMgPersonalBoss).concat();
        } 
    }
    protected handlerChallange():void{
       if(!ItemsUtil.checkSmeltTips()){
            if(this.isCanDelegate){
                let nextInfo:any;                
                if(this.listBossname.selectedIndex<this.bossInfs.length-1){
                    nextInfo = this.bossInfs[this.listBossname.selectedIndex+1];
                    if(CacheManager.copy.isEnterNumOk(nextInfo.copyCode) && CacheManager.bossNew.isPersonalOpen(nextInfo)){
                        this.nextSelectBossCode = nextInfo.bossCode;
                    }
                }
                EventManager.dispatch(LocalEventEnum.CopyDelegate,this.curMgBossInf.copyCode,0,false);
            }else{
                EventManager.dispatch(LocalEventEnum.BossReqEnterPersonalBoss,this.curMgBossInf.copyCode,this.curMgBossInf.bossCode);
                
            }
            
        } 
    }
    protected onGUIListSelect(e:fairygui.ItemEvent):void{
        var item:PersonnalBossItem = <PersonnalBossItem>e.itemObject;        
        if(item && item.getData().copyCode){            
            let isCopyNum:boolean = CacheManager.copy.isEnterNumOk(item.getData().copyCode);
            if(!isCopyNum){ //已击杀
                this.listBossname.selectedIndex = this.lastIndex;
                item.setSelectStatus(false);
            }else{
                this.changeCurSelect(false);
                this.curSelectItem = item;
                this.changeCurSelect(true);
                this.updateInf(item.getData());
            }            
        }               
    }
    

}