// Function from "Dive Into Greasemonkey"
function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}


function addStyles() {
// add custom styles

// Usernames
addGlobalStyle('.bcq_usrname {color:grey;font-size:small;font-style:italic;}');

addGlobalStyle('.bcq_q h4 {margin:6px 0px;} .bcq_q ul {margin:4px 0px;}');

// GoTo button
addGlobalStyle('.bcq_goto {font-size:small;color:blue;display:block;magin:auto;} .bcq_goto:hover {text-decoration:underline;}');

// Question expansion
//.bcq_hcontracted {display:block;max-height:40px;text-overflow:ellipsis;} .bcq_hexpanded {display:inline;}
addGlobalStyle('.bcq_qcontracted {display:none;} .bcq_hcontracted:before {content:"[+] ";font-weight:normal;font-family:monospace;} .bcq_hexpanded:before {content:"[-] ";font-weight:normal;font-family:monospace;}');
}
