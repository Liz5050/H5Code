/**
 * 流畅自动优化
 * @author Chris
 */
class FluencyCheckController {
    /** 低帧频max*/
    private static SLOW_FRAMERATE_MAX:number = 15;
    /** 低帧频min*/
    private static SLOW_FRAMERATE_MIN:number = 3;

    private static RATE_CHECK_LEN:number = 40;

    private rateList:number[] = [];

    public constructor(){
        App.TimerManager.doTimer(2000, 0, this.stepCheck, this);
    }

    private stepCheck():void {
        let curFrameRate:number = App.TimerManager.frameRate;

        if (this.rateList.length > FluencyCheckController.RATE_CHECK_LEN) {
            this.rateList.shift();
        }

        this.rateList.push(curFrameRate);

        let aveFr:number;
        if (this.rateList.length >= FluencyCheckController.RATE_CHECK_LEN
            && (aveFr = aveFramerate(this.rateList)) >= FluencyCheckController.SLOW_FRAMERATE_MIN
            && aveFr < FluencyCheckController.SLOW_FRAMERATE_MAX) {//计算
            let sysSet:SysSetCache = CacheManager.sysSet;
            if (sysSet.getValue(LocalEventEnum[LocalEventEnum.HideOther]) == false) {
                sysSet.setValue(LocalEventEnum[LocalEventEnum.HideOther], true, true, -1, false);
                Log.trace(Log.RPG, "帧数太低！！进入自动屏蔽等级1");
            } else if (sysSet.getValue(LocalEventEnum[LocalEventEnum.HideOtherEffect]) == false) {
                sysSet.setValue(LocalEventEnum[LocalEventEnum.HideOtherEffect], true, true, -1, false);
                Log.trace(Log.RPG, "帧数太低！！进入自动屏蔽等级2");
            } else if (sysSet.getValue(LocalEventEnum[LocalEventEnum.HideMonster]) == false) {
                sysSet.setValue(LocalEventEnum[LocalEventEnum.NoShake], true, true, -1, false);
                sysSet.setValue(LocalEventEnum[LocalEventEnum.HideMonster], true, true, -1, false);
                // sysSet.setValue(LocalEventEnum[LocalEventEnum.HideTitle], true);
                Log.trace(Log.RPG, "帧数太低！！进入自动屏蔽等级3");
            }
            this.rateList.length = 0;
        }

        function aveFramerate(list:number[]):number {
            let ave:number = 0;
            for (let rate of list) {
                ave += rate;
            }
            ave /= list.length;//console.log("ave=", ave)
            return ave;
        }
    }
}