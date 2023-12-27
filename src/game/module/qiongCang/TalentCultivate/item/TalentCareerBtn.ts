class TalentCareerBtn extends ListRenderer {
    private careerLoader: GLoader;

	private career: number;

    public constructor() {
        super();
    }

    protected constructFromXML(xml: any): void {
        super.constructFromXML(xml);
        this.careerLoader = this.getChild("loader_career") as GLoader;
    }

    public setData(career: number): void {
        this.career = career;
        this.careerLoader.load(URLManager.getModuleImgUrl("TalentCultivate/career_" + career + ".png", PackNameEnum.QiongCang));
    }

	public getCareer(): number{
		return this.career;
	}
}