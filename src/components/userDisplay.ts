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
        this.bt.innerHTML="Updated"
        this.bt.onclick=(ev:MouseEvent) =>{this.overlayShow=false;};

        this.closeButton = document.createElement('a');
        this.closeButton.onclick=(ev:MouseEvent) =>{this.overlayShow=false;};
        this.ovly.appendChild(this.closeButton);
        this.closeButton.classList.add("closebtn");
        this.closeButton.innerHTML='&times;'

        this.loginContainer=document.createElement('div');
        this.loginContainer.id="loginContainer";
        this.ovly.appendChild(this.loginContainer);

        let ui =new firebaseui.auth.AuthUI(firebase.auth());

        let uiConfig = {
            callbacks: {
              signInSuccessWithAuthResult: (authResult:any, redirectUrl:any)=> {
                this.overlayShow=true;
                return false;
              },
              uiShown: function() {
                // The widget is rendered.
                // Hide the loader.
                //document.getElementById('loader').style.display = 'none';
              }
            },
            signInOptions: [
              // Leave the lines as is for the providers you want to offer your users.
              firebase.auth.EmailAuthProvider.PROVIDER_ID,
            ],
        }

        ui.start('#loginContainer',uiConfig)

    }

    private set overlayShow(val:boolean){
        if(val) this.ovly.style.display="block";
        else    this.ovly.style.display="none";
    } 
}