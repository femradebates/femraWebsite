export class Accordion{
    private head:HTMLDivElement
    private cont:HTMLElement
    public wrap:HTMLDivElement

    public onOpen: ()=>void;

    constructor(parent:HTMLElement,button:HTMLDivElement,content:HTMLDivElement,before:HTMLElement=null){

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
        if(before==null)
            parent.appendChild(this.wrap);
        else
            parent.insertBefore(this.wrap,before);

        this.onOpen=()=>{};
    }

    public get button() : HTMLDivElement{return this.head}

    public get content(): HTMLElement{return this.cont}
    public set content(val:HTMLElement){
        this.wrap.removeChild(this.cont)
        val.classList.add("accordian-content");
        this.cont=val
        this.wrap.appendChild(this.cont)
    }

    public get open() : boolean{return this.wrap.classList.contains("active")}
    public set open(val:boolean) {
        if (val){
            this.wrap.classList.add("active")
            this.onOpen();
        } 
        else this.wrap.classList.remove("active")
    }
}