class SceneCollectBarView extends fairygui.GComponent {
	private c1: fairygui.Controller;
	private collectBar:UIProgressBar;

	private gStartCollect:boolean = false;
	public constructor() {
		super();
	}

	protected constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.collectBar = this.getChild("progressBar") as UIProgressBar;
		this.collectBar.setStyle(URLManager.getSceneIcon("progressBar_3"), URLManager.getSceneIcon("bg_2"), 246, 38, 22, 12.5,UIProgressBarType.Mask);
		this.collectBar.showEffect(URLManager.getSceneIcon("barEffect_1"),27);
		this.collectBar.setValue(0,1);
		this.c1 = this.getController("c1");
	}

	public startCollect(data:any):void {
		let duration: number = data.duration * 1000;
		let king:MainPlayer = CacheManager.king.leaderEntity;
		if(!king || !king.isCollecting()) {
			this.stopCollect();
			return;
		}

		if(!this.gStartCollect) {
            this.gStartCollect = true;
            this.collectBar.addEventListener(UIProgressBar.PROPGRESS_COMPLETE,this.onCompleteHandler,this);
            this.collectBar.setValue(duration,duration,true,true,duration);
        }

		let gameTipLayer:egret.DisplayObjectContainer = ControllerManager.rpgGame.view.getGameTipsLayer();
		this.x = king.x - 123;
		this.y = king.y + 30;
		gameTipLayer.addChild(this.displayObject);
	}

	/**终止采集 */
    public stopCollect():void {
		this.collectEnd();
		ProxyManager.operation.abortCollect();
        CacheManager.king.collectEntity = null;
    }

	/**采集完成 */
    private onCompleteHandler(evt:egret.Event):void {
        this.collectEnd();
		let roleIndex:number = CacheManager.king.leaderIndex;
        ProxyManager.operation.endCollect(CacheManager.king.collectEntity.entityInfo.entityId,roleIndex);
		CacheManager.king.collectEntity = null;
        CacheManager.king.leaderEntity.currentState = EntityModelStatus.Stand;
    } 

	/**结束采集 */
    private collectEnd():void {
        this.collectBar.removeEventListener(UIProgressBar.PROPGRESS_COMPLETE,this.onCompleteHandler,this);
        this.collectBar.setValue(0,1);
        this.gStartCollect = false;
		this.hide();
    }

	public get isCollecting():boolean {
		return this.gStartCollect;
	}

	public hide():void {
		App.DisplayUtils.removeFromParent(this.displayObject);
	}

	/**是否显示解救标签 */
	public set isRescue(rescue: boolean) {
		this.c1.selectedIndex = rescue ? 1 : 0;
	}
}