class CertificationProxy extends BaseProxy {

    public sendCertification(name : string, id:string) {
        this.send("ECmdGameCommitIssm",{ "name": name , "card": id});
    }

    public getGift() {
        this.send("ECmdGameIssmGetReward", { });
    }

    //用来过验证的假方法，平台验证已经通过后使用
    //        张三 210300199801018670
    public sendCertificationFake() {
        this.send("ECmdGameCommitIssm",{ "name": "张三" , "card": "210300199801018670"});
        CacheManager.certification.isSendSm = true;
    }
} 