import * as firebase from 'firebase/app';
import 'firebase/firestore'

import './style.scss';
import {TabSystem} from './components/tabBar'
//import {Accordion} from './components/accordion'
import {DefinitionData,Definition} from './components/definition'
import {RedditorData,FlairType,Redditor} from './components/redditor'
import {UserDisplay} from './components/userDisplay'

//import * as defs from './data/definitions.json'

document.title="FeMRADebates: Discuss Gender Equality"

document.body.innerHTML+=`
    <div id="tab-bar">
    </div>
    <div id="login"></div>
    <div id="main-content">
    </div>
    <div class="overlay">
    </div>
`

let tabBar:HTMLDivElement = document.getElementById("tab-bar") as HTMLDivElement
let mainContent: HTMLDivElement = document.getElementById("main-content") as HTMLDivElement

let tabs : TabSystem = new TabSystem(["Definitions","Users and tiers"],tabBar,mainContent)

let defView : HTMLElement=document.createElement('div');
defView.innerHTML="Loading definitions"
let userView : HTMLElement=document.createElement('div');
userView.innerHTML="Loading users"

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
let redditors: Redditor[] = [];

db.collection('definitions').orderBy('term').get().then((snapshot:any)=>{
    while(defView.firstChild) defView.removeChild(defView.firstChild)
    snapshot.docs.forEach((doc :any) => {
        definitions.push(new Definition(defView,doc.data()))
    });
})

db.collection('redditors').doc('allUsers').get().then((doc:any)=>{
    while(userView.firstChild) userView.removeChild(userView.firstChild)
    for(var name of doc.data().list){
        redditors.push(new Redditor(userView,name,db))
    }
})

let exampleUser=new Redditor(userView,"lunar_mycroft",db);

let loginWidget=new UserDisplay(document.getElementsByClassName("overlay")[0] as HTMLElement,document.getElementById('login'))