export class Accordion{
    private bt:HTMLButtonElement
    private cont:HTMLElement
    private wrap:HTMLDivElement
    private active:boolean

    constructor(parent:HTMLElement,button:HTMLElement,content:HTMLElement){

        this.bt=document.createElement('button')
        this.bt.onclick=(ev:MouseEvent)=>{this.open=!this.open}
        this.bt.appendChild(button)
        this.wrap=document.createElement('div')
        this.cont=content
        this.wrap.appendChild(this.bt)
        this.wrap.appendChild(this.cont)
        this.open=false
        parent.appendChild(this.wrap)
    }

    public get content(): HTMLElement{return this.cont}
    public set content(val:HTMLElement){
        this.wrap.removeChild(this.cont)
        this.cont=val
        this.wrap.appendChild(this.cont)
    }

    public get open() : boolean{return this.active}
    public set open(val:boolean) {
        if (val){
            this.cont.style.display="block"
            this.bt.className+=" active"
            this.active=true
        } else {
            this.cont.style.display="none"
            this.bt.className.replace('active','')
            this.active=false
        }
    }
}