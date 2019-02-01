import * as firebase from 'firebase/app';
import 'firebase/auth'
var firebaseui=require('firebaseui')

import {getStyleBySelector} from '.././utility/getStyleBySelector'

export class UserDisplay{
    private ovly:HTMLElement;
    private bt:HTMLElement;
    private closeButton:HTMLAnchorElement;
    private loginContainer:HTMLElement;

    private db:any;
    
    private isMod_:boolean;

    constructor(overlay:HTMLElement,bt:HTMLElement,db:any){

        this.db=db;
        this.bt=bt;
        this.ovly=overlay;
        this.bt.onclick=(ev:MouseEvent) =>{
            if (!this.loggedOn)
                this.overlayShow=true;
            else
                this.logout();
        };
        this.bt.onmouseenter=(ev:MouseEvent)=>{
            if(this.loggedOn){
                this.bt.innerHTML="Logout";
            }
        }
        this.bt.onmouseleave=(ev:MouseEvent)=>{
            this.updateUser()
        }

        this.closeButton = document.createElement('a');
        this.closeButton.onclick=(ev:MouseEvent) =>{this.overlayShow=false;};
        this.ovly.appendChild(this.closeButton);
        this.closeButton.classList.add("closebtn");
        this.closeButton.innerHTML='&times;'

        this.loginContainer=document.createElement('div');
        this.loginContainer.id="loginContainer";
        this.ovly.appendChild(this.loginContainer);

        this.updateUser();

        let ui =new firebaseui.auth.AuthUI(firebase.auth());

        let uiConfig = {
            callbacks: {
              signInSuccessWithAuthResult: (authResult:any, redirectUrl:any)=> {
                this.overlayShow=false;
                return false;
              }
            },
            signInOptions: [
              firebase.auth.EmailAuthProvider.PROVIDER_ID,
            ],
        }

        ui.start('#loginContainer',uiConfig)

        firebase.auth().onAuthStateChanged((user:any)=>{

            let loggedOnRule: CSSStyleRule=getStyleBySelector(".needLoggedOn");
            let isModRule:CSSStyleRule=getStyleBySelector(".needMod");
            loggedOnRule.style.display= this.loggedOn ? "inline-block" : "none"
            
            this.db.collection('userGroups').doc('mods').get().then((doc:any)=>{
                if(this.user==null) return;
                this.isMod_=doc.data().members.includes(this.user.uid)
                isModRule.style.display= this.isMod ? "inline-block" : "none"
            }).catch(function(error:any) {
                console.log("Error getting document:", error);
            });
            this.updateUser();
        })
    }

    private set overlayShow(val:boolean){
        if(val) this.ovly.style.display="block";
        else    this.ovly.style.display="none";
    }
    private get overlayShow() :boolean{
        return this.ovly.style.display=="block";
    }

    private logout():void{
        if (!confirm("Are you sure you want to log out?")) return;
        firebase.auth().signOut().then(function() {
            console.log("signed out");
          }, function(error:any) {
            alert("Error signing out");
          });
    }

    public updateUser():void{

        if (this.loggedOn){
            this.bt.innerHTML=this.user.email;
        } else {
            this.bt.innerHTML="Log on!";
        }
    }
    
    private get user():any{
        return firebase.auth().currentUser;
    }

    public get loggedOn():boolean{
        return this.user!=null;
    }

    public get isMod():boolean{return this.isMod_}
}