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

        if(this.deletedThings.length>0){
            let deletedList:HTMLUListElement =document.createElement('ul') as HTMLUListElement;
            content.appendChild(deletedList)
            for(var i in this.deletedThings){
                let item:HTMLLIElement = document.createElement('li') as HTMLLIElement;
                let link:HTMLAnchorElement = document.createElement('a') as HTMLAnchorElement;
                link.href=this.deletedThings[i]
                link.innerHTML=i.toString()
                item.appendChild(link);
                deletedList.appendChild(item);
            }
        } else {
            let placeHolder: HTMLParagraphElement = document.createElement('p') as HTMLParagraphElement;
            content.appendChild(placeHolder)
            placeHolder.innerHTML="This user has never been modded"
        }
    }

    public get uName() :string {return this.data.uName}
    public get flairType() : FlairType {return this.data.flairType}
    public get flairText() : string {return this.data.flairText}
    public get deletedThings() : string[] {return this.data.deletedThings}
    public get tier() : number {return this.data.tier}
}