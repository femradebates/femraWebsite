import * as firebase from 'firebase/app';
import 'firebase/auth'
var firebaseui=require('firebaseui')

export class UserDisplay{
    private ovly:HTMLElement;
    private bt:HTMLElement;
    private closeButton:HTMLAnchorElement;
    private loginContainer:HTMLElement;

    constructor(overlay:HTMLElement,bt:HTMLElement){

        this.bt=bt;
        this.ovly=overlay;
        this.bt.onclick=(ev:MouseEvent) =>{
            if (!this.loggedOn)
                this.overlayShow=true;
            else
                this.logout();
        };

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
}