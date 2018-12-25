import './style.css';
import {Tab,TabSystem} from './components/tabBar.ts'

let bar=new TabSystem({"foo":new Tab("foo"),"bar":new Tab("bar")})

document.body.appendChild(bar.element);
