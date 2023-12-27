class noticeTxt extends fairygui.GComponent {
    public txt : fairygui.GRichTextField;

     protected constructFromXML(xml:any):void {
        super.constructFromXML(xml);
        this.txt = this.getChild("txt").asRichTextField;
    }
    

    public setTxt(data : any) {
        var str : string = data.toString();
        str = str.replace(/<br\s*\/?>/gi,"\r\n");
        this.txt.text = str;
    }
    
}