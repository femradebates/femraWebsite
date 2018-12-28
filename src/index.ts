//import * as firebase from 'firebase';

import './style.scss';
import {TabSystem} from './components/tabBar'
import {Accordion} from './components/accordion'
import {DefinitionData,Definition} from './components/definition'

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

let definitions: Definition[] = []

for(var i in (<any>defs)){
    if (i=="default") continue;
    let def: DefinitionData = (<any>defs)[i]
    definitions.push(new Definition(defView,def))
}

/*firebase.initializeApp({
    apiKey: "AIzaSyBVO6mnImTz5Z4HECeRjy7IhzUgyxFeM8w",
    authDomain: "femradebates-751d8.firebaseapp.com",
    databaseURL: "femradebates-751d8.firebaseio.com",
    prodjectId: "femradebates-751d8",
    storageBucket: "femradebates-751d8.appspot.com",
    messagingSenderId: "891740031011"
});

let database:any =firebase.database();

database.ref('definitions/').on('value',(snapshot:any)=>{
    console.log(snapshot.val())
    alert("on()")
})*/

