enum ELoaderType
{
    RES,    //配置表资源
    URL,    //外部URL
    GROUP   //配置表组
}

class LoaderVo {
    /*资源名称、组名或url路径*/
    public name: string;
    /*资源key，对应resConfig中的resKey*/
    public key: string;
    /*加载类型*/
    public loadType: ELoaderType;
    /*加载优先级*/
    public priority: number;
    /*添加到加载队列的时间(date)*/
    public addLoadDate: number;
    /*添加到加载队列的时间(time)*/
    public addLoadTime: number;
    /*开始加载的时间(date)*/
    private _startLoadDate: number;
    /*开始加载的时间(time)*/
    public startLoadTime: number;
    /*完成加载的时间(date)*/
    private _compLoadDate: number;
    /*完成加载的时间(time)*/
    public compLoadTime: number;
    /*失败加载的时间(date)*/
    private _errorLoadDate: number;
    /*失败加载的时间(time)*/
    public errorLoadTime: number;

    public constructor(name: string, loadType: ELoaderType, priority: ELoaderPriority, addLoadDate:number, key:string = null) {
        this.name = name;
        this.loadType = loadType;
        this.priority = priority;
        this.addLoadDate = addLoadDate;
        this.addLoadTime = egret.getTimer();
        this.key = key;
    }

    public log():string {
        return ` url->   ${this.name}`
        + `\n       totalCost->    ${this.compLoadTime ? this.compLoadTime - this.addLoadTime : -1}`
        + `\n       loadCost->     ${this.compLoadTime ? this.compLoadTime - this.startLoadTime : -1}`
        + `\n       priority->        ${LoaderPriority.NORMAL_PLIST.indexOf(this.priority)}`
        + `\n       addTime->     ${App.DateUtils.formatDate(this.addLoadDate, DateUtils.FORMAT_HH_MM_SS)}/${App.DateUtils.getFormatMilisecs(this.addLoadTime)}`
        + `\n       startTime->    ${App.DateUtils.formatDate(this._startLoadDate, DateUtils.FORMAT_HH_MM_SS)}/${App.DateUtils.getFormatMilisecs(this.startLoadTime)}`
        + `\n       compTime->   ${this._compLoadDate ? App.DateUtils.formatDate(this._compLoadDate, DateUtils.FORMAT_HH_MM_SS) : -1}/${this.compLoadTime ? App.DateUtils.getFormatMilisecs(this.compLoadTime) : ""}`
        + `\n       errorTime->    ${this._errorLoadDate ? App.DateUtils.formatDate(this._errorLoadDate, DateUtils.FORMAT_HH_MM_SS) : -1}/${this.errorLoadTime ? App.DateUtils.getFormatMilisecs(this.errorLoadTime) : ""}`;
    }

    set errorLoadDate(value: number) {
        this._errorLoadDate = value;
        this.errorLoadTime = egret.getTimer();
    }
    set compLoadDate(value: number) {
        this._compLoadDate = value;
        this.compLoadTime = egret.getTimer();
    }
    set startLoadDate(value: number) {
        this._startLoadDate = value;
        this.startLoadTime = egret.getTimer();
    }
}