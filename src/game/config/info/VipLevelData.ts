class VipLevelData
{
    public level:number;
    public growth:number;
    public desc:string;

    public constructor(data:any)
    {
        this.level = data.level;
        this.growth = data.growth;
        this.desc = HtmlUtil.br(data.desc);
    }
}