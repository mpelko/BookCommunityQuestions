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
}
