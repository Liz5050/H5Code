class TeamConfirmWindow extends BaseWindow
{
	private memberList:List;
	private timeProgress:UIProgressBar;
	private agreeBtn:fairygui.GButton;
	private rejectBtn:fairygui.GButton;

	private agreeColor:number;
	private rejectColor:number;
	public constructor() 
	{
		super(PackNameEnum.Team,"TeamConfirmWindow");
	}

	public initOptUI():void
	{
		this.memberList = new List(this.getGObject("list_member").asList);

		this.timeProgress = this.getGObject("time_progressBar") as UIProgressBar;
		this.timeProgress.setStyle(URLManager.getPackResUrl(PackNameEnum.Team,"time_progressBar"),URLManager.getPackResUrl(PackNameEnum.Team,"time_progressBg"),237,30,4,4);
		this.timeProgress.labelSize = 20;
		this.timeProgress.labelType = BarLabelType.Only_Current;
		this.timeProgress.textColor = 0xff0000;
		this.timeProgress.setWord("","秒");
		this.timeProgress.setValue(10,10);

		this.agreeBtn = this.getGObject("btn_agree").asButton;
		this.agreeBtn.addClickListener(this.onAgreeEnterHandler,this);
		this.agreeColor = this.agreeBtn.titleColor;

		this.rejectBtn = this.getGObject("btn_refuse").asButton;
		this.rejectBtn.addClickListener(this.onRejectEnterHandler,this);
		this.rejectColor = this.agreeBtn.titleColor;
	}

	/**
	 * @param data SCopyCheckStatus
	 * int copyCode
	 * short leftSec;
	 * MapGroupCheckStatus status;
	 */
	public updateAll(data:any):void
	{
		let _leftSec:number = data.leftSec_SH;
		this.timeProgress.addEventListener(UIProgressBar.PROPGRESS_COMPLETE,this.onCompleteHandler,this);
		this.timeProgress.setValue(0,_leftSec,true,true,_leftSec * 1000);

		this.memberList.data = CacheManager.team.teamMembers;
		let _isCaptain:boolean = CacheManager.team.captainIsMe;

		this.agreeBtn.enabled = this.rejectBtn.enabled = !_isCaptain;
		if(_isCaptain) 
		{
			this.agreeBtn.titleColor = this.rejectBtn.titleColor = Color.White;
		}
		else 
		{
			this.agreeBtn.titleColor = this.agreeColor;
			this.rejectBtn.titleColor = this.rejectColor;
		}
	}

	public updateCheckEnterState(status:any):void
	{
		let _membersId:string[] = CacheManager.team.teamMembersId;
		for(let i:number = 0; i < status.key.length; i++)
		{
			let _entityUid:string = EntityUtil.getEntityId(status.key[i]);
			let _itemIndex:number = _membersId.indexOf(_entityUid);
			if(_itemIndex != -1)
			{
				let _item:ConfirmPlayerIcon = this.memberList.list.getChildAt(_itemIndex) as ConfirmPlayerIcon;
				if(_item) 
				{
					_item.setConfirmState(status.value_B[i]);
				}
			}
		}
		if(status.key.length == _membersId.length ||
			status.value_B.indexOf(false) != -1)
		{
			this.hide();
		}
	}

	private onCompleteHandler():void
	{
		//同意进入
		this.onAgreeEnterHandler();
	}

	private onAgreeEnterHandler():void
	{
		this.agreeBtn.enabled = this.rejectBtn.enabled = false;
		this.agreeBtn.titleColor = this.rejectBtn.titleColor = Color.White;
		EventManager.dispatch(LocalEventEnum.TeamEnterCopyCheck,true);
	}

	private onRejectEnterHandler():void
	{
		this.agreeBtn.enabled = this.rejectBtn.enabled = false;
		this.agreeBtn.titleColor = this.rejectBtn.titleColor = Color.White;
		EventManager.dispatch(LocalEventEnum.TeamEnterCopyCheck,false);
	}

	public hide():void
	{
		EventManager.dispatch(LocalEventEnum.TeamEnterCopyCheck,false);
		this.timeProgress.removeEventListener(UIProgressBar.PROPGRESS_COMPLETE,this.onCompleteHandler,this);
		this.timeProgress.setValue(10,10);
		super.hide();
	}
}