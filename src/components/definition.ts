import { Accordion } from "./accordion";

export interface DefinitionData{
    term:string;
    altTerms:string[];
    prefix:string;
    def:string;
}

export class Definition extends Accordion{
    private data: DefinitionData;
    constructor(parent:HTMLElement,data:DefinitionData){
        let head:HTMLDivElement=document.createElement('div') as HTMLDivElement;
        let content:HTMLDivElement = document.createElement('div') as HTMLDivElement;
        super(parent,head,content)
        this.data=data;

        head.innerHTML=this.term
        content.innerHTML=this.prefix+(this.prefix.length>0?' ':'')+'<b>'+this.term+'</b> '+this.def
    }

    get term() : string{return this.data.term}
    get altTerms(): string[] {return this.data.altTerms}
    get prefix(): string {return this.data.prefix}
    get def() : string {return this.data.def}
}

