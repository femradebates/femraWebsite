import * as firebase from 'firebase/app';
import 'firebase/firestore'

import { Accordion } from "./accordion";
import {clearHTMLElement} from ".././utility/clearHTMLElement"

export enum FlairType{
    none,
    feminist,
    casualFeminist,
    neutral,
    casualMRA,
    mra,
    other
}

class DeletedDisplay{
    private redditor:Redditor;
    private container:HTMLElement;
    private deletedList:HTMLUListElement;
    private listOfThing:HTMLLIElement[];
    private placeHolder:HTMLElement;
    constructor(redditor:Redditor){
        this.redditor=redditor;

        this.container=document.createElement('div');
        this.listOfThing=[];
        this.update();
    }

    public update():void{
        clearHTMLElement(this.container);
        if(this.redditor.deletedThings.length<=0){
            this.placeHolder = document.createElement('span');
            this.container.appendChild(this.placeHolder)
            this.placeHolder.innerHTML="This user has never been modded"
            return;
        }
        for(var i in this.redditor.deletedThings){
            this.addDeletedThing(this.redditor.deletedThings[i]);
        }
    }

    public get element():HTMLElement{
        return this.container;
    }

    public addDeletedThing(url:string){
        if(this.redditor.deletedThings.length<=0){
            this.container.removeChild(this.placeHolder);
            let caption : HTMLSpanElement = document.createElement('span') as HTMLSpanElement;
            this.container.appendChild(caption);
            caption.innerHTML="Users was modded at the following times:"
            this.deletedList = document.createElement('ul') as HTMLUListElement;
            this.container.appendChild(this.deletedList)
        }
        this.redditor.deletedThings.push(url);
        let item:HTMLLIElement = document.createElement('li') as HTMLLIElement;
        this.listOfThing.push(item);
        let link:HTMLAnchorElement = document.createElement('a') as HTMLAnchorElement;
        link.href=url
        link.target='_blank'
        link.innerHTML=(this.listOfThing.length).toString();
        item.appendChild(link);
        this.deletedList.appendChild(item);
    }
}

class ModTools{
    private redditor:Redditor;

    private container:HTMLElement;

    private tierButtons:HTMLDivElement;
    private modButtons:HTMLDivElement;

    private tierBt:HTMLButtonElement;
    private forgiveBt:HTMLButtonElement;
    private newLink:HTMLInputElement;
    private tierToggle:HTMLInputElement;
    private subButton:HTMLButtonElement;
    constructor(redditor:Redditor){
        this.redditor=redditor;

        this.container=document.createElement('div');
        this.container.classList.add("needLoggedOn","needMod","userModActions");

        this.tierButtons=document.createElement('div') as HTMLDivElement;
        this.modButtons=document.createElement('div') as HTMLDivElement;


        this.tierBt=document.createElement('button') as HTMLButtonElement;
        this.tierBt.innerHTML="++tier"
        this.forgiveBt=document.createElement('button') as HTMLButtonElement;
        this.forgiveBt.innerHTML="--tier"
        this.subButton=document.createElement('button') as HTMLButtonElement;
        this.subButton.innerHTML="Mod for new link"

        this.newLink=document.createElement('input') as HTMLInputElement;
        this.newLink.type="text";
        this.tierToggle=document.createElement('input') as HTMLInputElement;
        this.tierToggle.type="checkbox"
        this.tierToggle.checked=false

        this.tierBt.onclick=(ev:MouseEvent)=>{this.redditor.punish()};
        this.forgiveBt.onclick=(ev:MouseEvent)=>{this.redditor.forgive()}
        this.subButton.onclick=(ev:MouseEvent)=>{
            this.redditor.addDeletedThing(this.newLink.value)
            if(this.tierToggle.checked) this.redditor.punish()
        }

        this.tierButtons.appendChild(this.tierBt);
        this.tierButtons.appendChild(this.forgiveBt);
        this.modButtons.appendChild(this.newLink);
        this.modButtons.appendChild(this.tierToggle);
        this.modButtons.appendChild(this.subButton);
        this.container.appendChild(this.tierButtons);
        this.container.appendChild(this.modButtons);

        this.tierToggle.title="Tier user for this act?"
        this.newLink.placeholder="enter comment url here";

        this.modButtons.style.cssFloat="right"
        this.tierButtons.style.cssFloat="left"
    }

    public get element():HTMLElement{
        return this.container
    }
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

    private deletedDisplay: DeletedDisplay;
    private modTools:ModTools;
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

        this.deletedDisplay=new DeletedDisplay(this);
        this.modTools=new ModTools(this);
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
        this.content.appendChild(this.deletedDisplay.element);

        this.content.appendChild(this.modTools.element);
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
    
    public punish():void{
        this.data.tier++;
        this.updateContent();
    }
    public forgive():void{
        if (this.tier==0) return;
        this.data.tier--;
        this.updateContent();
    }

    public addDeletedThing(url:string){
        this.deletedDisplay.addDeletedThing(url);
    }
}