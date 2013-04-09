// ==UserScript==
// @name       BookCommunityQuestions
// @namespace  https://read.amazon.com/
// @description    Makes magic happen
// @include  https://read.amazon.com/
// @include  http://read.amazon.com/
// @run-at        document-end
// @grant         none
// @require globals.js
// @require db_communication_DEBUG.js
// @require db_communication.js
// ==/UserScript==
// Notes:
//   * is a wildcard character
//   .tld is magic that matches all top-level domains (e.g. .com, .co.uk, .us, etc.)

function get_read_loc() {
    var doc2=document.getElementById("KindleReaderIFrame").contentDocument;
    var loct = doc2.getElementById('kindleReader_footer_message').textContent;
    var patt=/% · (\d+) of/;
    var matches = patt.exec(loct);
    var loc = matches[1];
    return loc;
}

function getBookName() {
    // <label id="kindleReader_title" style="color: rgb(153, 153, 153);">Les Misérables - Tome I - Fantine</label>
    var doc2=document.getElementById("KindleReaderIFrame").contentDocument;
    var book = doc2.getElementById("kindleReader_title").innerHTML;
    return book;
}

function greasemonkey_main() {
    //loc = get_read_loc();
    //book = getBookName();
    //alert(book + ': at ' + loc);
    setup_everything();
}
setTimeout(greasemonkey_main, 1800);


function setup_everything() {
//alert('setting up all');
    addPoseForm();
    setup_newels();
    setTimeout(setup_loopers, 500);
}

function setup_newels() {
//alert('setting up new elements');
    addPoseButton();
    make_panel();
    add_qmark_button();
}

function setup_loopers() {
//alert('adding loopers');
    var loopersrunner = window.setInterval(run_loopers,100);
}

function run_loopers() {
//alert('running loopers');
    refreshPoseButton();
    refreshQandApanel();
}

function refreshPoseButton() {
//alert('refreshing pose button');
    doc2=document.getElementById("KindleReaderIFrame").contentDocument;
    var myElem = doc2.getElementById('bcq_hoverbutton');
    if (myElem == null) {
//alert('had to add pose button');
        addPoseButton();
    }
    else {
//alert('reset pose class');
        myElem.className = "kindle_menu_button button_enabled ui-corner-right";
    }
    refreshMenuSep();
}

function refreshMenuSep() {
    doc2=document.getElementById("KindleReaderIFrame").contentDocument;
    if (doc2 == null) {
//        alert('No doc2');
        return false;
    }
    var popupmenu = doc2.getElementById('kindle_menu_border');
    if (popupmenu == null) {
//        alert('No kindle_menu_border');
        return false;
    }
    if (doc2.getElementById('kindleReader_menu_contextMenu').firstChild.className == 'dictionary expanded') {
        doc2.getElementById('bcq_menu_seperator').style.display = "none";
    }
    else {
        doc2.getElementById('bcq_menu_seperator').style.display = "";
    }
//    if (doc2.getElementById('kindleReader_menu_contextMenu').firstChild.id == 'kindle_menu_border') {
//        doc2.getElementById('bcq_menu_seperator').style.display = "";
//    }
//    else {
//        doc2.getElementById('bcq_menu_seperator').style.display = "none";
//    }
}

function refreshQandApanel() {
    var pres_loc = get_read_loc();
    if (last_loc!=pres_loc) {
        update_panel();
    }
    last_loc = pres_loc;
}

function addPoseButton() {
//alert('adding pose button');
    var doc2=document.getElementById("KindleReaderIFrame").contentDocument;
    if (doc2 == null) {
//        alert('No doc2');
        return false;
    }
    var popupmenu = doc2.getElementById('kindle_menu_border');
    if (popupmenu == null) {
//        alert('No kindle_menu_border');
        return false;
    }
    var newsep=document.createElement("div");
    newsep.className = "kindle_menu_separator"
    newsep.id = 'bcq_menu_seperator';
    newsep.style.display = "none";
    popupmenu.appendChild(newsep);
    var newbutton = document.createElement("div");
    newbutton.id = 'bcq_hoverbutton';
    newbutton.className="kindle_menu_button button_enabled ui-corner-right";
    newbutton.addEventListener('click',showPoseForm);
    var newbuttontext = document.createTextNode("Pose question");
    newbutton.appendChild(newbuttontext);
    popupmenu.appendChild(newbutton);
}


function addPoseForm() {
//alert('adding pose form');
//doc2=document.getElementById("KindleReaderIFrame").contentDocument;
var bgmask_container = document.createElement("div");
bgmask_container.innerHTML = '<div id="bcq_bgmask" style="position:absolute;left:0px;top:0px;height:100%;width:100%;background:rgba(50,50,50,0.7);z-index:10000;display:none;"><<div id="bcq_overform" style="border-radius: 25px; z-index: 10000; top: 20%; left: 20%; right: 20%; bottom: 20%; background: none repeat scroll 0% 0% rgb(250, 250, 250); border: 10px solid rgb(40, 40, 40); padding: 30px; position: absolute;"><form onsubmit="return false;"><p>Submit your question about this book: <i>' + getBookName() + '</i></p><p>Question:</p><textarea id="bcq_qsubmitinput" name="question-title" style="width:90%;height:100px;display:block;margin:auto;"></textarea><br/><div style="margin:auto;text-align:center;"><input id="bcq_posesubmitbutton" type="submit" name="submit" value="Post Question"/><button id="bcq_posecancelbutton" type="button">Cancel</button></div><form></div></div>';
document.body.appendChild(bgmask_container);

document.getElementById('bcq_posesubmitbutton').addEventListener('click', submitPoseForm);
document.getElementById('bcq_posecancelbutton').addEventListener('click', hidePoseForm);
// Add button to close this panel
// Add box for entering email address?
}


function showPoseForm() {
    document.getElementById('bcq_bgmask').style.display = 'block';
}

function hidePoseForm() {
    document.getElementById('bcq_bgmask').style.display = 'none';
}

function submitPoseForm() {
//alert('Submitting question');
    var loc = get_read_loc();
    var qtext = document.getElementById('bcq_qsubmitinput').value;
    var book = getBookName();
// Do something with this to submit it
// Check if submission is successful
// Tell the user whether or not successful
// Hide the submission box if appropriate
//alert('Sending question ' + qtext + ' ' + book + ' ' + loc);
send_question(qtext, book, loc);

//alert(' question sent');
document.getElementById('bcq_posesubmitbutton').value = 'Question sent';
document.getElementById('bcq_posesubmitbutton').disabled = true;

setTimeout(hidePoseForm,500);
setTimeout(update_panel,700);
setTimeout(resetPoseForm,700)
// Don't refresh the page
return false;
}

function resetPoseForm() {
    document.getElementById('bcq_posesubmitbutton').value = 'Post Question';
    document.getElementById('bcq_posesubmitbutton').disabled = false;
    document.getElementById('bcq_qsubmitinput').value = '';
}

/////////////////////////////////

function make_panel() {
//alert('making panel');

    document.body.style.background = "#f2f2e2";

   // Create the question content panel.
    var container = document.getElementById("KindleReaderContainer");
    var qcontent = document.createElement("div");
//   var qtextarea = document.createElement("textarea");
//   var qforum = document.createElement("div");
   
//   qforum.id = "question_forum";
//   qtextarea.rows = "3";
//   qtextarea.cols = "27";
//   qtextarea.id = "question_textarea";
//   qtextarea.style.postition = "absolute";
//   qtextarea.style.top = "300px";
//   qtextarea.style.right = "70px";
   
    qcontent.id = "question_content";
    qcontent.style.position = "absolute";
    qcontent.style.float = "left";
    qcontent.style.width = "30%";
    qcontent.style.top = "0";
    qcontent.style.right = "0";
//   qcontent.style.borderLeft="5px solid #333";
    qcontent.isout = "False";

    qcontent.innerHTML = '<div id="question_forum" style="margin:auto;padding:15px;"></div>';


    container.appendChild(qcontent);
//   qcontent.appendChild(qforum);
//   qcontent.appendChild(qtextarea);
    

    remove_panel();
    
    var doc2=document.getElementById("KindleReaderIFrame").contentDocument;
    var rightTurner = doc2.getElementById('kindleReader_pageTurnAreaRight');
    
    rightTurner.style.left="";
    rightTurner.style.right="0";
   
}


function remove_panel() {

    // Get the question content panel.
    var content = document.getElementById("KindleReaderContainer");
    var qcontent = document.getElementById("question_content");

    // Give the panel dimensions
    qcontent.style.display = "none";

    // Reduce size of content panel.
   var frame = document.getElementById("KindleReaderIFrame");
   frame.style.width = "100%";

}

function add_panel() {

   // Get the question content panel.
   var content = document.getElementById("KindleReaderContainer");
   var qcontent = document.getElementById("question_content");
   var qforum = document.getElementById("question_forum");

   // Give the panel dimensions
   qcontent.style.display = "block";
   // Sample text.
    update_panel();

   // Reduce size of content panel.
   var frame = document.getElementById("KindleReaderIFrame");
   frame.style.width = "70%";
}


function toggle_panel() {

   var qcontent = document.getElementById("question_content");
   if (qcontent.isout == "True") {
       remove_panel();
       qcontent.isout = "False";
   }
   else {
       add_panel();
       qcontent.isout = "True";
   }
}

function update_panel() {
    loc = get_read_loc();
    book = getBookName();
    htmlq = get_the_html_question(book, loc);
    if (htmlq == "") {
        htmlq = '<i>No questions here</i>';
        butt = false;
    }
    else {
        butt = true;
        htmlq += '<form onsubmit="return false;"><textarea id="question_textarea" style="width:100%;height:100px;"></textarea><input id="bcq_answbutton" type="submit" value="Add answer" /></form>';
    }
    qforum = document.getElementById("question_forum");
    qforum.innerHTML = '<h3>Q&A Forum</h3>' + htmlq;
    if (butt) {
        document.getElementById('bcq_answbutton').addEventListener('click', sendAnswerForm);
    }
}


function sendAnswerForm() {
    var answer = document.getElementById("question_textarea").value;
    var book_id = getBookName();
    var loc = get_read_loc();
    var qa = get_the_right_QA(book_id, loc)
    send_answer(answer, qa.title, book_id);
    document.getElementById("question_textarea").value = ""; 
    update_panel();   
    return false;
}


///////////////////////////

function add_qmark_button() {
//alert('adding qmark');

    doc2=document.getElementById("KindleReaderIFrame").contentDocument;
    topmenu=doc2.getElementById("readerControlsLeft");
    var qbutton = document.createElement("div");
    qbutton.id = "bcq_qbutton";
    qbutton.className="header_bar_icon";
    var qicon = document.createElement("img");
    qicon.src = "https://s3-eu-west-1.amazonaws.com/amazonhack/qbuttonTr.png"
    qicon.height = "25";
    qicon.width="16";
    qicon.type = "image";
    qicon.addEventListener('mouseout', function() {
       this.src='https://s3-eu-west-1.amazonaws.com/amazonhack/qbuttonTr.png'
    } );
    qicon.addEventListener('mouseover', function() {
       this.src='https://s3-eu-west-1.amazonaws.com/amazonhack/qbuttonTrBl.png'
    } );
    qicon.addEventListener('click', toggle_panel);
    qbutton.appendChild(qicon);
    topmenu.appendChild(qbutton);
}



