/**
 * 跨服玩法主控制器
 * @author Chris
 */
class CrossController extends BaseController {
    private module: CrossModule;
    private bossGuildRewardWin:CrossBossGuildRewardWin;

    // private crossBossCtrl:CrossBossController;

    public constructor() {
        super(ModuleEnum.Cross);
    }

    public initView(): BaseModule {
        this.module = new CrossModule();
        // this.crossBossCtrl.setModule(this.module);
        return this.module;
    }

    public addListenerOnInit(): void {
        // this.crossBossCtrl = new CrossBossController();

        this.addMsgListener(ECmdGame[ECmdGame.ECmdGamePlayerGuildBossIntruderInfo],this.onCrossGuildBossInfo,this);
        this.addMsgListener(ECmdGame[ECmdGame.ECmdGameGetCachedDropLogMsgs],this.onCrossDropLog,this);
        this.addMsgListener(ECmdGame[ECmdGame.ECmdGameNewDropLogNotice],this.onCrossDropLogUpdate,this);

        this.addListen0(LocalEventEnum.CrossBossGuildRewardWin,this.onShowGuildBossRewardWin,this);
        this.addListen0(LocalEventEnum.CrossReqGuildBoss,this.onReqGuildBoss,this);
        this.addListen0(LocalEventEnum.CrossReqDropLog,this.onReqDropLog,this);
    }

    public addListenerOnShow():void {
        // this.crossBossCtrl.addListenerOnShow();
    }

    private onShowGuildBossRewardWin(data:any):void{
        if(!this.bossGuildRewardWin){
            this.bossGuildRewardWin = new CrossBossGuildRewardWin();
        }
        this.bossGuildRewardWin.show(data);
    }

    /**跨服掉落记录 S2C_SGetCachedDropLogMsgs */
    private onCrossDropLog(data:any):void{
        CacheManager.crossBoss.setCrossDropLog(data);
        if(this.isShow){
            this.module.updateDropLog();
        }
    }

    /**SInt */
    private onCrossDropLogUpdate(data:any):void{        
        CacheManager.crossBoss.setDropLogUpdStatus(data.value_I);
    }

    private onCrossGuildBossInfo(data:any):void{
        CacheManager.crossBoss.curCrossGuildBoss = data.intSeq.data_I[0];
        EventManager.dispatch(LocalEventEnum.CrossTips);
    }

    private onReqGuildBoss(copyCode:number,mapId:number):void{
        ProxyManager.boss.reqCrossGuildBoss(copyCode,mapId);
    }

    private onReqDropLog(type:number):void{
        ProxyManager.boss.reqDropLog(type);
    }

}