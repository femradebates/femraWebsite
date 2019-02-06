import * as firebase from 'firebase/app';
import 'firebase/firestore'

import { Accordion } from "./accordion";
import {clearHTMLElement} from ".././utility/clearHTMLElement"
import {Toggle} from './toggle'

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
        this.num.href="https://reddit.com/r/FeMRADebates/comments/"+url;
        this.num.target="_blank";
        this.n=0;
        this.prev=null;
        this.next=null;
        this.delButton=document.createElement('span');
        this.container.appendChild(this.delButton);
        this.delButton.classList.add("needLoggedOn","needMod");
        this.delButton.innerHTML='&times;'
        this.delButton.onclick=(ev:MouseEvent)=>{
            if(!confirm("This cannot be undone.  Are you sure?")) return;
            this.redditor.removeDeletedThing(this.n,false)
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
    private tierToggle:Toggle;
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
        this.tierToggle=new Toggle;
        this.tierToggle.checked=false
        this.tierBt.onclick=(ev:MouseEvent)=>{this.redditor.punish()};
        this.forgiveBt.onclick=(ev:MouseEvent)=>{this.redditor.forgive()}
        this.subButton.onclick=(ev:MouseEvent)=>{
            if(this.deletedURL.length<=0){
                alert(this.deletedURL+" is not a valid url")    
                return;
            }
            this.redditor.addDeletedThing(this.deletedURL)
            this.newLink.value="";
            if(this.tierToggle.checked) this.redditor.punish()
        }

        this.tierButtons.appendChild(this.tierBt);
        this.tierButtons.appendChild(this.forgiveBt);
        this.modButtons.appendChild(this.newLink);
        this.modButtons.appendChild(this.tierToggle.element)
        this.modButtons.appendChild(this.subButton);
        this.container.appendChild(this.tierButtons);
        this.container.appendChild(this.modButtons);

        this.tierToggle.title="Tier user for this act?"
        this.newLink.placeholder="enter reddit url here";

        this.modButtons.style.cssFloat="right"
        this.tierButtons.style.cssFloat="left"
    }

    public get element():HTMLElement{
        return this.container
    }

    private get deletedURL():string{
        if (this.newLink.value.length<=0) return "";
        let index:number=this.newLink.value.toLowerCase().indexOf("/r/femradebates/comments");
        if (index<0) return "";
        return this.newLink.value.substr(index+25)
    }
}

export interface RedditorData{
    uName: string;
    flairType: FlairType;
    flairText: string;
    deletedThings: string[];
    tier: number;
}


export class AddRedditor extends Accordion{
    private db:any;

    private addBt:HTMLButtonElement;
    private uName:HTMLInputElement;
    private redditors:Redditor[]
    private parent:HTMLElement;

    constructor(parent:HTMLElement,db:any,redditors:Redditor[]){
        super(parent,document.createElement('div'),document.createElement('div'));
        this.redditors=redditors;
        this.parent=parent;
        this.db=db;

        this.wrap.classList.add("needLoggedOn","needMod","addRedditor")
        this.button.innerHTML="Add Redditor"
        
        this.addBt=document.createElement("button");
        this.addBt.innerHTML="Add the selected user";
        this.uName=document.createElement('input');
        this.uName.type="text";
        this.content.appendChild(this.uName);
        this.content.appendChild(this.addBt);

        this.addBt.onclick=(ev:MouseEvent)=>{this.addRedditor(this.uName.value)}
    }
    private addRedditor(uName:string){
        let index: number = this.redditors.indexOf(this.redditors.find((element:Redditor)=>{return element.uName>uName}));
        let newRedditor=new Redditor(this.parent,uName,this.db,this.redditors[index].wrap)
        this.redditors.splice(index,0,newRedditor)

        this.db.collection('redditors').doc(newRedditor.ID).set({
            uName:newRedditor.uName,
            flairType:FlairType.none,
            flairText:"",
            deletedThings:[],
            tier:0
        }).then(()=>{
            console.log("Sucessfully added redditor data for "+uName)
        }).catch((error:any)=>{
            console.log("Error writing redditor collection")
            console.log(error)
            alert("There was a problem adding redditor.  Please check the console for details")
        })

        this.db.collection('redditors').doc('allUsers').update({list:this.redditors.map((r:Redditor)=>{return r.ID})}).then(()=>{
            console.log("Sucessfully added "+uName+" to the list of all users")
        }).catch((error:any)=>{
            console.log("Error writing redditor to list")
            console.log(error)
            alert("There was a problem adding redditor.  Please check the console for details")
        })
    }
}

export class Redditor extends Accordion {
    private data: RedditorData;
    private loaded: boolean;
    private db:any;

    private modActs: ModAct;
    private modTools:ModTools;
    constructor(parent:HTMLElement,uName:string,db:any,before:HTMLElement=null){
        let head:HTMLDivElement=document.createElement('div') as HTMLDivElement;
        let content:HTMLDivElement = document.createElement('div') as HTMLDivElement;
        super(parent,head,content,before)
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
        for(var url of this.deletedThings){
            if(this.modActs==null){
                this.modActs=new ModAct(url,this);
                this.content.insertBefore(this.modActs.element,this.modTools.element);
            } else this.modActs=this.modActs.push(url);
        }
    }

    public get uName() :string {return this.data.uName}
    public get ID():string{
        if (this.uName.substr(0,2)=='__') return '\\'+this.uName;
        return this.uName;
    }
    public get flairType() : FlairType {return this.data.flairType}
    public get flairText() : string {return this.data.flairText}
    public get deletedThings() : string[] {return this.data.deletedThings}
    public get tier() : number {return this.data.tier}
    public set tier(val:number){
        if (val<0 || val!=Math.floor(val)) return;
        this.data.tier=val;
        this.db.collection('redditors').doc(this.ID).update(
            {tier:this.tier}
        ).then(console.log("Updated tier")).catch(function(error:any) {
            alert("There was an error adding the mod action to the database.")
            console.error("Error updating: ", error);
        });
    }
    
    public punish():void{
        this.tier++;
        this.updateContent();
    }
    public forgive():void{
        if (this.tier==0) return;
        this.tier--;
        this.updateContent();
    }

    public addDeletedThing(url:string){
        if(this.modActs==null){
            this.modActs=new ModAct(url,this);
            this.content.insertBefore(this.modActs.element,this.modTools.element);
        } else this.modActs=this.modActs.push(url);
        this.deletedThings.push(url);
        this.db.collection('redditors').doc(this.ID).update(
            {deletedThings:this.deletedThings}
        ).then(console.log("Added deleted thing")).catch(function(error:any) {
            alert("There was an error adding the mod action to the database.")
            console.error("Error updating: ", error);
        });
    }

    public removeDeletedThing(index:number,forgive:boolean){
        this.deletedThings.splice(index,1);
        this.modActs=this.modActs.remove(index);
        this.db.collection('redditors').doc(this.ID).update(
            {deletedThings:this.deletedThings}
        ).then(console.log("Remove deleted thing")).catch(function(error:any) {
            console.error("Error updating: ", error);
        });
    }
}