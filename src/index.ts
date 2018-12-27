import './style.css';
import {TabSystem} from './components/tabBar'
import {Accordion} from './components/accordion'
import * as defs from './data/definitions.json'

document.title="FeMRADebates: Discuss Gender Equality"

document.body.innerHTML+=`
    <div id="tab-bar">
        
    </div>
    <div id="main-content">
    </div>
`

let tabBar:HTMLDivElement = document.getElementById("tab-bar") as HTMLDivElement
let mainContent: HTMLDivElement = document.getElementById("main-content") as HTMLDivElement

let tabs : TabSystem = new TabSystem(["Definitions","Users and tiers "],tabBar,mainContent)

let defView :HTMLElement=document.createElement('div');
tabs.setContent("Definitions",defView)

let defAccordians:Accordion[] =[];

for(var i in (<any>defs)){
    if (i=="default") continue;
    let def: any = (<any>defs)[i]

    let defSpan:HTMLElement=document.createElement('span')
    defSpan.innerHTML=def.term;
    
    let defAccord:Accordion=new Accordion(defView,defSpan,document.createElement('div'))
    defAccord.content.innerHTML=def.prefix+(def.prefix.size>0?' ':'')+'<b>'+def.term+'</b> '+def.def
}