import { Accordion } from "./accordion";

export enum FlairType{
    feminist,
    casualFeminist,
    neutral,
    casualMRA,
    mra,
    other,
    none
}

export interface RedditorData{
    uName: string;
    flairType: FlairType;
    flairText: string;
    deletedThings: string[];
    tier: number;
}

export class Redditor extends Accordion {
    private data: RedditorData;
    constructor(parent:HTMLElement,data:RedditorData){
        let head:HTMLDivElement=document.createElement('div') as HTMLDivElement;
        let content:HTMLDivElement = document.createElement('div') as HTMLDivElement;
        super(parent,head,content)
        this.data=data;

        head.innerHTML=this.uName
        content.appendChild(this.deletedDisplay);
        content.classList.add("redditor")
    }

    private get deletedDisplay() : HTMLElement {
        let res : HTMLElement = document.createElement('div')
        
        if(this.deletedThings.length>0){
            let caption : HTMLSpanElement = document.createElement('span') as HTMLSpanElement;
            res.appendChild(caption);
            caption.innerHTML="Users was modded at the following times:"

            let deletedList:HTMLUListElement =document.createElement('ul') as HTMLUListElement;
            res.appendChild(deletedList)
            for(var i in this.deletedThings){
                let item:HTMLLIElement = document.createElement('li') as HTMLLIElement;
                let link:HTMLAnchorElement = document.createElement('a') as HTMLAnchorElement;
                link.href=this.deletedThings[i]
                link.target='_blank'
                link.innerHTML=(+i+1).toString()
                item.appendChild(link);
                deletedList.appendChild(item);
            }
        } else {
            let placeHolder: HTMLParagraphElement = document.createElement('p') as HTMLParagraphElement;
            res.appendChild(placeHolder)
            placeHolder.innerHTML="This user has never been modded"
        }

        return res;
    }

    public get uName() :string {return this.data.uName}
    public get flairType() : FlairType {return this.data.flairType}
    public get flairText() : string {return this.data.flairText}
    public get deletedThings() : string[] {return this.data.deletedThings}
    public get tier() : number {return this.data.tier}
}