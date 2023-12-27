/**
 * 增加副本次数要弹出的窗口
 */
class CopyAddTimeWindow extends CopyBasePopupWin {
	
	private txt_explain:fairygui.GTextField;
	private txt_vipLv1:fairygui.GTextField;
	private txt_time1:fairygui.GTextField;
	private txt_vipLv2:fairygui.GTextField;
	private txt_time2:fairygui.GTextField;
	private groupCur:fairygui.GGroup;
	private groupNext:fairygui.GGroup;
	private cfgInf:any;
	private copyType:number;
	private copyCode:number;
	public constructor() {
		super(PackNameEnum.Copy,"WindowCopyprompt");
	}

	public initOptUI():void{
		super.initOptUI();
		this.txt_explain = this.getGObject("txt_explain").asTextField;
		this.txt_vipLv1 = this.getGObject("txt_vipLv1").asTextField;
		this.txt_time1 = this.getGObject("txt_time1").asTextField;
		this.txt_vipLv2 = this.getGObject("txt_vipLv2").asTextField;
		this.txt_time2 = this.getGObject("txt_time2").asTextField;

		this.groupCur = this.getGObject("group_current").asGroup;
		this.groupNext = this.getGObject("group_after").asGroup;

		
	}

	public updateAll(data:any=null):void{
		this.copyCode = data.copyCode;
		var copyInf:any = ConfigManager.copy.getByPk(this.copyCode);
		this.copyType = copyInf.copyType;
		var vipLv:number = CacheManager.vip.vipLevel;
		var pk:string = this.copyType+","+vipLv;
		this.cfgInf = ConfigManager.copyAddNum.getByPk(pk);
		var addInf:any = CacheManager.copy.getAddNumInf(this.copyCode);
		this.txt_vipLv1.text = ""+vipLv;
		var curAddNum:number = 0;
		if(!this.cfgInf.maxAddNum){
			this.txt_time1.text = "0次";
		}else{
			curAddNum = this.cfgInf.maxAddNum;
			this.txt_time1.text = addInf.addNum+"/"+this.cfgInf.maxAddNum+"次";
		}
		this.txt_explain.text = App.StringUtils.substitude(LangCopyHall.L_ADD_COPY_NUM,this.cfgInf.costNum);
		if(vipLv<VipCache.Max_lv){
			this.groupCur.x = 77;			
			this.groupNext.visible = true;
			var nextLv:number = vipLv+1;
			var nextAdd:number = curAddNum;
			while(nextLv<=VipCache.Max_lv){
				pk = this.copyType+","+nextLv;
				var nextInf:any = ConfigManager.copyAddNum.getByPk(pk);
				if(nextInf.maxAddNum && nextInf.maxAddNum > curAddNum){
					nextAdd = nextInf.maxAddNum;
					break;
				}else{
					nextLv++;
				}
			}			
			nextLv = Math.min(VipCache.Max_lv,nextLv);
			this.txt_vipLv2.text = ""+nextLv;
			this.txt_time2.text = nextAdd+"次";
		}else{
			this.groupNext.visible = false;
			this.groupCur.x = this.width - this.groupCur.width >> 1;
		}
	}
	protected onBtnClick(isOk:boolean): void {
		super.onBtnClick(isOk);
		if(isOk){			
			if(this.cfgInf.maxAddNum<0){
				Tip.showTip(LangCopyHall.L_VIP_NOT_BUY);
			}else if(MoneyUtil.checkEnough(this.cfgInf.costUnit,this.cfgInf.costNum)){
				if(!CacheManager.copy.isAddNumLimit(this.copyCode)){
					ProxyManager.copy.addCopyNum(this.copyType);
				}else{
					Tip.showTip(LangCopyHall.L4);
				}					
			}
			this.hide();
		}		
	}

}