
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

function refreshQAloc() {
    var pres_loc = get_read_loc();
    if (last_loc!=pres_loc) {
        updatePanelLoc();
    }
    last_loc = pres_loc;
}

function refreshQMark() {
    var doc2=document.getElementById("KindleReaderIFrame").contentDocument;
    var qbutton = doc2.getElementById("bcq_qbutton");
}

// --------------------- Posing a new Question ------------------------

// Adds the Pose question button next to Highlight and Note
// which appears when highlighting text
function addPoseButton() {
//alert('adding pose button');
    var doc2=document.getElementById("KindleReaderIFrame").contentDocument;
    if (doc2 == null) {
//        alert('No doc2');
        return false;
    }
    var popupparent = doc2.getElementById('kindleReader_menu_contextMenu');
    if (popupparent == null) {
//        alert('No kindleReader_menu_contextMenu');
        return false;
    }
    var x = popupparent.childNodes;
    popupmenu = null;
    for (i=0;i<x.length;i++) {
        if (x[i].id == 'kindle_menu_border') {
            popupmenu = x[i];
            break;
        }
    }
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


// Adds Background mask AND Pose Question form
function addPoseForm() {
//alert('adding pose form');
//doc2=document.getElementById("KindleReaderIFrame").contentDocument;
var bgmask_container = document.createElement("div");
bgmask_container.innerHTML = '<div id="bcq_posemask" style="position:absolute;left:0px;top:0px;height:100%;width:100%;background:rgba(50,50,50,0.7);z-index:10000;display:none;"><div id="bcq_poseform" style="border-radius: 25px; z-index: 10000; top: 20%; left: 20%; right: 20%; bottom: 20%; background: none repeat scroll 0% 0% rgb(250, 250, 250); border: 10px solid rgb(40, 40, 40); padding: 30px; position: absolute;"><form onsubmit="return false;"><p>Submit your question about this book: <i id="bcq_posebookname">' + getBookName() + '</i></p><p>Question:</p><textarea id="bcq_qsubmitinput" name="question-title" style="width:90%;height:100px;display:block;margin:auto;"></textarea><br/><div style="margin:auto;text-align:center;"><input id="bcq_posesubmitbutton" type="submit" name="submit" value="Post Question"/><button id="bcq_posecancelbutton" type="button">Cancel</button></div><form></div></div>';
document.body.appendChild(bgmask_container);

document.getElementById('bcq_posesubmitbutton').addEventListener('click', submitPoseForm);
document.getElementById('bcq_posecancelbutton').addEventListener('click', hidePoseForm);
// Add box for entering email address?
}


function showPoseForm() {
    document.getElementById('bcq_posemask').style.display = 'block';
    document.getElementById('bcq_poseform').style.display = 'block';
}

function hidePoseForm() {
    document.getElementById('bcq_posemask').style.display = 'none';
    document.getElementById('bcq_poseform').style.display = 'none';
}

function submitPoseForm() {
//alert('Submitting question');
    var loc = get_read_loc();
    var qtext = document.getElementById('bcq_qsubmitinput').value;
// Do something with this to submit it
// Check if submission is successful
// Tell the user whether or not successful
// Hide the submission box if appropriate
//alert('Sending question ' + qtext + ' ' + book + ' ' + loc);

// If not logged in, show login form and stop
if (!check_login()) {return false};

// If logged in, send the question and update HTML
send_question(qtext, getUsername(), current_book_id, loc);

//alert(' question sent');
document.getElementById('bcq_posesubmitbutton').value = 'Question sent';
document.getElementById('bcq_posesubmitbutton').disabled = true;

setTimeout(hidePoseForm,500);
//setTimeout(updatePanel,700);
setTimeout(resetPoseForm,700)
// Don't refresh the page
    updatePanelQA();
return false;
}

function resetPoseForm() {
    document.getElementById('bcq_posesubmitbutton').value = 'Post Question';
    document.getElementById('bcq_posesubmitbutton').disabled = false;
    document.getElementById('bcq_qsubmitinput').value = '';
}


// --------------------- Login form ------------------------

function check_login() {
    if (isLoggedIn()) {
        return true;
    }
    else {
        var usr = prompt("Please enter your username","");
        if (usr!=null && usr!="") {
            login_as(usr);
            return true;
        }
        else {
            return false;
        }
    }
}

// --------------------- Forum panel ------------------------

// Question mark button opens forum panel
function add_qmark_button() {
//alert('adding qmark');
    var doc2=document.getElementById("KindleReaderIFrame").contentDocument;
    var topmenu=doc2.getElementById("readerControlsLeft");
    var qbutton = document.createElement("div");
    qbutton.id = "bcq_qbutton";
    qbutton.className="header_bar_icon";
    var qicon = document.createElement("img");
    qicon.title = "Q&A Forum";
    qicon.alt = "Q&A Forum";
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
    qicon.addEventListener('click', togglePanel);
    qbutton.appendChild(qicon);
    topmenu.appendChild(qbutton);
}


function makePanel() {
//alert('making panel');

    document.body.style.background = "#e8e8e0"; // "#f2f2e2";

   // Create the question content panel.
    var container = document.getElementById("KindleReaderContainer");
    var qcontent = document.createElement("div");
   
    qcontent.id = "question_content";
    qcontent.style.position = "absolute";
    qcontent.style.float = "left";
    qcontent.style.width = "30%";
    qcontent.style.height = "100%";
    qcontent.style.overflow = "scroll";
    qcontent.style.top = "0";
    qcontent.style.right = "0";
    qcontent.isout = false;
    
    qcontent.innerHTML = '<div id="question_forum" style="margin:auto;padding:15px;"><h3>Q&A Forum</h3><div id="bcq_q-2"><p style="font-style:italic;">Loading...</p></div><div id="bcq_q-1"><p style="font-style:italic;display:none;">No questions here.</p></div></div>';

    container.appendChild(qcontent);
    
    hidePanel();
    
    var doc2=document.getElementById("KindleReaderIFrame").contentDocument;
    var rightTurner = doc2.getElementById('kindleReader_pageTurnAreaRight');
    
    if (rightTurner != null) {
        rightTurner.style.left="";
        rightTurner.style.right="0";
    }
}


function hidePanel() {
    // Get the question content panel.
    var content = document.getElementById("KindleReaderContainer");
    var qcontent = document.getElementById("question_content");

    // Give the panel dimensions
    qcontent.style.display = "none";

    // Reduce size of content panel.
   var frame = document.getElementById("KindleReaderIFrame");
   frame.style.width = "100%";

}

function showPanel() {
   // Get the question content panel.
   var content = document.getElementById("KindleReaderContainer");
   var qcontent = document.getElementById("question_content");
   var qforum = document.getElementById("question_forum");

   // Give the panel dimensions
   qcontent.style.display = "block";
   // Sample text.
   updatePanel();

   // Reduce size of content panel.
   var frame = document.getElementById("KindleReaderIFrame");
   frame.style.width = "70%";
}


function togglePanel() {
   var qcontent = document.getElementById("question_content");
   if (qcontent.isout == true) {
       hidePanel();
       qcontent.isout = false;
   }
   else {
       showPanel();
       qcontent.isout = true;
   }
}



function updatePanelQA() {
    // Get the list of questions and their answers
    // Find the div for each question
    // If it doesn't exist, add it
    // If it does exist, reset the answers within it
    var qforum = document.getElementById("question_forum");
    if (qforum==null) {return false};
    
    var QAs = allQA
    for (var j=0; j<QAs.length; j++) {
        Q = QAs[j];
        divid = 'bcq_q' + Q.questionID;
        qdiv = document.getElementById(divid);
        if (qdiv==null) {
            //append question
            qd = make_qnode(Q);
            qforum.appendChild(qd);
        }
        else {
            //update answers
            var x = qdiv.children;
            for (i=0; i<x.length; i++) {
                if (x[i].hasAttribute('is_answs')) {
                    y = x[i];
                    // Botched method
                    if (y.children.length == Q.answers.length) {
                        // do nothing
                    }
                    else {
                        var div = document.createElement('div');
                        div.innerHTML = html_answers(Q.answers);
                        var newy = div.firstChild
                        qdiv.replaceChild(newy,y);
//                        div.parentNode.removeChild(div);
                    }
                    break;
                }
            }
        }
    }
}


function html_qa(Q) {
    html = '<div id="bcq_q' + Q.questionID + '" qid="' + Q.questionID + '">';
    html += '<h4>' + Q.title + ' <span style="color:grey;font-size:small;font-style:italic;"> - ' + Q.username + '</span>' + '</h4>';
    html += html_answers(Q.answers);
    html += '<form id="bcq_q' + Q.questionID + '_ansform" onsubmit="return false;"><textarea id="bcq_q' + Q.questionID + '_ta" style="width:100%;height:100px;"></textarea><input id="bcq_q' + Q.questionID + '_answbutton" qid="' + Q.questionID + '" type="submit" value="Add answer" /></form>';
    html += '</div>';
    return html;
}


function make_qnode(Q) {
    var d = document.createElement('div');
    d.id = 'bcq_q' + Q.questionID;
    d.qid= Q.questionID;
    var h = document.createElement('h4');
    h.innerHTML = Q.title + ' <span class="bcq_usrname"> - ' + Q.username + '</span>';
    h.addEventListener('click', toggle_q_expansion);
    d.appendChild(h);
    
    var d2 = document.createElement('div');
    d2.id = 'bcq_q' + Q.questionID + '_inner';
    d2.className = 'bcq_qexpanded';
    d2.style.cursor = 'pointer';
    d2.innerHTML += html_answers(Q.answers);
    
    var f = document.createElement('form');
    f.id='bcq_q' + Q.questionID + '_ansform';
    f.action='#';
    f.onsubmit=function() {return false;};
    var t = document.createElement('textarea');
    t.id='bcq_q' + Q.questionID + '_ta';
    t.style.width = '100%';
    t.style.height = '100px';
    var i = document.createElement('input');
    i.id='bcq_q' + Q.questionID + '_answbutton';
    i.qid=Q.questionID;
    i.type="submit";
    i.value="Add answer";
    i.addEventListener('click', sendAnswerForm);
    f.appendChild(t);
    f.appendChild(i);

    d2.appendChild(f);
    d.appendChild(d2);
    return d;
}

function toggle_q_expansion() {
    var d2 = this.nextSibling;
    if (d2.className=='bcq_qexpanded') {
        d2.className = 'bcq_qcontracted';
    }
    else if (d2.className=='bcq_qcontracted') {
        d2.className = 'bcq_qexpanded';
    }
}

function html_answers(answs) {
    if(answs.length > 0) {
        html = '<ul is_answs=true class="bcq_answers">';
        for (var i = 0; i < answs.length; i++)  {
            html += '<li>' + answs[i].text + '<span class="bcq_usrname"> - ' + answs[i].username + '</span>' + '</li>';
        };
        html += '</ul>';
    }
    else {
        html = '<i is_answs=true style="padding:5px;">This question is unanswered. Can you help?</i>';
    }
    return html;
}

function updatePanelLoc() {
return;
    var QAs = allQA
    location = get_read_loc();
    nshown = 0;
    for (var j=0; j<QAs.length; j++) {
        Q = QAs[j];
        divid = 'bcq_q' + Q.questionID;
        qdiv = document.getElementById(divid);
        if (qdiv==null) {
            updatePanelQA();
            continue;
        }
        if (Q.location-2 < location && location < Q.location+25) {
            qdiv.style.display = "block";
            nshown++;
        }
        else {
            qdiv.style.display = "none";
        }
    }
    if (nshown>0) {
        document.getElementById('bcq_q-1').style.display = "none";
    }
    else {
        document.getElementById('bcq_q-1').style.display = "block";
    }
}


function sendAnswerForm() {
    var answer = this.previousSibling.value;
    var loc = get_read_loc();
    var qid = this.qid;
    
    // If not logged in, show login form and stop
    if (!check_login()) {return false};
    
    // If logged in, send the question and update HTML
    send_answer(answer, getUsername(), qid, current_book_id);
// ** Should only delete text if successful!
    this.previousSibling.value = "";
//    updatePanelQA();
//alert(get_the_html_questions(current_book_id))
    return false;
}



function handleUpdatedQA() {
    document.getElementById('bcq_q-2').style.display = "none";
    updatePanelQA();
    updatePanelLoc();
}


// Defunct
function resetPanel() {
    qforum = document.getElementById('question_forum');
    var html = get_the_html_questions(current_book_id);
    qforum.innerHTML = '<h3>Q&A Forum</h3>' + html;
    makePanelClicky();
    updatePanelLoc();
}


// Defunct
function makePanelClicky() {
    var QAs = allQA
    for (var j=0; j<QAs.length; j++) {
        Q = QAs[j];
        inputid = 'bcq_q' + Q.questionID + '_answbutton';
        document.getElementById(inputid).qid = Q.questionID;
        document.getElementById(inputid).addEventListener('click', sendAnswerForm);
    }
}

// Defunct
function updatePanel() {

return false;

    var loc = get_read_loc();
    var htmlq = get_the_html_question(current_book_id, loc);
    if (htmlq == "") {
        htmlq = '<i>No questions here</i>';
        butt = false;
    }
    else {
        butt = true;
        htmlq += '<form onsubmit="return false;"><textarea id="question_textarea" style="width:100%;height:100px;"></textarea><input id="bcq_answbutton" type="submit" value="Add answer" /></form>';
    }
    var qforum = document.getElementById("question_forum");
    if (qforum==null) {return false};
    qforum.innerHTML = '<h3>Q&A Forum</h3>' + htmlq;
    if (butt) {
        document.getElementById('bcq_answbutton').addEventListener('click', sendAnswerForm);
    }
}
