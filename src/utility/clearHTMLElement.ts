export function clearHTMLElement(el:HTMLElement):void{
    while(el.firstChild)
        el.removeChild(el.firstChild);
}