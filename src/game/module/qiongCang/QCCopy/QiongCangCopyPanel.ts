/**
 * 穹苍副本爬塔界面
 * @author zhh
 * @time 2018-09-29 16:26:00
 */
class QiongCangCopyPanel extends BaseTabView{
    private loaderBg:GLoader;
    private txtCount:fairygui.GTextField;
    private btnGo:fairygui.GButton;
    private btnRank:fairygui.GButton;
    private listFloor:List;
    private listRank:List;

	public constructor() {
		super();
	}

	protected initOptUI():void{
        //---- script make start ----
        this.loaderBg = <GLoader>this.getGObject("loader_bg");
        this.txtCount = this.getGObject("txt_count").asTextField;
        this.btnGo = this.getGObject("btn_go").asButton;
        this.btnRank = this.getGObject("btn_rank").asButton;
        this.listFloor = new List(this.getGObject("list_floor").asList);
        this.listRank = new List(this.getGObject("list_rank").asList);

        this.btnGo.addClickListener(this.onGUIBtnClick, this);
        this.btnRank.addClickListener(this.onGUIBtnClick, this);
        //---- script make end ----
        this.loaderBg.load(URLManager.getModuleImgUrl("qc_copy.jpg",PackNameEnum.QiongCang));
        
	}

	public updateAll(data?:any):void{
        let ln:number = CacheManager.copy.getEnterLeftNum(CopyEnum.CopyQC);
        this.txtCount.text = LangCopyHall.L32 + ln;
        let floors:any[] = CacheManager.qcCopy.floorList.concat();
        let min:number = 1;
        let idx:number = 0;
        if(floors.length<min){
            for(let i:number=0;i<min;i++){
                if(!floors[i]){
                    floors.unshift({floor_I:i+1,star_I:-1,sec_I:0});
                }
            }           
        }else if(CacheManager.qcCopy.isMaxStar(floors[0])){
            let next:number = floors[0].floor_I+1;
            let floorInfo:any = ConfigManager.copy.getQCCopyInfo(next);
            if(floorInfo){
                floors.unshift({floor_I:next,star_I:-1,sec_I:0});
            }     
            
        }
        for(let i:number=floors.length-1;i>=0;i--){
            if(!CacheManager.qcCopy.isMaxStar(floors[i])){
                idx = i;
                break;
            }
        }        
        this.listFloor.setVirtual(floors);
        this.listFloor.scrollToView(idx,false,false);
        this.listFloor.selectedIndex = idx;
        CommonUtils.setBtnTips(this.btnGo,CacheManager.qcCopy.checkTips());
	}

    public updateRank(data:any[]):void{
        data = data.slice(0,3);
        this.listRank.setVirtual(data);
    }

    protected onGUIBtnClick(e:egret.TouchEvent):void{
        var btn: any = e.target;
        switch (btn) {
            case this.btnGo:
                let ln:number = CacheManager.copy.getEnterLeftNum(CopyEnum.CopyQC);
                let data:any = this.listFloor.data[this.listFloor.selectedIndex];    
                if(ln){                                
                    ProxyManager.copy.enterQC(CopyEnum.CopyQC,data.floor_I);
                }else{
                    let count:number = CacheManager.pack.propCache.getItemCountByCode2(ItemCodeConst.CopyDreamland);
                    if(count>0){
                        let item:ItemData = new ItemData(ItemCodeConst.CopyDreamland);                        
                        Alert.alert(`确定使用1个${item.getName(true)}增加挑战次数?`,()=>{
                            EventManager.dispatch(LocalEventEnum.PackUseByCode,item,1);
                            ProxyManager.copy.enterQC(CopyEnum.CopyQC,data.floor_I);
                        });
                    }else{
                        Tip.showLeftTip("挑战次数不足");
                    }
                }                
                break;
            case this.btnRank:
                EventManager.dispatch(LocalEventEnum.CopyShowQCRank);
                break;
        }
        
    } 
	
    /**
	 * 销毁函数
	 */
	public destroy():void{
		super.destroy();
	}

}