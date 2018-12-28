import { Accordion } from "./accordion";

export interface DefinitionData{
    term:string;
    altTerms:string[];
    notes:string[];
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
        content.innerHTML=this.prefix+(this.prefix.length>0?' ':'')+'<b>'+this.term+'</b> '+((this.data.notes.length>0 || this.data.altTerms.length>0) ? '(' : '')
        
        for(var altTerm of this.data.altTerms){
            let termEl:HTMLElement = document.createElement('b')
            termEl.innerHTML=altTerm
            content.appendChild(termEl)
            content.innerHTML+=", "
        }
        if (this.data.altTerms.length>0) content.innerHTML=content.innerHTML.substr(0,content.innerHTML.length-2)
        if (this.data.notes.length>0){
            for(var note of this.data.notes){}
                content.innerHTML+=note+', '
            content.innerHTML=content.innerHTML.substr(0,content.innerHTML.length-2)
        } 
        content.innerHTML+=((this.data.notes.length>0 || this.data.altTerms.length>0) ? ') ' : '')+this.def;
    }

    get term() : string{return this.data.term}
    get altTerms(): string[] {return this.data.altTerms}
    get prefix(): string {return this.data.prefix}
    get def() : string {return this.data.def}
}

