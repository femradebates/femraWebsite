export class Toggle{
    private label:HTMLLabelElement;
    private toggle:HTMLInputElement;
    private slider:HTMLSpanElement;
    constructor(){
      this.label=document.createElement('label');
      this.label.classList.add("switch")
      
      this.toggle=document.createElement('input');
      this.toggle.type="checkbox"
      this.toggle.classList.add("switch")
  
      this.slider=document.createElement('span');
      this.slider.classList.add("slider")
  
      this.label.appendChild(this.toggle);
      this.label.appendChild(this.slider);
    }
    public get element() : HTMLLabelElement{
      return this.label;
    }
    public get checked():boolean{
      return this.toggle.checked;
    }
    public set checked(val:boolean){
      this.toggle.checked=val;
    }
    public set title(val:string){
        this.label.title=val;
    }
  }
  