/**
 * 成员列表
 * @author zhh
 * @time 2018-07-18 17:14:10
 */
class GuildNewMemberPanel extends BaseTabView{
    private txtPos:fairygui.GRichTextField;
    private txtContri:fairygui.GRichTextField;
    private btnExit:fairygui.GButton;
    private listMember:List;

	public constructor() {
		super();
	}

	protected initOptUI():void{
        //---- script make start ----
        this.txtPos = this.getGObject("txt_pos").asRichTextField;
        this.txtContri = this.getGObject("txt_contri").asRichTextField;
        this.btnExit = this.getGObject("btn_exit").asButton;
        this.listMember = new List(this.getGObject("list_member").asList);

        this.btnExit.addClickListener(this.onGUIBtnClick, this);
        this.listMember.list.addEventListener(fairygui.ItemEvent.CLICK,this.onGUIListSelect,this);
        //---- script make end ----


	}
    protected onGUIBtnClick(e:egret.TouchEvent):void{
        var btn: any = e.target;
        switch (btn) {
            case this.btnExit:
                EventManager.dispatch(LocalEventEnum.GuildNewReqExit);
                break;

        }
    }
    protected onGUIListSelect(e:fairygui.ItemEvent):void{
        var item:ListRenderer = <ListRenderer>e.itemObject;
        if(item){
            
        }

        var list: any = e.target;
        switch (list) {
            case this.listMember.list:
                break;
        }
               
    }
    public updateAll(data?:any):void{
        let clr1:string = "#f3f232";
        let clr2:string = "#0df14b";
        //this.txtContri.text = "历史贡献："+HtmlUtil.html(""+CacheManager.guildNew.playerGuildInfo.contribution_I,clr2);
        let posName:string = CacheManager.guildNew.getPosName(CacheManager.guildNew.playerGuildInfo.position_BY);
        this.txtPos.text = "我的职位："+HtmlUtil.html(posName,clr1);
    }
    public updateMember(data:any[]):void{
        data.sort(function (a:any,b:any):number{
            if(a.position_I>b.position_I){
                return -1;
            }else if(a.position_I<b.position_I){
                return 1;
            }else{
                let warfare_L64A:number = BitUtils.makeLong64(a.miniPlayer.warfare_L64.low,a.miniPlayer.warfare_L64.high);
                let warfare_L64B:number = BitUtils.makeLong64(b.miniPlayer.warfare_L64.low,b.miniPlayer.warfare_L64.high);
                if(warfare_L64A>warfare_L64B){
                    return -1;
                }else if(warfare_L64A<warfare_L64B){
                    return 1;
                }
            }
            return 0;
        });        
        
        let myEntityId:any = CacheManager.role.entityInfo.entityId;
        for(let info of data){
            if(EntityUtil.isSame(info.miniPlayer.entityId,myEntityId)){
                let clr2:string = "#0df14b";
                this.txtContri.text = "历史贡献："+HtmlUtil.html(""+info.totalContribution_I,clr2);
                break;
            }            
        }
        this.listMember.setVirtual(data);
    }
    /**
	 * 销毁函数
	 */
	public destroy():void{
		super.destroy();
	}

}