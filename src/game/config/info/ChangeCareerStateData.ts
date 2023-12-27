class ChangeCareerStateData {
    public state:number;
    public title:string;
    public titleDesc:string;
    public subStateName:string;
    public upgradeDesc:string;
    public skills:Array<Array<string>>;
    public attrNames:Array<string>;
    public attrs:Array<Array<string>>;

    public constructor(data:any){
        this.state = data.roleState+1;
        let ts:Array<string> = data.title.split(',');
        this.title = ts[0];
        this.titleDesc = ts[1];
        this.subStateName = data.roleSubStateName;
        this.upgradeDesc = HtmlUtil.br(data.upgradeDesc);
        this.skills = [];
        let skill:any;
        for (let i = 1; i <= 4; i++) {
            skill = data["skill" + i];
            if (skill && skill != "")
                this.skills.push(skill.split(','));
        }
        if (data.attr) {
            let as:Array<string>= data.attr.split(',');
            this.attrNames = as.shift().split('#');
            this.attrs = [];
            for (let j = 0; j < as.length; j++) {
                this.attrs.push(as[j].split('#'));
            }
        }
    }
}