/**
 * boss功能
 * @author zhh
 * @time 2018-06-05 11:50:21
 */
class BossNewBasePanel extends BaseTabView {
    protected c1: fairygui.Controller;
    protected imgPersonalbg: GLoader;
    protected imgSymbol: fairygui.GImage;
    protected txtBossname: fairygui.GTextField;
    protected txtLimit: fairygui.GTextField;
    protected btnChallange: fairygui.GButton;
    // protected btnShuoming: fairygui.GButton;
    protected listReward: List;
    protected listBossname: List;
    protected model_container: fairygui.GComponent;
    protected bossMc: RpgMovieClip;
    protected curMgBossInf: any;
    protected bossInfs: any[];
    protected lastIndex: number;
    protected isCanDelegate: boolean;
    protected curSelectItem: PersonnalBossItem;
    protected tips: string;
    public constructor() {
        super();
    }

    public initOptUI(): void {
        //---- script make start ----
        this.c1 = this.getController("c1");
        this.imgPersonalbg = this.getGObject("img_personalBg") as GLoader;
        this.imgPersonalbg.load(URLManager.getModuleImgUrl("personalBossBg.png", PackNameEnum.Boss));
        this.imgSymbol = this.getGObject("img_symbol").asImage;
        this.txtBossname = this.getGObject("txt_bossName").asTextField;
        this.txtLimit = this.getGObject("txt_limit").asTextField;
        this.model_container = this.getGObject("model_container").asCom;
        this.btnChallange = this.getGObject("btn_challange").asButton;
        // this.btnShuoming = this.getGObject("btn_shuoming").asButton;
        this.listReward = new List(this.getGObject("list_reward").asList, {isSelectStatus: false });
        this.listBossname = new List(this.getGObject("list_bossName").asList);

        this.btnChallange.addClickListener(this.onGUIBtnClick, this);
        // this.btnShuoming.addClickListener(this.onGUIBtnClick, this);
        this.listBossname.list.addEventListener(fairygui.ItemEvent.CLICK, this.onGUIListSelect, this);

        //---- script make end ----

    }
    protected setItemRenderer(index: number, item: fairygui.GObject): void {
        if (item["setData"] == undefined) return;
        item["setData"](this.bossInfs[index], index);
        let renderItem: PersonnalBossItem = <PersonnalBossItem>item;
        let isSelect: boolean = index == this.listBossname.selectedIndex;
        renderItem.setSelectStatus(isSelect);
        if (isSelect) {
            if (this.curSelectItem != renderItem) {
                this.changeCurSelect(false);
            }
            this.curSelectItem = renderItem;
        }
    }
    public updateAll(data?: any): void {
        //获取个人boss列表 更新list

        this.setBossInfs();
        //排序；存活(VIP>等级)＞未开启(VIP<等级(转生大于))＞死亡(VIP<等级)
        this.sortInfs();
        this.listBossname.setVirtual(this.bossInfs, this.setItemRenderer, this);
        this.changeCurSelect(false);
        if (this.bossInfs.length > 0) {
            let idx:number = -1;
            if (data && data.copyCode != null) {
                 idx = this.getCopyIndex(data.copyCode);                
            }
            if (data && data.bossCode != null) {
                 idx = this.getCopyIndex(data.bossCode,true);                
            }
            if(idx>-1){
                this.lastIndex = idx; 
            }else{
                this.lastIndex = Math.min(this.getDfIndex(), this.bossInfs.length - 1);
            }
            this.listBossname.selectedIndex = this.lastIndex;
            this.listBossname.scrollToView(this.lastIndex);
            this.curSelectItem = this.listBossname.selectedItem;
            this.changeCurSelect(true);
            let info: any = this.bossInfs[this.lastIndex];
            info.copyCode ? this.updateInf(info) : null;
        }

    }
    protected getDfIndex(): number {
        return 0;
    }
    protected setBossInfs(): void {
    }

    protected updateInf(mgBossInf: any): void {

    }

    protected updateReward(items: ItemData[]): void {
        // this.listReward.setVirtual(items);//数据量少的不用虚拟列表
        this.listReward.data = items;
    }

    protected setBossMc(bossInf): void {
        let resId: string = bossInf.modelId
        if (!this.bossMc) {
            this.bossMc = ObjectPool.pop('RpgMovieClip');
        }
        this.bossMc.setData(ResourcePathUtils.getRPGGameMonster(), resId, AvatarType.Monster, ELoaderPriority.UI_EFFECT); //9101002  9201203
        this.bossMc.gotoAction(Action.Stand,Dir.BottomLeft);//这里会重置mc的scale
        if(this._tabType != PanelTabType.PersonalBoss) {
            let modelScale:number = bossInf?ObjectUtil.getConfigVal(bossInf,"modelScale",0):0;
            modelScale>0?modelScale /= 100:modelScale = 1;
            this.bossMc.scaleX = modelScale*this.bossMc.scaleX;
            this.bossMc.scaleY = modelScale;    
            this.bossMc.x = 200;
            this.bossMc.y = 400;
        }
        else {
            this.bossMc.x = 0;
            this.bossMc.y = 0;    
            if(bossInf.code == 2001018 || bossInf.code == 2001022) {
                this.bossMc.scaleX = 1.2 * this.bossMc.scaleX;
                this.bossMc.scaleY = 1.2;
            }   
        }
        this.model_container.displayListContainer.addChild(this.bossMc);
    }
    protected changeCurSelect(value: boolean): void {
        if (this.curSelectItem) {
            this.curSelectItem.setSelectStatus(value);
        }
    }

    protected sortInfs(): void {
        this.bossInfs.sort(function (infA: any, infB: any): number {
            let ret: number = 0;
            let isOpenA: boolean = CacheManager.bossNew.isPersonalOpen(infA)
            let isOpenB: boolean = CacheManager.bossNew.isPersonalOpen(infB);

            let isLiveA: boolean = CacheManager.copy.isEnterNumOk(infA.copyCode);
            let isLiveB: boolean = CacheManager.copy.isEnterNumOk(infB.copyCode);

            let bossCfgA: any = ConfigManager.boss.getByPk(infA.bossCode);
            let bossCfgB: any = ConfigManager.boss.getByPk(infB.bossCode);

            let privilegeCardLimitA:number = ObjectUtil.getConfigVal(infA, "privilegeCardLimit"); //特权月卡
            let privilegeCardLimitB:number = ObjectUtil.getConfigVal(infB, "privilegeCardLimit");

		    let goldCardLimitA:number = ObjectUtil.getConfigVal(infA, "goldCardLimit"); //元宝月卡
		    let goldCardLimitB:number = ObjectUtil.getConfigVal(infB, "goldCardLimit");

            let freeVipA: number = ObjectUtil.getConfigVal(infA, "freeVip");
            let freeVipB: number = ObjectUtil.getConfigVal(infB, "freeVip");

            let roleStateA: number = ObjectUtil.getConfigVal(infA, "roleState");
            let roleStateB: number = ObjectUtil.getConfigVal(infB, "roleState");

            let levelA: number = ObjectUtil.getConfigVal(bossCfgA, "level");
            let levelB: number = ObjectUtil.getConfigVal(bossCfgB, "level");

            function getRetByVipAndLevel(dirVal: number): number {
                // dirVal==1 表示VIP的在前面
                let ret: number = 0;
                if(privilegeCardLimitA!=privilegeCardLimitB){ //特权月卡
                    ret = privilegeCardLimitA > privilegeCardLimitB ? -1 : 1;
                    ret *= dirVal;
                }else if(goldCardLimitA!=goldCardLimitB){ //元宝月卡
                    ret = goldCardLimitA > goldCardLimitB ? -1 : 1;
                    ret *= dirVal;
                }else if (freeVipA != freeVipB) { //判断VIP
                    ret = freeVipA > freeVipB ? -1 : 1;
                    ret *= dirVal;
                } else {
                    //判断等级
                    if (roleStateA != roleStateB) {//优先判断转生
                        ret = roleStateA > roleStateB ? 1 : -1;
                    } else {
                        //转生相同 判断等级
                        if (levelA != levelB) {
                            ret = levelA > levelB ? 1 : -1;
                        }
                    }
                }
                return ret;
            }

            if (isLiveA == isLiveB) {//都存活或都死亡

                if (isLiveA) { //都存活
                    if (isOpenA == isOpenB) {  //都开启或都不开启    
                        ret = isOpenA ? getRetByVipAndLevel(1) : getRetByVipAndLevel(-1);
                    } else if (isOpenA && !isOpenB) {
                        ret = -1;
                    } else if (!isOpenA && isOpenB) {
                        ret = 1;
                    }

                } else { //都死亡;肯定都开启了
                    ret = getRetByVipAndLevel(-1);
                }

            } else {
                if (isLiveA && !isLiveB) {
                    ret = -1;
                } else {
                    ret = 1;
                }
            }
            return ret;
        });
    }
    protected handlerChallange(): void {

    }
    protected onGUIBtnClick(e: egret.TouchEvent): void {
        var btn: any = e.target;
        switch (btn) {
            case this.btnChallange:
                this.handlerChallange();
                break;
            // case this.btnShuoming:
            //     EventManager.dispatch(UIEventEnum.BossExplainShow, { desc: this.tips });
            //     break;
        }
    }

    protected onGUIListSelect(e: fairygui.ItemEvent): void {

    }

    protected getCopyIndex(code: number,isBossCode:boolean = false): number {
        for (let i: number = 0; i < this.bossInfs.length; i++) {
            if(isBossCode) {
                if (this.bossInfs[i].bossCode == code) {
                    return i;
                }
            }
            else {
                if (this.bossInfs[i].copyCode == code) {
                    return i;
                }
            }
        }
        return -1;
    }

}