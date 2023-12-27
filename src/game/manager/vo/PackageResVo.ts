class PackageResVo {
    public resCfs:any[] = [];
    public packageName:string;

    public constructor(){
    }

    public addRes(resCfg:any):void {
        this.resCfs.push(resCfg);
    }

    public get resLength():number {
        return this.resCfs.length;
    }

    public isComplete():boolean {
        if (this.resCfs.length) {
            for (let cfg of this.resCfs) {
                if (!App.LoaderManager.hasUrlRes(cfg.name)) return false;
            }
            return true;
        }
        return false;
    }

}