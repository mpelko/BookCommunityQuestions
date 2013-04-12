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

// Error messages
addGlobalStyle('.bcq_ermsg {color:red;font-size:small;font-style:italic;margin:5px 0;}');

addGlobalStyle('#question_content,#bcq_poseform {font-family:Helvetica,​Arial,​sans-serif;}');
addGlobalStyle('#question_forum {margin:auto;padding:15px;}');

addGlobalStyle('.bcq_q h4 {margin:6px 0px;} .bcq_q ul {margin:0 0 4px;padding-left:20px;} .bcq_q_inner {margin-left:20px;margin-bottom:15px;}');

// GoTo button
addGlobalStyle('.bcq_goto {font-size:small;color:blue;display:block;magin:auto;} .bcq_goto:hover {text-decoration:underline;}');

// Question expansion
//.bcq_hcontracted {display:block;max-height:40px;text-overflow:ellipsis;} .bcq_hexpanded {display:inline;}
addGlobalStyle('.bcq_qcontracted .bcq_q_inner {display:none;} .bcq_qcontracted h4:before {content:"[+] ";font-weight:normal;font-family:monospace;} .bcq_qexpanded h4:before {content:"[-] ";font-weight:normal;font-family:monospace;}');
}
