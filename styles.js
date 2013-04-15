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

var button_css = "button,.bcq_button {font: bold 13px Helvetica,Arial,sans-serif;background: url('https://read.amazon.com/static/app/010407152/t_2013_04_03_12_35_41/r9aaeQBsWR73/images/background/main/horizontal/btn-noise-bg.png') repeat scroll 0 0 #494949;border: 1px solid #2A2A2A;border-radius: 4px 4px 4px 4px;box-shadow: 0 1px 1px #999999 inset;color: #FFFFFF;display: inline-block;float: none;margin-left: 5px;margin-right: 5.2px;margin-top: 6.5px;margin-bottom: 6.5px;opacity: 1;padding-top: 5.2px;padding-bottom: 5.2px; padding-left: 13px;padding-right: 13px;text-decoration: none;text-shadow: 0 1px 0 #000000;cursor: pointer;border-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-right-width: 1px; border-left-width: 1px;} .ui-state-default{background: url(images/ui-bg_glass_20_555555_1x400.png') repeat-x scroll 50% 50% #555555;border: 1px solid #666666;color: #EEEEEE;font-weight: bold;} .ui-widget {font-family: Helvetica,Arial,sans-serif;font-size: 1em;font-weight: bold;} .ui-button {cursor: pointer;display: inline-block;margin-right: 0.1em;overflow: visible;padding: 4px;position: relative;text-align: center;text-decoration: none !important;} .ui-corner-all, .ui-corner-bottom, .ui-corner-right, .ui-corner-br {border-bottom-right-radius: 6px;} .ui-corner-all, .ui-corner-bottom, .ui-corner-left, .ui-corner-bl {border-bottom-left-radius: 6px;} .ui-corner-all, .ui-corner-top, .ui-corner-right, .ui-corner-tr {border-top-right-radius: 6px;} .ui-corner-all, .ui-corner-top, .ui-corner-left, .ui-corner-tl {border-top-left-radius: 6px;} .ui-state-default {background: url('images/ui-bg_glass_20_555555_1x400.png') repeat-x scroll 50% 50% #555555;border: 1px solid #666666;color: #EEEEEE;font-weight: bold;} body {font-family: Helvetica,Arial,sans-serif;}";
//var button_text_css = ".ui-button-text {} .ui-button-text-only .ui-button-text {padding: 0.4em 1em;} .ui-button .ui-button-text {display: block;line-height: 1.4;}"

function addStyles() {
// add custom styles

//Button
addGlobalStyle(button_css);
//addGlobalStyle(button_text_css);

// Usernames
addGlobalStyle('.bcq_usrname {color:grey;font-size:small;font-style:italic;}');

// Error messages
addGlobalStyle('.bcq_ermsg {color:red;font-size:small;font-style:italic;margin:5px 0;}');
addGlobalStyle('#question_forum .bcq_ermsg {color:#f88;}');
addGlobalStyle('.bcq_sucmsg {color:green;font-size:small;font-style:italic;margin:5px 0;}');
addGlobalStyle('#question_forum .bcq_sucmsg {color:#8f8;}');

addGlobalStyle('#question_content,#bcq_poseform,textarea {font-family:Helvetica,​Arial,​sans-serif;}');
addGlobalStyle('#question_forum {margin:auto;padding:15px;color:white;} #question_content {background-color:#2A2A2A}');

addGlobalStyle('.bcq_q h4 {margin:6px 0px;} .bcq_q ul {margin:0 0 4px;padding-left:20px;} .bcq_q_inner {margin-left:20px;margin-bottom:15px;}');

// GoTo button
addGlobalStyle('.bcq_goto {font-size:small;color:blue;display:block;magin:auto;} .bcq_goto:hover {text-decoration:underline;}');

// Question expansion
//.bcq_hcontracted {display:block;max-height:40px;text-overflow:ellipsis;} .bcq_hexpanded {display:inline;}
addGlobalStyle('.bcq_qcontracted .bcq_q_inner {display:none;} .bcq_qcontracted h4:before {content:"[+] ";font-weight:normal;font-family:monospace;} .bcq_qexpanded h4:before {content:"[-] ";font-weight:normal;font-family:monospace;}');
}

