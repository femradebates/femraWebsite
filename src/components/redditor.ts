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

class ModAct{
    private redditor:Redditor;
    private superContainer: HTMLUListElement;
    private container: HTMLLIElement;
    private num:HTMLAnchorElement;
    private delButton:HTMLSpanElement;
    private n_:number;
    private prev:ModAct;
    private next:ModAct;

    constructor(url:string,redditor:Redditor, first:boolean=true){
        this.redditor=redditor;
        this.container=document.createElement('li');
        if (first){
            this.superContainer=document.createElement('ul');
            this.superContainer.appendChild(this.container)
        }
        this.num=document.createElement('a');
        this.container.appendChild(this.num);
        this.num.href=url;
        this.n=0;
        this.prev=null;
        this.next=null;
        this.delButton=document.createElement('span');
        this.container.appendChild(this.delButton);
        this.delButton.classList.add("needLoggedOn","needMod");
        this.delButton.innerHTML='&times;'
        this.delButton.onclick=(ev:MouseEvent)=>{
            this.redditor.removeDeletedThing(this.n,confirm("Forgive user?"))
        }
    }

    public push(url:string):ModAct{
        let res:ModAct=new ModAct(url,this.redditor,false);
        res.superContainer=this.superContainer;
        res.superContainer.appendChild(res.container);
        res.prev=this;
        this.next=res;
        res.n=this.n+1;

        return res;
    }

    public remove(index:number):ModAct{
        if (index==this.n){
            this.superContainer.removeChild(this.container);
            if(this.prev!=null) this.prev.next=this.next;
            if(this.next!=null){
                this.next.prev=this.prev;
                this.next.n--;
            }
            return this.prev
        }
        if (this.prev!=null) this.prev.remove(index);
        return this;
    }

    public get n():number{return this.n_}
    public set n(val:number){
        this.n_=Math.floor(val);
        this.num.innerHTML=this.n.toString();
        if(this.next!=null) this.next.n=1+this.n;
    }

    public get element() : HTMLUListElement{
        return this.superContainer;
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

        //this.modButtons.style.cssFloat="right"
        //this.tierButtons.style.cssFloat="left"
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

    private modActs: ModAct;
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

        this.modActs=null;
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
        if(this.modActs==null){
            this.modActs=new ModAct(url,this);
            this.content.insertBefore(this.modActs.element,this.modTools.element);
        } else this.modActs=this.modActs.push(url);
        this.deletedThings.push(url);
    }

    public removeDeletedThing(index:number,forgive:boolean){
        this.deletedThings.splice(index,1);
        this.modActs=this.modActs.remove(index);
    }
}