// ==UserScript==
// @name       BookCommunityQuestions
// @namespace  https://read.amazon.com/
// @description    Makes magic happen
// @include  https://read.amazon.com/
// @include  http://read.amazon.com/
// @run-at        document-end
// @grant         none
// @require globals.js
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
    loc = get_read_loc();
    book = getBookName();
    alert(book + ': at ' + loc);
    setup_everything();
}
setTimeout(greasemonkey_main, 2000);


function setup_everything() {
//alert('setting up all');
    addPoseForm();
    setTimeout(setup_newels, 2000);
    setTimeout(setup_loopers, 2000);
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
        myElem.className = "kindle_menu_button button_enabled";
    }
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
    var newsep=document.createElement("div");
    newsep.className = "kindle_menu_separator"
    newsep.style = "display: none;"
    popupmenu.appendChild(newsep);
    var newbutton = document.createElement("div");
    newbutton.id = 'bcq_hoverbutton';
    newbutton.className="kindle_menu_button button_enabled";
    newbutton.addEventListener('click',showPoseForm);
    var newbuttontext = document.createTextNode("Pose question");
    newbutton.appendChild(newbuttontext);
    popupmenu.appendChild(newbutton);
}


function addPoseForm() {
//alert('adding pose form');
//doc2=document.getElementById("KindleReaderIFrame").contentDocument;
var bgmask_container = document.createElement("div");
bgmask_container.innerHTML = '<div id="bcq_bgmask" style="position:absolute;left:0px;top:0px;height:100%;width:100%;background:rgba(100,100,100,0.5);z-index:10000;display:none;"><<div id="bcq_overform" style="border-radius: 15px 15px 15px 15px; z-index: 10000; top: 20%; left: 20%; right: 20%; bottom: 20%; background: none repeat scroll 0% 0% rgb(250, 250, 250); border: 10px solid rgb(51, 51, 51); padding: 30px; position: absolute;"><form onsubmit="return submitPoseForm()"><p>Submit your question about this book: <i>' + getBookName() + '</i></p><p>Question:</p><textarea name="question-title" cols="60" rows="10" id="bcq_qsubmitinput"></textarea><br/><input id="bcq_posesubmitbutton" type="submit" name="submit" value="Post Question"/><button type="button" onclick="hidePoseForm()">Cancel</button><form></div></div>';
document.body.appendChild(bgmask_container);
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
document.getElementById('bcq_posesubmitbutton').style.value = 'Question sent';
document.getElementById('bcq_posesubmitbutton').disabled = 'disabled';

setTimeout(hidePoseForm,1000);
// Don't refresh the page
return false;
}


/////////////////////////////////

function make_panel() {
//alert('making panel');

   document.body.style.background = "#fefef4";

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
   qcontent.style.float = "left";
   qcontent.style.width = "30%";
//   qcontent.style.borderLeft="5px solid #333";
   qcontent.isout = "False";

qcontent.innerHTML = '<div id="question_forum"></div>';


   container.appendChild(qcontent);
//   qcontent.appendChild(qforum);
//   qcontent.appendChild(qtextarea);

    


   remove_panel();
   
}


function remove_panel() {

    // Get the question content panel.
    var content = document.getElementById("KindleReaderContainer");
    var qcontent = document.getElementById("question_content");

    // Give the panel dimensions.
    qcontent.style.right = "70px";
    qcontent.style.top = "70px";
    qcontent.style.position = "absolute";
    qcontent.style.width = "0";
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

   // Give the panel dimensions.
   qcontent.style.right = "70px";
   qcontent.style.top = "70px";
   qcontent.style.position = "absolute";    
   qcontent.style.width = "250px";
   qcontent.style.background = "white";
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
    }
    qforum = document.getElementById("question_forum");
    qforum.innerHTML = '<h3>Q&A Forum</h3>' + htmlq + '<form><textarea id="question_textarea" rows="3" cols="27" style="top: 300px; right: 70px;"></textarea><input type="submit" value="Add answer" /></form>';
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



