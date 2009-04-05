// **************************************************************************
// Copyright 2007 - 2008 The JSLab Team, Tavs Dokkedahl and Allan Jacobs
// Contact: http://www.jslab.dk/contact.php
//
// This file is part of the JSLab DOM Correction (JDC) Program.
//
// JDC is free software; you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation; either version 3 of the License, or
// any later version.
//
// JDC is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program. If not, see <http://www.gnu.org/licenses/>.
// ***************************************************************************
// File created 2008-08-23 16:42:11

// JDC Version: 1.0.2
// EPE revision: 90
// UEM revision: 74
// Release date: 2008-08-08

if(document.createEventObject){var EPE={};EPE.CACHE_ELEMENTS=0;EPE.IECreateElement=document.createElement;EPE.createElement=function(tag){tag=tag.toLowerCase();var elm=EPE.tags[tag]?new EPE.tags[tag](tag): new HTMLElement(tag);if(EPE.CACHE_ELEMENTS)EPE.cache.add(elm);return elm;};document.createElement=EPE.createElement;EPE.extend=function(elm,oCon){if(!elm.constructor){if(!oCon)oCon=EPE.tags[elm.tagName.toLowerCase()]?EPE.tags[elm.tagName.toLowerCase()]: HTMLElement;elm.constructor=oCon;if(elm.canHaveChildren){elm._appendChild=elm.appendChild;elm._insertBefore=elm.insertBefore;elm._replaceChild=elm.replaceChild;elm.appendChild=EPE.appendChild;elm.insertBefore=EPE.insertBefore;elm.replaceChild=EPE.replaceChild;}oPro=HTMLElement._prototype;if(elm.nodeName!="OBJECT"&&elm.nodeName!="APPLET"){for(var p in oPro){elm[p]=oPro[p];}}else{for(var p in oPro){try{elm[p]=oPro[p];}catch(ex){}}}var oPro=oCon._prototype;if(elm.nodeName!="OBJECT"&&elm.nodeName!="APPLET"){for(var p in oPro)elm[p]=oPro[p];}else{for(var p in oPro){try{elm[p]=oPro[p];}catch(ex){}}}EPE.PlugIn.executeCreate(elm);EPE.enableWatch(elm);}return elm;};EPE.constructorToString=function(){var s=Function.prototype.toString.apply(this);return s.match(/^function\s(\w+)/)[1];};EPE.init=function(){var a=document.all;var l=a.length;for(var i=0;i<l;i++){if(a[i].tagName!='!'&&a[i].tagName!='epe')EPE.extend(a[i]);}for(var i=0;i<EPE.init.aux.length;i++)EPE.init.aux[i]();if(EPE.__R1)EPE.__R1();};EPE.init.aux=[];EPE.enableWatch=function(elm){elm.attachEvent('onpropertychange',EPE.checkInnerHTML);};EPE.disableWatch=function(elm){elm.detachEvent('onpropertychange',EPE.checkInnerHTML);};EPE.checkInnerHTML=function(){if(event.srcElement&&event.propertyName=='innerHTML'){var elm=event.srcElement;if(elm.childNodes){for(var i=0;i<elm.childNodes.length;i++){if(elm.childNodes[i].tagName)EPE.extendInnerHTML(elm.childNodes[i]);}}}else{if(event.srcElement)EPE.PlugIn.executeChange(event.srcElement,event);else if(this==document)EPE.PlugIn.executeChange(document,event);}};EPE.extendInnerHTML=function(node){if(node.childNodes){for(var i=0;i<node.childNodes.length;i++){if(node.childNodes[i].tagName&&node.childNodes[i].childNodes)EPE.extendInnerHTML(node.childNodes[i]);}}if(node&&node.tagName){EPE.extend(node);EPE.PlugIn.executeAttach(node);}};if(EPE.CACHE_ELEMENTS){EPE.cache=EPE.IECreateElement('epe');document.documentElement.childNodes[0].appendChild(EPE.cache);EPE.cache.add=function(elm){if(elm.canHaveChildren){EPE.cache.appendChild(elm);elm.cached=true;}};EPE.cache.remove=function(elm){elm.cached=null;if(elm.childNodes.length){for(var i=0;i<elm.childNodes.length;i++)if(elm.childNodes[i].cached)EPE.cache.remove(elm.childNodes[i]);}EPE.cache.removeChild(elm);};}EPE.PlugIn=function(t){this.con=t?EPE.tags[t.toLowerCase()]: HTMLElement;if(!this.con)throw new Error('EPE.PlugIn: No constructor for tag found.');};EPE.PlugIn.create={};EPE.PlugIn.change={};EPE.PlugIn.attach={};EPE.PlugIn.prototype.addEPEListener=function(t,f){var con=this.con.toString();if(!EPE.PlugIn[t][con]){EPE.PlugIn[t][con]=[];EPE.PlugIn[t][con].push(f);}else{var l=EPE.PlugIn[t][con].length;for(var i=0;i<l;i++){if(EPE.PlugIn[t][con]==f)return;}EPE.PlugIn[t][con].push(f);}};EPE.PlugIn.prototype.removeEPEListener=function(t,f){var con=this.con.toString();if(!EPE.PlugIn[t][con])return;var l=EPE.PlugIn[t][con].length;var n=0;for(var i=0;i<l;i++)EPE.PlugIn[t][con][i]==f?n++: EPE.PlugIn[t][con][i-n]=EPE.PlugIn[t][con][i];EPE.PlugIn[t][con].length=EPE.PlugIn[t][con].length-n;if(!EPE.PlugIn[t][con].length)delete EPE.PlugIn[t][con];};EPE.PlugIn.executeCreate=function(elm){var con=null;if(elm.nodeName!='APPLET'&&elm.nodeName!='OBJECT'){con=elm.constructor.toString();}else{try{con=elm.constructor.toString();}catch(ex){}}if(con!=null&&this.create[con]){if(elm.nodeName!='APPLET'&&elm.nodeName!='OBJECT'){for(var i=0;i<this.create[con].length;i++)this.create[con][i].apply(elm);}else{for(var i=0;i<this.create[con].length;i++)try{this.create[con][i].apply(elm);}catch(ex){}}}else if(this.create['HTMLElement']){for(var i=0;i<this.create['HTMLElement'].length;i++){if(elm.nodeName!='APPLET'&&elm.nodeName!='OBJECT'){this.create['HTMLElement'][i].apply(elm);}else{try{this.create['HTMLElement'][i].apply(elm);}catch(ex){}}}}};EPE.PlugIn.executeChange=function(elm,e){var con=elm.constructor.toString();EPE.disableWatch(elm);if(this.change[con]){for(var i=0;i<this.change[con].length;i++)this.change[con][i].apply(elm,[e]);}else if(this.change['HTMLElement']){for(var i=0;i<this.change['HTMLElement'].length;i++)this.change['HTMLElement'][i].apply(elm,[e]);}EPE.enableWatch(elm);};EPE.PlugIn.executeAttach=function(elm){var con=elm.constructor.toString();EPE.disableWatch(elm);if(this.attach[con]){for(var i=0;i<this.attach[con].length;i++)this.attach[con][i].apply(elm);}if(this.attach['HTMLElement']){for(var i=0;i<this.attach['HTMLElement'].length;i++)this.attach['HTMLElement'][i].apply(elm);}EPE.enableWatch(elm);};EPE.appendChild=function(elm){EPE.extendInnerHTML(elm);if(EPE.CACHE_ELEMENTS&&elm.cached)EPE.cache.remove(elm);return this._appendChild(elm);};EPE.insertBefore=function(newChild,refChild){EPE.extendInnerHTML(newChild);if(EPE.CACHE_ELEMENTS&&newChild.cached)EPE.cache.remove(newChild);return this._insertBefore(newChild,refChild);};EPE.replaceChild=function(newChild,oldChild){EPE.extendInnerHTML(newChild);if(EPE.CACHE_ELEMENTS&&newChild.cached)EPE.cache.remove(newChild);return this._replaceChild(newChild,oldChild);};EPE.insertRow=function(i){var tr=this._insertRow(i);return tr?EPE.extend(tr): null;};EPE.insertCell=function(i){var td=this._insertCell(i);return td?EPE.extend(td): null;};EPE.createCaption=function(){var cap=this._createCaption();return cap?EPE.extend(cap): null;};EPE.createTHead=function(){var th=this._createTHead();return th?EPE.extend(th): null;};EPE.createTFoot=function(){var tf=this._createTFoot();return tf?EPE.extend(tf): null;};if(EPE.ENABLE_HTMLCOLLECTIONS){EPE.getElementsByTagName=function(t){var c=new HTMLCollection(this._getElementsByTagName(t));return c;};}EPE.initPrototype=function(oCon){oCon._prototype=oCon.prototype;oCon.prototype=EPE.IECreateElement('epe');for(var p in oCon._prototype)oCon.prototype[p]=oCon._prototype[p];oCon.prototype.constructor=oCon;oCon.toString=EPE.constructorToString;document.documentElement.childNodes[0].appendChild(oCon.prototype);oCon.prototype.attachEvent('onpropertychange',EPE.updatePrototype);};EPE.updatePrototype=function(){var p=event.propertyName;var src=event.srcElement;src.constructor._prototype[p]=src[p];if(src.constructor==HTMLElement){var a=EPE.uniqueTags;var l=a.length;for(var i=0;i<l;i++){a[i]._prototype[p]=src[p];a[i].prototype.detachEvent('onpropertychange',EPE.updatePrototype);a[i].prototype[p]=src[p];a[i].prototype.attachEvent('onpropertychange',EPE.updatePrototype);}EPE.updateAllElements(p,src[p]);}else{var a=src.constructor.tags;var l=a.length;for(var i=0;i<l;i++)EPE.updateElements(a[i],p,src[p]);}};EPE.updateAllElements=function(p,v){var elms=document.all;var l=elms.length;for(var i=0;i<l;i++){if(elms[i].tagName!='!'&&elms[i].tagName!='epe'){EPE.disableWatch(elms[i]);elms[i][p]=v;EPE.enableWatch(elms[i]);}}};EPE.updateElements=function(tag,p,v){var elms=document.getElementsByTagName(tag);var l=elms.length;for(var i=0;i<l;i++){EPE.disableWatch(elms[i]);elms[i][p]=v;EPE.enableWatch(elms[i]);}};EPE.tags={a: HTMLAnchorElement,applet: HTMLAppletElement,area: HTMLAreaElement,base: HTMLBaseElement,basefont: HTMLBaseFontElement,body: HTMLBodyElement,br: HTMLBRElement,button: HTMLButtonElement,caption: HTMLTableCaptionElement,col: HTMLTableColElement,colgroup: HTMLTableColElement,del: HTMLModElement,dir: HTMLDirectoryElement,div: HTMLDivElement,dl: HTMLDListElement,em: HTMLSpanElement,fieldset: HTMLFieldSetElement,font: HTMLFontElement,form: HTMLFormElement,frame: HTMLFrameElement,frameset: HTMLFrameSetElement,h1: HTMLHeadingElement,h2: HTMLHeadingElement,h3: HTMLHeadingElement,h4: HTMLHeadingElement,h5: HTMLHeadingElement,h6: HTMLHeadingElement,head: HTMLHeadElement,hr: HTMLHRElement,html: HTMLHtmlElement,iframe: HTMLIFrameElement,img: HTMLImageElement,input: HTMLInputElement,ins: HTMLModElement,isindex: HTMLIsIndexElement,label: HTMLLabelElement,legend: HTMLLegendElement,li: HTMLLIElement,link: HTMLLinkElement,map: HTMLMapElement,menu: HTMLMenuElement,meta: HTMLMetaElement,object: HTMLObjectElement,ol: HTMLOListElement,optgroup: HTMLOptGroupElement,option: HTMLOptionElement,p: HTMLParagraphElement,param: HTMLParamElement,pre: HTMLPreElement,q: HTMLQuoteElement,select: HTMLSelectElement,script: HTMLScriptElement,span: HTMLSpanElement,strike: HTMLSpanElement,strong: HTMLSpanElement,style: HTMLStyleElement,table: HTMLTableElement,tbody: HTMLTableSectionElement,td: HTMLTableCellElement,textarea: HTMLTextAreaElement,tfoot: HTMLTableSectionElement,th: HTMLTableCellElement,thead: HTMLTableSectionElement,title: HTMLTitleElement,tr: HTMLTableRowElement,ul: HTMLUListElement};EPE.uniqueTags=[];for(var p in EPE.tags)EPE.uniqueTags.push(EPE.tags[p]);var a=[];var l=EPE.uniqueTags.length;for(var i=0;i<l;i++){for(var j=i+1;j<l;j++){if(EPE.uniqueTags[i]==EPE.uniqueTags[j])j=++i;}a.push(EPE.uniqueTags[i]);}EPE.uniqueTags=a;/*@cc_on function HTMLDocument(){}document.constructor=HTMLDocument;HTMLDocument.toString=EPE.constructorToString;function HTMLElement(t){if(t){var elm=EPE.IECreateElement(t);EPE.extend(elm,arguments.callee);return elm;}}HTMLElement.tags=['all'];function HTMLAnchorElement(){var elm=EPE.IECreateElement('a');EPE.extend(elm,arguments.callee);return elm;}HTMLAnchorElement.tags=['a'];function HTMLAppletElement(){var elm=EPE.IECreateElement('applet');EPE.extend(elm,arguments.callee);return elm;}HTMLAppletElement.tags=['applet'];function HTMLAreaElement(){var elm=EPE.IECreateElement('area');EPE.extend(elm,arguments.callee);return elm;}HTMLAreaElement.tags=['area'];function HTMLBaseElement(){var elm=EPE.IECreateElement('base');EPE.extend(elm,arguments.callee);return elm;}HTMLBaseElement.tags=['base'];function HTMLBaseFontElement(){var elm=EPE.IECreateElement('basefont');EPE.extend(elm,arguments.callee);return elm;}HTMLBaseFontElement.tags=['basefont'];function HTMLBodyElement(){var elm=EPE.IECreateElement('body');EPE.extend(elm,arguments.callee);return elm;}HTMLBodyElement.tags=['body'];function HTMLBRElement(){var elm=EPE.IECreateElement('br');EPE.extend(elm,arguments.callee);return elm;}HTMLBRElement.tags=['br'];function HTMLButtonElement(){var elm=EPE.IECreateElement('button');EPE.extend(elm,arguments.callee);return elm;}HTMLButtonElement.tags=['button'];function HTMLTableCaptionElement(){var elm=EPE.IECreateElement('caption');EPE.extend(elm,arguments.callee);return elm;}HTMLTableCaptionElement.tags=['caption'];function HTMLTableColElement(tag){var elm=EPE.IECreateElement(tag);EPE.extend(elm,arguments.callee);return elm;}HTMLTableColElement.tags=['col','colgroup'];function HTMLDirectoryElement(){var elm=EPE.IECreateElement('dir');EPE.extend(elm,arguments.callee);return elm;}HTMLDirectoryElement.tags=['dir'];function HTMLDivElement(){var elm=EPE.IECreateElement('div');EPE.extend(elm,arguments.callee);return elm;}HTMLDivElement.tags=['div'];function HTMLDListElement(){var elm=EPE.IECreateElement('dl');EPE.extend(elm,arguments.callee);return elm;}HTMLDListElement.tags=['dl'];function HTMLFieldSetElement(){var elm=EPE.IECreateElement('fieldset');EPE.extend(elm,arguments.callee);return elm;}HTMLFieldSetElement.tags=['fieldset'];function HTMLFontElement(){var elm=EPE.IECreateElement('font');EPE.extend(elm,arguments.callee);return elm;}HTMLFontElement.tags=['font'];function HTMLFormElement(){var elm=EPE.IECreateElement('form');EPE.extend(elm,arguments.callee);return elm;}HTMLFormElement.tags=['form'];function HTMLFrameElement(){var elm=EPE.IECreateElement('frame');EPE.extend(elm,arguments.callee);return elm;}HTMLFrameElement.tags=['frame'];function HTMLFrameSetElement(){var elm=EPE.IECreateElement('frameset');EPE.extend(elm,arguments.callee);return elm;}HTMLFrameSetElement.tags=['framset'];function HTMLHeadingElement(t){var elm=EPE.IECreateElement(t);EPE.extend(elm,arguments.callee);return elm;}HTMLHeadingElement.tags=['h1','h2','h3','h4','h5','h6'];function HTMLHeadElement(){var elm=EPE.IECreateElement('head');EPE.extend(elm,arguments.callee);return elm;}HTMLHeadElement.tags=['head'];function HTMLHRElement(){var elm=EPE.IECreateElement('hr');EPE.extend(elm,arguments.callee);return elm;}HTMLHRElement.tags=['hr'];function HTMLHtmlElement(){var elm=EPE.IECreateElement('html');EPE.extend(elm,arguments.callee);return elm;}HTMLHtmlElement.tags=['html'];function HTMLIFrameElement(){var elm=EPE.IECreateElement('iframe');EPE.extend(elm,arguments.callee);return elm;}HTMLIFrameElement.tags=['iframe'];function HTMLImageElement(){var elm=EPE.IECreateElement('img');EPE.extend(elm,arguments.callee);return elm;}HTMLImageElement.tags=['img'];function HTMLInputElement(){var elm=EPE.IECreateElement('input');EPE.extend(elm,arguments.callee);return elm;}HTMLInputElement.tags=['input'];function HTMLModElement(t){var elm=EPE.IECreateElement(t);EPE.extend(elm,arguments.callee);return elm;}HTMLModElement.tags=['del','ins'];function HTMLIsIndexElement(){var elm=EPE.IECreateElement('isindex');EPE.extend(elm,arguments.callee);return elm;}HTMLIsIndexElement.tags=['isindex'];function HTMLLabelElement(){var elm=EPE.IECreateElement('label');EPE.extend(elm,arguments.callee);return elm;}HTMLLabelElement.tags=['label'];function HTMLLegendElement(){var elm=EPE.IECreateElement('legend');EPE.extend(elm,arguments.callee);return elm;}HTMLLegendElement.tags=['legend'];function HTMLLIElement(){var elm=EPE.IECreateElement('li');EPE.extend(elm,arguments.callee);return elm;}HTMLLIElement.tags=['li'];function HTMLLinkElement(){var elm=EPE.IECreateElement('link');EPE.extend(elm,arguments.callee);return elm;}HTMLLinkElement.tags=['link'];function HTMLMapElement(){var elm=EPE.IECreateElement('map');EPE.extend(elm,arguments.callee);return elm;}HTMLMapElement.tags=['map'];function HTMLMenuElement(){var elm=EPE.IECreateElement('menu');EPE.extend(elm,arguments.callee);return elm;}HTMLMenuElement.tags=['menu'];function HTMLMetaElement(){var elm=EPE.IECreateElement('meta');EPE.extend(elm,arguments.callee);return elm;}HTMLMetaElement.tags=['meta'];function HTMLObjectElement(){var elm=EPE.IECreateElement('object');EPE.extend(elm,arguments.callee);return elm;}HTMLObjectElement.tags=['object'];function HTMLOListElement(){var elm=EPE.IECreateElement('ol');EPE.extend(elm,arguments.callee);return elm;}HTMLOListElement.tags=['ol'];function HTMLOptGroupElement(){var elm=EPE.IECreateElement('optgroup');EPE.extend(elm,arguments.callee);return elm;}HTMLOptGroupElement.tags=['optgroup'];function HTMLOptionElement(){var elm=EPE.IECreateElement('option');EPE.extend(elm,arguments.callee);return elm;}HTMLOptionElement.tags=['option'];function HTMLParagraphElement(){var elm=EPE.IECreateElement('p');EPE.extend(elm,arguments.callee);return elm;}HTMLParagraphElement.tags=['p'];function HTMLParamElement(){var elm=EPE.IECreateElement('param');EPE.extend(elm,arguments.callee);return elm;}HTMLParamElement.tags=['param'];function HTMLPreElement(){var elm=EPE.IECreateElement('pre');EPE.extend(elm,arguments.callee);return elm;}HTMLPreElement.tags=['pre'];function HTMLQuoteElement(){var elm=EPE.IECreateElement('q');EPE.extend(elm,arguments.callee);return elm;}HTMLQuoteElement.tags=['q'];function HTMLSelectElement(){var elm=EPE.IECreateElement('select');EPE.extend(elm,arguments.callee);return elm;}HTMLSelectElement.tags=['select'];function HTMLScriptElement(){var elm=EPE.IECreateElement('script');EPE.extend(elm,arguments.callee);return elm;}HTMLScriptElement.tags=['script'];function HTMLSpanElement(t){var elm=EPE.IECreateElement(t);EPE.extend(elm,arguments.callee);return elm;}HTMLSpanElement.tags=['em','span','strike','strong'];function HTMLStyleElement(){var elm=EPE.IECreateElement('style');EPE.extend(elm,arguments.callee);return elm;}HTMLStyleElement.tags=['style'];function HTMLTableElement(){var elm=EPE.IECreateElement('table');EPE.extend(elm,arguments.callee);elm._createTCaption=elm.createTCaption;elm._createTHead=elm.createTHead;elm._createTFoot=elm.createTFoot;elm._insertRow=elm.insertRow;elm.createTCaption=EPE.createTCaption;elm.createTHead=EPE.createTHead;elm.createTFoot=EPE.createTFoot;elm.insertRow=EPE.insertRow;return elm;}HTMLTableElement.tags=['table'];function HTMLTableSectionElement(t){var elm=EPE.IECreateElement(t);EPE.extend(elm,arguments.callee);elm._insertRow=elm.insertRow;elm.insertRow=EPE.insertRow;return elm;}HTMLTableSectionElement.tags=['tbody','tfoot','thead'];function HTMLTableCellElement(t){var elm=EPE.IECreateElement(t);EPE.extend(elm,arguments.callee);return elm;}HTMLTableCellElement.tags=['td','th'];function HTMLTextAreaElement(){var elm=EPE.IECreateElement('textarea');EPE.extend(elm,arguments.callee);return elm;}HTMLTextAreaElement.tags=['textarea'];function HTMLTitleElement(){var elm=EPE.IECreateElement('title');EPE.extend(elm,arguments.callee);return elm;}HTMLTitleElement.tags=['title'];function HTMLTableRowElement(){var elm=EPE.IECreateElement('tr');EPE.extend(elm,arguments.callee);elm._insertCell=elm.insertCell;elm.insertCell=EPE.insertCell;return elm;}HTMLTableRowElement.tags=['tr'];function HTMLUListElement(){var elm=EPE.IECreateElement('ul');EPE.extend(elm,arguments.callee);return elm;}HTMLUListElement.tags=['ul'];@*/ EPE.initPrototype(HTMLElement);var a=EPE.uniqueTags;var l=a.length;for(var i=0;i<l;i++)EPE.initPrototype(a[i]);}if(document.createEventObject){EPE.PlugIn.CssFloat=new EPE.PlugIn();EPE.PlugIn.CssFloat.addEPEListener('attach',function(){if(this.style.cssFloat)this.style.styleFloat=this.style.cssFloat;});EPE.PlugIn.CssFloat.addEPEListener('change',function(e){if(e.propertyName=='style.cssFloat')this.style.styleFloat=this.style.cssFloat;});}if(document.createEventObject){UEM={};UEM.WATCH_PROPERTIES=1;UEM.CAPTURE_ON_TARGET=1;UEM.ADD_TO_WINDOW=false;UEM.addEventListener=function(type,fnc,useCapture){if(this.self&&!UEM.ADD_TO_WINDOW){if(type=='load')window.attachEvent('onload',function(){var e=UEM.createEventObject(window.event);fnc(e);});else{UEM.ADD_TO_WINDOW=true;arguments.callee.call(window,type,fnc,useCapture);UEM.ADD_TO_WINDOW=false;}return;}type=UEM.getEventType(type);EPE.disableWatch(this);var eType='UEM'+type;if(!this[eType])this[eType]=new Array();var l=this[eType].length;for(var i=0;i<l;i++){if(this[eType][i].fnc==fnc&&this[eType][i].useCapture===useCapture){EPE.enableWatch(this);return;}}if(useCapture){for(var i=0;i<l;i++){if(!this[eType][i].useCapture)break;}var bHandlers=this[eType].splice(i,this[eType].length-i);this[eType][i]={};this[eType][i].useCapture=useCapture;this[eType][i].fnc=fnc;this[eType]=this[eType].concat(bHandlers);}else{this[eType][l]={};this[eType][l].useCapture=useCapture;this[eType][l].fnc=fnc;}this['on'+type]=UEM.wrapper;EPE.enableWatch(this);};UEM.removeEventListener=function(type,fnc,useCapture){type=UEM.getEventType(type);EPE.disableWatch(this);var eType='UEM'+type;if(this[eType]){var l=this[eType].length;for(var i=0;i<l;i++){if(this[eType][i].fnc==fnc&&this[eType][i].useCapture===useCapture){for(var j=i;j<l-1;j++){this[eType][j]=this[eType][j+1];}this[eType].length--;if(!this[eType].length){this[eType]=null;this['on'+type]=null;}break;}}}EPE.enableWatch(this);};document.createEvent=function(eventClass,e){if(eventClass=='Event'||eventClass=='HTMLEvent'||eventClass=='UIEvent'||eventClass=='TextEvent'||eventClass=='MouseEvent'||eventClass=='KeyboardEvent'||eventClass=='MutationEvent'){if(eventClass=='HTMLEvent')eventClass='Event';return new window[eventClass](e);}else throw new Error('UEM: Event class not supported.');};UEM.dispatchEvent=function(e){e.target=this;UEM.wrapper.call(this,e);};UEM.removeAllEventListeners=function(type){UEM.getEventType(type);if(type){this['UEM'+type]=null;this['on'+type]=null;}else{}};UEM.getPossibleEventTypes=function(tag){return UEM.elementEventTypes.allTags.concat(UEM.elementEventTypes[tag]);};UEM.elementEventTypes={allTags:['activate','click','dblclick','focusin','focusout','keydown','keypress','keyup','mousedown','mousemove','mouseout','mouseover','mousewheel','mouseup'],a:['blur','focus'],body:['load','unload'],button:['blur','focus'],form:['reset','submit'],input:['blur','change','focus','select'],label:['blur','focus'],select:['blur','change','focus'],textarea:['blur','change','focus','select']};UEM.canHaveEvents=function(tag){var a=UEM.noEvents;var l=a.length;for(var i=0;i<l;i++){if(a[i]==tag)return false;}return true;};UEM.noEvents=['br','style','script','head','meta','link','title'];UEM.getEventType=function(type){return UEM.eventTypes[type]?UEM.eventTypes[type]: type;};UEM.eventTypes={DOMActivate: 'activate',DOMFocusIn: 'focusin',DOMFocusOut: 'focusout',DOMMouseScroll: 'mousewheel'};UEM.convertInlineHandler=function(f){var m=f.toString().match(/\{([\s\S]*)\}/m)[1];var b=m.replace(/^\s*\/\/.*$/mg,'');return new Function('event',b);};UEM.wrapper=function(e){if(!e){window.event.cancelBubble=true;var e=UEM.createEventObject(window.event);}var eType='UEM'+e.type;var aCap=[];var aBub=[];var n=this;while((n=n.parentNode)!=null){if(n[eType])aCap.push(n);}if(this==document&&document[eType])aCap.push(document);if(this==window&&window[eType])aCap.push(window);aCap.reverse();if(!e.propagate(aCap,true))return false;e.eventPhase=Event.AT_TARGET;if(this[eType]){var l=this[eType].length;for(var i=0;i<this[eType].length;i++){e.currentTarget=this;if(this!=document){if(!this[eType][i].useCapture||UEM.CAPTURE_ON_TARGET){try{this[eType][i].fnc.call(this,e);}catch(err){alert(this[eType][0].fnc);var s='';var o=this[eType][i];for(var p in o)s+=p+': '+o[p]+'\n';alert(s);alert(e.target.tagName);}if(e.propagationStopped)return false;if(!this[eType])break;else if(l>this[eType].length){l=this[eType].length;i--;}}}}}if(e.bubbles){n=this;while((n=n.parentNode)!=null){if(n[eType])aBub.push(n);}if(this==document&&document[eType])aBub.push(document);if(this==window&&window[eType])aBub.push(window);e.eventPhase=Event.BUBBLING_PHASE;if(!e.propagate(aBub,false))return false;}return true;};window.addEventListener=UEM.addEventListener;window.removeEventListener=UEM.removeEventListener;window.dispatchEvent=UEM.dispatchEvent;window.removeAllEventListeners=UEM.removeAllEventListeners;document.addEventListener=UEM.addEventListener;document.removeEventListener=UEM.removeEventListener;document.dispatchEvent=UEM.dispatchEvent;document.removeAllEventListeners=UEM.removeAllEventListeners;HTMLElement.prototype.addEventListener=UEM.addEventListener;HTMLElement.prototype.removeEventListener=UEM.removeEventListener;HTMLElement.prototype.dispatchEvent=UEM.dispatchEvent;HTMLElement.prototype.removeAllEventListeners=UEM.removeAllEventListeners;UEM.onElementCreate=function(){var tag=this.tagName.toLowerCase();if(!UEM.canHaveEvents(tag))return;var eTypes=UEM.getPossibleEventTypes(tag);var tmp='';for(var p in eTypes){tmp='on'+eTypes[p];if(this[tmp]){this.addEventListener(eTypes[p],UEM.convertInlineHandler(this[tmp]),false);}}};UEM.onElementChange=function(e){var p=e.propertyName;if(p.match(/^on/))this.addEventListener(p,this[p],false);};EPE.PlugIn.UEM=new EPE.PlugIn();EPE.PlugIn.UEM.addEPEListener('create',UEM.onElementCreate);if(UEM.WATCH_PROPERTIES)EPE.PlugIn.UEM.addEPEListener('change',UEM.onElementChange);UEM.createEventObject=function(ie_event){var eClass=UEM.getEventClass(ie_event.type);var e=new window[eClass](ie_event);e.initUEMEvent(ie_event);var bubbles=UEM.doesBubble(ie_event.type);var cancelable=ie_event.cancelable!==false||ie_event.cancelable===undefined?UEM.isCancelable(ie_event.type): false;switch(eClass){case 'Event': e.initEvent(ie_event.type,bubbles,cancelable);break;case 'UIEvent': e.initUIEvent(ie_event.type,bubbles,cancelable,window,null);break;case 'MouseEvent': var detail=null;if(ie_event.type=='dblclick')detail=2;else if(ie_event.type=='click'||ie_event.type=='mouseup'||ie_event.type=='mousedown')detail=1;else if(ie_event.type=='mousewheel')detail=-1*ie_event.wheelDelta/40;var button=UEM.getButton(ie_event.button);var relatedTarget=null;if(ie_event.type=='mouseout')relatedTarget=ie_event.toElement;else if(ie_event.type=='mouseover')relatedTarget=ie_event.fromElement;e.initMouseEvent(ie_event.type,bubbles,cancelable,window,detail,ie_event.screenX,ie_event.screenY,ie_event.clientX,ie_event.clientY,ie_event.ctrlKey,ie_event.altKey,ie_event.shiftKey,null,button,relatedTarget);break;case 'TextEvent': var data=String.fromCharCode(ie_event.keyCode);e.initTextEvent(ie_event.type,bubbles,cancelable,window,data);e.ctrlKey=ie_event.ctrlKey;e.altKey=ie_event.altKey;e.shiftKey=ie_event.shiftKey;e.metaKey=false;break;case 'KeyboardEvent': var modifiersList='';var keyIdentifier=null;e.keyCode=ie_event.keyCode;if(UEM.getW3CKeyIdentifier){keyIdentifier=UEM.getW3CKeyIdentifier(ie_event.keyCode);}var keyLocation=KeyboardEvent.DOM_KEY_LOCATION_STANDARD;if(ie_event.keyCode==17)keyLocation=ie_event.ctrlLeft?KeyboardEvent.DOM_KEY_LOCATION_LEFT : KeyboardEvent.DOM_KEY_LOCATION_RIGHT;else if(ie_event.keyCode==16)keyLocation=ie_event.shiftLeft?KeyboardEvent.DOM_KEY_LOCATION_LEFT : KeyboardEvent.DOM_KEY_LOCATION_RIGHT;else if(ie_event.keyCode==18)keyLocation=ie_event.altLeft?KeyboardEvent.DOM_KEY_LOCATION_LEFT : KeyboardEvent.DOM_KEY_LOCATION_RIGHT;else if(ie_event.keyCode==91)keyLocation=KeyboardEvent.DOM_KEY_LOCATION_LEFT;else if(ie_event.keyCode==92)keyLocation=KeyboardEvent.DOM_KEY_LOCATION_RIGHT;else if(96<=ie_event.keyCode&&ie_event.keyCode<=105)keyLocation=KeyboardEvent.DOM_KEY_LOCATION_NUMPAD;if(ie_event.ctrlKey)modifiersList+=" Control";if(ie_event.altKey)modifiersList+=" Alt";if(ie_event.shiftKey)modifiersList+=" Shift";if(modifiersList.length>0)modifiersList=modifiersList.substring(1);e.initKeyboardEvent(ie_event.type,bubbles,cancelable,window,keyIdentifier,keyLocation,modifiersList);break;case 'MutationEvent': break;default: break;}return e;};UEM.isCancelable=function(type){try{return UEM.eventTable[type].cancels;}catch(e){throw new Error('UEM: Unsupported event type: '+type);}};UEM.doesBubble=function(type){try{return UEM.eventTable[type].bubbles;}catch(e){throw new Error('UEM: Unsupported event type: '+type);}};UEM.getButton=function(i){switch(i){case 1: return 0;case 4: return 1;default: return i;}};UEM.getIEButton=function(i){switch(i){case 0: return 1;case 1: return 4;default: return i;}};UEM.getEventClass=function(type){try{return UEM.eventTable[type].eventClass;}catch(e){throw new Error('UEM: Unsupported event type: '+type);}};UEM.eventTable={abort:{cancels: false,bubbles: true,eventClass: 'Event'},activate:{cancels: true,bubbles: true,eventClass: 'UIEvent'},blur:{cancels: false,bubbles: false,eventClass: 'UIEvent'},change:{cancels: false,bubbles: true,eventClass: 'Event'},click:{cancels: true,bubbles: true,eventClass: 'MouseEvent'},contextmenu:{cancels: true,bubbles: true,eventClass: 'MouseEvent'},dblclick:{cancels: true,bubbles: true,eventClass: 'MouseEvent'},error:{cancels: false,bubbles: true,eventClass: 'Event'},focus:{cancels: false,bubbles: false,eventClass: 'UIEvent'},focusin:{cancels: false,bubbles: true,eventClass: 'UIEvent'},focusout:{cancels: false,bubbles: true,eventClass: 'UIEvent'},keydown:{cancels: true,bubbles: true,eventClass: 'KeyboardEvent'},keypress:{cancels: true,bubbles: true,eventClass: 'TextEvent'},keyup:{cancels: true,bubbles: true,eventClass: 'KeyboardEvent'},load:{cancels: false,bubbles: false,eventClass: 'Event'},mousedown:{cancels: true,bubbles: true,eventClass: 'MouseEvent'},mousemove:{cancels: true,bubbles: true,eventClass: 'MouseEvent'},mouseover:{cancels: true,bubbles: true,eventClass: 'MouseEvent'},mouseout:{cancels: true,bubbles: true,eventClass: 'MouseEvent'},mousewheel:{cancels: true,bubbles: true,eventClass: 'MouseEvent'},mouseup:{cancels: true,bubbles: true,eventClass: 'MouseEvent'},reset:{cancels: true,bubbles: true,eventClass: 'Event'},resize:{cancels: false,bubbles: true,eventClass: 'Event'},scroll:{cancels: false,bubbles: true,eventClass: 'Event'},select:{cancels: false,bubbles: true,eventClass: 'Event'},submit:{cancels: true,bubbles: true,eventClass: 'Event'},textInput:{cancels: true,bubbles: true,eventClass: 'TextEvent'},unload:{cancels: false,bubbles: false,eventClass: 'Event'}};}