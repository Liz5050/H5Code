/**
 * 神兽入侵胜利结算
 * @author zhh
 * @time 2018-12-10 16:23:22
 */
class WindowCrossGuildBOSSResult extends BaseWindow {
    private c1:fairygui.Controller;
    private c2:fairygui.Controller;
    private loader:GLoader;
    private loaderBg:GLoader;
    private txtName:fairygui.GTextField;
    private txtReward:fairygui.GRichTextField;
    private txtTips:fairygui.GRichTextField;
    private listReward0:List;
    private listReward1:List;
    private leftTime:number;
    private curTime:number;

	private btnClose:fairygui.GButton;

	public constructor() {
		super(PackNameEnum.CopyResult,"WindowCrossGuildBOSSResult")
		this.isShowCloseObj = true;
	}
	public initOptUI():void{
        //---- script make start ----
        this.c1 = this.getController("c1");
        this.c2 = this.getController("c2");
        this.loader = <GLoader>this.getGObject("loader");
        this.txtName = this.getGObject("txt_name").asTextField;
        this.txtReward = this.getGObject("txt_reward").asRichTextField;
        this.txtTips = this.getGObject("txt_tips").asRichTextField;
        this.listReward0 = new List(this.getGObject("list_reward0").asList);
        this.listReward1 = new List(this.getGObject("list_reward1").asList);
		this.loaderBg = <GLoader>this.frame.getChild("loader_result_Bg");
        //---- script make end ----
		this.loaderBg.load(URLManager.getModuleImgUrl("copy_result_win.png",PackNameEnum.Copy));
		this.btnClose = <fairygui.GButton>this.closeObj;
	}

	

	public updateAll(data?:any):void {
		let isMyOwner:boolean = CacheManager.guildNew.isMyGuild(data.ownerMiniPlayer.guildId_I);//和归属者同仙盟即系归属奖励
        this.c1.selectedIndex = isMyOwner ? 0 : 1;		
		//显示归属者名字和仙盟名
		this.txtName.text = data.ownerMiniPlayer.name_S+`[${data.ownerMiniPlayer.guildName_S}]`;
		this.updateRewardList(data.guildRewards,0); //刷新仙盟奖励
		this.updateRewardList(data.rewards,1); //刷新个人奖励		        
		this.loader.load(URLManager.getPlayerHead(CareerUtil.getBaseCareer(data.ownerMiniPlayer.career_SH)));
		this.leftTime = this.getLeftTime();
		this.curTime = egret.getTimer();
		this.txtTips.text = "(" + HtmlUtil.html(this.leftTime + "秒",Color.Green) + "后自动关闭)";
		if(!App.TimerManager.isExists(this.onTimeUpdate,this)){
			App.TimerManager.doTimer(1000,0,this.onTimeUpdate,this);
		}				
	}

	private updateRewardList(rewardsInfo:any,idx:number):void{
		let items:ItemData[] = this.getRewardList(rewardsInfo);			
		items.sort(this.itemsSort);
		let k:string = 'listReward'+idx;
		this[k].setVirtual(items);
		if(items.length > 0) this[k].scrollToView(0);
	}

	private getRewardList(rewardsInfo:any):ItemData[]{
		let items:ItemData[] = [];
		if(rewardsInfo && rewardsInfo.data.length>0){
			let rewards:any[] = rewardsInfo.data;
			for(let i:number = 0; i < rewards.length; i++) {
				let str:string = rewards[i].type_I + "," + rewards[i].code_I + "," + Number(rewards[i].num_L64);
				let item:ItemData = RewardUtil.getReward(str);
				items.push(item);
			}

		}
		return items;
	}
	private itemsSort(item1:ItemData,item2:ItemData):number {
		if(item1.getCategory() == ECategory.ECategoryProp && item2.getCategory() != ECategory.ECategoryProp) return -1;
		if(item1.getCategory() != ECategory.ECategoryProp && item2.getCategory() == ECategory.ECategoryProp) return 1;
		if(item1.getCategory() == ECategory.ECategoryMaterial && item2.getCategory() != ECategory.ECategoryMaterial) return -1;
		if(item1.getCategory() != ECategory.ECategoryMaterial && item2.getCategory() == ECategory.ECategoryMaterial) return 1;
		if(item1.getColor() > item2.getColor()) return -1;
		if(item1.getColor() < item2.getColor()) return 1;
		if(item1.getLevel() > item2.getLevel()) return -1;
		if(item1.getLevel() < item2.getLevel()) return 1;
		return 0;
	}
	private onTimeUpdate():void {
		let time:number = egret.getTimer();
		this.leftTime -= Math.round((time - this.curTime)/1000);
		if(this.leftTime < 0) {
			this.hide();
			return;
		}
		this.txtTips.text = "(" + HtmlUtil.html(this.leftTime + "秒",Color.Green) + "后自动关闭)";
		if(this.btnClose){
			this.btnClose.text = `领取奖励(${HtmlUtil.colorSubstitude(LangCommon.L48, this.leftTime)})`;
		}
		this.curTime = time;
	}

	private getLeftTime():number {
        let copyInf:any = ConfigManager.copy.getByPk(CacheManager.copy.curCopyCode);
        return copyInf && CopyUtils.getCopyResultSec(copyInf, true) || 10;
	}
    public hide():void {
		App.TimerManager.remove(this.onTimeUpdate,this);
		super.hide();
		if(CacheManager.copy.isInCopy){
			EventManager.dispatch(LocalEventEnum.CopyReqExit);
		}
    }


}