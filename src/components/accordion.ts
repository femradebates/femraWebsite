export class Accordion{
    private head:HTMLDivElement
    private cont:HTMLElement
    private wrap:HTMLDivElement

    constructor(parent:HTMLElement,button:HTMLDivElement,content:HTMLDivElement){

        this.head=button;
        this.head.classList.add("accordian-head")
        this.head.onclick=(ev:MouseEvent)=>{this.open=!this.open}

        this.wrap=document.createElement('div')
        this.wrap.classList.add("accordian-wrapper")
        this.cont=content
        this.content.classList.add("accordian-content")


        this.wrap.appendChild(this.head)
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

    public get open() : boolean{return this.wrap.classList.contains("active")}
    public set open(val:boolean) {
        if (val) this.wrap.classList.add("active")
        else this.wrap.classList.remove("active")
    }
}