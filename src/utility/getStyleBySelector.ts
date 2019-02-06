export function getStyleBySelector(selector:string) : CSSStyleRule{
    let rules: any =(document.styleSheets[0] as any).cssRules
    for(var i in rules){
        if (rules[i]['selectorText']==selector) return rules[i];
    }
        
    return null;
}