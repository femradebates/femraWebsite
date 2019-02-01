import * as firebase from 'firebase/app';
import 'firebase/firestore'

import { Accordion } from "./accordion";

export enum FlairType{
    none,
    feminist,
    casualFeminist,
    neutral,
    casualMRA,
    mra,
    other
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
    private loaded: false;
    private db:any;
    constructor(parent:HTMLElement,uName:string,db:any){
        let head:HTMLDivElement=document.createElement('div') as HTMLDivElement;
        let content:HTMLDivElement = document.createElement('div') as HTMLDivElement;
        super(parent,head,content)
        this.db=db;
        this.data={
            uName:uName,
            flairType:FlairType.none,
            flairText:"",
            deletedThings:[],
            tier:0
        };
        this.loaded=false;
        head.innerHTML=this.uName
        content.classList.add("redditor")
        this.onOpen=()=>{if(!this.loaded) this.loadFullData();}
        content.innerHTML="Loading user data"
    }

    private loadFullData():void{
        this.db.collection('redditors').doc(this.ID).get().then((doc:any)=>{
            if(!doc.exists){
                console.log("Attempted to read user "+this.ID+" but they don't exist")
                return
            }
            this.data.flairType = doc.data().flairType;
            this.data.flairText = doc.data().flairText;
            this.data.deletedThings = doc.data().deletedThings;
            this.data.tier = doc.data().tier;
            this.updateContent()
        })
    }

    private updateContent():void{
        while(this.content.firstChild) this.content.removeChild(this.content.firstChild)
        let uNameDisp:HTMLElement=document.createElement('b');
        uNameDisp.innerHTML=this.uName;
        this.content.appendChild(uNameDisp);
        this.content.innerHTML+=" is at tier "+this.tier.toString()+" of the ban system.<br>";
        this.content.appendChild(this.deletedDisplay);
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
    private get ID():string{
        if (this.uName.substr(0,2)=='__') return '\\'+this.uName;
        return this.uName;
    }
    public get flairType() : FlairType {return this.data.flairType}
    public get flairText() : string {return this.data.flairText}
    public get deletedThings() : string[] {return this.data.deletedThings}
    public get tier() : number {return this.data.tier}
}