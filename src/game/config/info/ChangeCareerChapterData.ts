class ChangeCareerChapterData {

    public state:number;
    public subState:number;
    public stageName:string;
    public stageTargetName:string;
    public stageTargetDesc:string;

    public constructor(data:any){
        this.state = data.roleState;
        this.subState = data.roleSubState;
        this.stageName = data.stageName;
        this.stageTargetName = data.stageTargetName;
        this.stageTargetDesc = HtmlUtil.br(data.stageTargetDesc);
    }
}