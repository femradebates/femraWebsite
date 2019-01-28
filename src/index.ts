import * as firebase from 'firebase/app';
import 'firebase/firestore'

import './style.scss';
import {TabSystem} from './components/tabBar'
import {Accordion} from './components/accordion'
import {DefinitionData,Definition} from './components/definition'
import {RedditorData,FlairType,Redditor} from './components/redditor'

//import * as defs from './data/definitions.json'

document.title="FeMRADebates: Discuss Gender Equality"

document.body.innerHTML+=`
    <div id="tab-bar">
        
    </div>
    <div id="main-content">
    </div>
`

let tabBar:HTMLDivElement = document.getElementById("tab-bar") as HTMLDivElement
let mainContent: HTMLDivElement = document.getElementById("main-content") as HTMLDivElement

let tabs : TabSystem = new TabSystem(["Definitions","Users and tiers"],tabBar,mainContent)

let defView : HTMLElement=document.createElement('div');
let userView : HTMLElement=document.createElement('div');

tabs.setContent("Definitions",defView)
tabs.setContent("Users and tiers",userView)


let firebaseConfig={
    apiKey: "AIzaSyBVO6mnImTz5Z4HECeRjy7IhzUgyxFeM8w",
    authDomain: "femradebates-751d8.firebaseapp.com",
    databaseURL: "https://femradebates-751d8.firebaseio.com",
    projectId: "femradebates-751d8",
    storageBucket: "femradebates-751d8.appspot.com",
    messagingSenderId: "891740031011"
}

firebase.initializeApp(firebaseConfig)

let db=firebase.firestore();
db.settings({timestampsInSnapshots:true})

let definitions: Definition[] = []

db.collection('definitions').orderBy('term').get().then((snapshot:any)=>{
    snapshot.docs.forEach((doc :any) => {
        definitions.push(new Definition(defView,doc.data()))
    });
})

let userData:RedditorData={
    uName: "lunar_mycroft",
    flairType: FlairType.none,
    flairText: "",
    deletedThings: ["http://www.reddit.com/r/FeMRADebates/comments/3mm22x/utbris_deleted_comments_thread/cxmeoq9","http://www.reddit.com/r/FeMRADebates/comments/3mm22x/utbris_deleted_comments_thread/czgoarb"],
    tier: 0
}
let exampleUser=new Redditor(userView,userData)