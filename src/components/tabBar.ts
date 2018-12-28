class Tab{
    private bt:HTMLDivElement;
    private wrapper:HTMLDivElement;
    private cont:HTMLElement;
    private actv:boolean;
    constructor(name:string, bar:HTMLDivElement, container:HTMLDivElement,onclick: (name:string)=>void = (name:string)=>{}){
        this.bt=document.createElement('div');
        this.bt.innerHTML=name
        this.bt.onclick=(ev:MouseEvent)=>{onclick(name)}     
        bar.appendChild(this.bt)
        this.wrapper=document.createElement('div')
        container.appendChild(this.wrapper)
        this.cont=null;
    }
    public get active():boolean{
        return this.actv;
    }
    public set active(val:boolean){
        if (val){
            this.wrapper.style.display="block"
            this.actv=true
            this.bt.className="active";
        } else {
            this.wrapper.style.display="none"
            this.actv=false
            this.bt.className=this.bt.className=''
        }
    }
    public get content():HTMLElement{
        return this.cont;
    }
    public set content(val:HTMLElement){
        this.cont=val
        while(this.wrapper.firstChild) this.wrapper.removeChild(this.wrapper.firstChild)
        this.wrapper.appendChild(this.cont)
    }
}

export class TabSystem{
    private lookup:{[name:string]:Tab};
    constructor(names:string[],bar:HTMLDivElement,container:HTMLDivElement){
      this.lookup={}
        for(var name of names){
            this.lookup[name]=new Tab(name,bar,container,this.setActive)
            this.lookup[name].content=document.createElement('div')
        }
      this.setActive(names[0])
    }
    public setActive = (name:string)=>{
        for (var n in this.lookup)
            this.lookup[n].active=(n==name)
    }
    public getContent(name:string):HTMLElement {return this.lookup[name].content}
    public setContent(name:string,cont:HTMLElement){this.lookup[name].content=cont}
}