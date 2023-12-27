class PunchLeadCopyView extends BaseCopyPanel {

	private _showGuideFlag:boolean = true;

	private _summonView:PunchLeadSummonView = null;

	public constructor(copyInfo:any) {
		super(copyInfo,"PunchLeadCopyView");
		this.isCenter = true;
	}

	public initOptUI():void {
		super.initOptUI();

		this.btn_exit.visible = false;
	}

	public onShow(): void {
		super.onShow();

		App.MessageCenter.addListener(EGateCommand[EGateCommand.ECmdGatePunchLeadCopyCanSummon], this.leadSummon, this);

		this._showGuideFlag = true;
		this.checkHejiState();
	}

	public onHide():void {
		super.onHide();

		App.MessageCenter.removeListener(EGateCommand[EGateCommand.ECmdGatePunchLeadCopyCanSummon], this.leadSummon, this);

		this.hideSummonView();
	}

	/**模块显示时开启的监听 */
	protected addListenerOnShow(): void {
		this.addListen1(LocalEventEnum.HomeHejiOk, this.checkHejiState, this);
		this.addListen1(LocalEventEnum.PunchLeadCopyResetFlag, this.resetFlag, this);
		this.addListen1(LocalEventEnum.MonsterDied, this.onMonsterDied, this);
		this.addListen1(LocalEventEnum.ScenePlayerMirrorAdd, this.onScenePlayerMirrorAdd, this);
	}

	private resetFlag():void {
		this._showGuideFlag = true;
	}

	private checkHejiState():void {
		if (CacheManager.guide.isHejiOk && this._showGuideFlag) {
			this._showGuideFlag = false;
			EventManager.dispatch(LocalEventEnum.GuideHeji, {"key":"", "desc":"点击释放必杀"});
		}
	}

	private showSummonView():void {
		if(this._summonView == null) {
			this._summonView = new PunchLeadSummonView();
		}
		this._summonView.show();
	}

	private hideSummonView():void {
		if(this._summonView != null) {
			this._summonView.hide();
		}
	}

	private leadSummon():void {
		this.showSummonView();
	}

	private onMonsterDied():void {
		EventManager.dispatch(LocalEventEnum.GuideHejiHide);
		App.TimerManager.doDelay(2000, this.hideMirrorPlayer, this);
	}

	private hideMirrorPlayer():void {
		if(!CacheManager.copy.isInCopyByType(ECopyType.ECopyPunchLead)) {
			return;
		}

		let roleEntityId = CacheManager.role.getSEntityId();
		let entityId:any = {
			"id_I":roleEntityId.id_I,
			"type_BY":EEntityType.EEntityTypePlayerMirror,
			"typeEx_SH":roleEntityId.typeEx_SH,
			"typeEx2_BY":roleEntityId.typeEx2_BY,
		};
		let list:RpgGameObject[] = CacheManager.map.getOtherPlayers(entityId);

		for(let i:number = 0; i < list.length; i++) {
			if(list[i].entityInfo) {
				let _avatarComponent:AvatarComponent = list[i].getComponent(ComponentType.Avatar) as AvatarComponent;
				if(_avatarComponent) {
					let _tweenLayer:egret.DisplayObjectContainer = _avatarComponent.mainLayer;
					egret.Tween.removeTweens(_tweenLayer);
					egret.Tween.get(_tweenLayer).to({alpha:0},2500,egret.Ease.circOut)
					.call(function (){
						},this);
				}
			}
		}

	}

	private onScenePlayerMirrorAdd(entity:RpgGameObject):void {
		let toX:number = entity.gridPoint.x;
		let toY:number = entity.gridPoint.y;
		let fromX:number = toX - 4;
		let fromY:number = toY - 4;

		App.TimerManager.doDelay(0, ()=>{

			entity.resetPointData(fromX, fromY);

			let node:PathNode = new PathNode(toX, toY);
	        node.isJump = true;
	        let path: PathNode[] = [node];
	        entity.path = path;

		}, this);
	}

}