
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
    popupmenu = get_popupmenu();
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
    popupmenu = get_popupmenu();
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
    var newbuttontext = document.createTextNode("Question");
    newbutton.appendChild(newbuttontext);
    popupmenu.appendChild(newbutton);
}

function get_popupmenu() {
    var doc2=document.getElementById("KindleReaderIFrame").contentDocument;
    if (doc2 == null) {
//        alert('No doc2');
        return null;
    }
    var popupparent = doc2.getElementById('kindleReader_menu_contextMenu');
    if (popupparent == null) {
//        alert('No kindleReader_menu_contextMenu');
        return null;
    }
    var x = popupparent.childNodes;
    popupmenu = null;
    for (i=0;i<x.length;i++) {
        if (x[i].id == 'kindle_menu_border') {
            popupmenu = x[i];
            break;
        }
    }
    return popupmenu;
}

// Adds Background mask AND Pose Question form
function addPoseForm() {
//alert('adding pose form');
//doc2=document.getElementById("KindleReaderIFrame").contentDocument;
var bgmask_container = document.createElement("div");
bgmask_container.innerHTML = '<div id="bcq_posemask" style="position:absolute;left:0px;top:0px;height:100%;width:100%;background:rgba(50,50,50,0.7);z-index:10000;display:none;"><div id="bcq_poseform" style="border-radius: 25px; z-index: 10000; top: 20%; left: 20%; right: 20%; bottom: 20%; background: none repeat scroll 0% 0% rgb(250, 250, 250); border: 10px solid rgb(40, 40, 40); padding: 30px; position: absolute; min-height: 180px"><form onsubmit="return false;"><p>Ask a question about <i id="bcq_posebookname">' + getBookName() + '</i>.</p><textarea id="bcq_qsubmitinput" placeholder="Type your question here" name="question-title" style="width:90%;height:100px;display:block;margin:auto;"></textarea><p id="bcq_ermsgpose" class="bcq_ermsg" style="display:none;">Question cannot be blank</p><div style="margin:5px auto;text-align:center;"><button id="bcq_posecancelbutton" type="button" class-"bcq-ui-button">Cancel</button><button id="bcq_posesubmitbutton" type="submit" name="submit">Save</button></div><form></div></div>';
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
    
    // If no text, show error message and stop
    if (qtext=='') {
        document.getElementById('bcq_ermsgpose').style.display = 'block';
        return false;
    }
    
    // If not logged in, show login form and stop
    if (!check_login()) {return false};
    
    // If logged in, send the question and update HTML
    send_question(qtext, getUsername(), current_book_id, loc);

    //alert(' question sent');
    document.getElementById('bcq_posesubmitbutton').value = 'Question sent';
    document.getElementById('bcq_posesubmitbutton').disabled = true;
    
    // should only do this on successful post
    setTimeout(hidePoseForm,500);
    //setTimeout(updatePanel,700);
    setTimeout(resetPoseForm,700);
    
    // Don't refresh the page
    return false;
}

function resetPoseForm() {
    document.getElementById('bcq_posesubmitbutton').value = 'Post Question';
    document.getElementById('bcq_posesubmitbutton').disabled = false;
    document.getElementById('bcq_qsubmitinput').value = '';
    document.getElementById('bcq_ermsgpose').style.display = 'none';
}


// --------------------- Login form ------------------------

function check_login() {
    if (isLoggedIn()) {
        return true;
    }
    var usr = prompt("Please enter your username","");
    if (usr==null || usr=="") {
        return false;
    }
    login_as(usr);
    return true;
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
    qicon.alt = "Show questions";
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

   // Create the question content panel.
    var container = document.getElementById("KindleReaderContainer");
    var qcontent = document.createElement("div");
   
    document.body.style.background = "#e8e8e0"; // "#f2f2e2";
    qcontent.style.background = "#e8e8e0"; // "#f2f2e2";
    qcontent.id = "question_content";
    qcontent.style.position = "absolute";
    qcontent.style.float = "left";
    qcontent.style.width = "30%";
    qcontent.style.height = "100%";
    qcontent.style.overflowX = "scroll";
    qcontent.style.top = "0";
    qcontent.style.right = "0";
    qcontent.isout = false;
    
    var contentinner = document.createElement("div");
    contentinner.id = "question_forum";
    contentinner.innerHTML = '<h3 style="margin:12px 0 0;">Community Forum</h3>';
    
    var newbutton = document.createElement('button');

    //newbutton.textContent = 'Add a new question';
    newbutton.className="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only"
    newbutton.setAttribute('type','button');
    newbutton.setAttribute('role', 'button');
    //newbutton.style.display = 'block';
    //newbutton.style.margin = 'auto 0 0 auto';

    newbutton.addEventListener('click',showPoseForm);
    var button_text_span=document.createElement('span');
    button_text_span.className="ui-button-text"
    button_text_span.innerHTML='Add a new question';
    newbutton.appendChild(button_text_span);
    contentinner.appendChild(newbutton);
    
    qcontent.innerHTML += '<div id="bcq_q-2"><p style="font-style:italic;">Loading...</p></div><div id="bcq_q-1"><p style="font-style:italic;display:none;">No questions here.</p></div>';
    
    qcontent.appendChild(contentinner);
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
    var qcontent = document.getElementById("question_content");

    // Give the panel dimensions
    qcontent.style.display = "none";

    // Reduce size of content panel.
   var frame = document.getElementById("KindleReaderIFrame");
   frame.style.width = "100%";

}

function showPanel() {
   // Get the question content panel.
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

//console.log('update panel')
    var QAs = allQA
    for (var j=0; j<QAs.length; j++) {
        Q = QAs[j];
//console.log('for Q ' + Q.questionID)
        divid = 'bcq_q' + Q.questionID + '_inner';
        qdiv = document.getElementById(divid);
        if (qdiv==null) {
            //append question
//console.log('add new q')
            qd = make_qnode(Q);
            qforum.appendChild(qd);
        }
        else {
//console.log('found q')
            //update answers
            var x = qdiv.children;
//console.log('has '+ x.length + ' children')
            for (i=0; i<x.length; i++) {
                if (x[i].hasAttribute('is_answs')) {
                    y = x[i];
                    // Botched method
                    if (y.children.length == Q.answers.length) {
                        // do nothing
//console.log('ans do nothing')
                    }
                    else {
//console.log('ans do something')
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
    d.className = 'bcq_q bcq_qcontracted';
    var h = document.createElement('h4');
    h.innerHTML = Q.title + ' <span class="bcq_usrname"> - ' + Q.username + '</span>';
    h.addEventListener('click', toggle_q_expansion);
    h.style.cursor = 'pointer';
    d.appendChild(h);
    
    var d2 = document.createElement('div');
    d2.id = 'bcq_q' + Q.questionID + '_inner';
    d2.className = 'bcq_q_inner';
    d2.innerHTML += html_answers(Q.answers);
    
//    var gt = document.createElement('input');
//    gt.type = 'button';
//    gt.value = 'Go to question location (' + Q.location + ')';
//    gt.loc = Q.location;
//    gt.addEventListener('click', goto_qloc);
//    d2.appendChild(gt);
    var gt = document.createElement('span');
    gt.className = 'bcq_goto';
    gt.textContent = 'Go to question location (' + Q.location + ')';
    gt.loc = Q.location;
    gt.style.cursor = 'pointer';
    gt.addEventListener('click', goto_qloc);
    d2.appendChild(gt);
    
    var f = document.createElement('form');
    f.id='bcq_q' + Q.questionID + '_ansform';
    f.action='#';
    f.onsubmit=function() {return false;};
    var t = document.createElement('textarea');
    t.id='bcq_q' + Q.questionID + '_ta';
    t.style.width = '95%';
    t.style.height = '100px';
    var i = document.createElement('input');
    i.id='bcq_q' + Q.questionID + '_answbutton';
    i.qid=Q.questionID;
    i.type="submit";
    i.className = "bcq_button";
    i.value="Add answer";
    i.addEventListener('click', sendAnswerForm);
    var e = document.createElement('p');
    e.id='bcq_q' + Q.questionID + '_ermsg';
    e.className = 'bcq_ermsg';
    e.textContent = 'Answer cannot be blank';
    e.style.display = 'none';
    
    f.appendChild(t);
    f.appendChild(i);
    f.appendChild(e);

    d2.appendChild(f);
    d.appendChild(d2);
    return d;
}

function toggle_q_expansion() {
    var d = this.parentNode;
    d.classList.toggle('bcq_qexpanded');
    d.classList.toggle('bcq_qcontracted');
}

function goto_qloc() {
    goto_loc(this.loc);
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
    var QAs = allQA
    location = get_read_loc();
    nshown = 0;
    for (var j=0; j<QAs.length; j++) {
        Q = QAs[j];
        var divid = 'bcq_q' + Q.questionID;
        var d = document.getElementById(divid);
        if (d==null) {
            updatePanelQA();
            continue;
        }
        if (Q.location-2 < location && location < Q.location+25) {
            d.classList.add('bcq_qexpanded');
            d.classList.remove('bcq_qcontracted');
        }
        else {
            d.classList.remove('bcq_qexpanded');
            d.classList.add('bcq_qcontracted');
        }
    }
}


function sendAnswerForm() {
    var answer = this.previousSibling.value;
    var loc = get_read_loc();
    var qid = this.qid;
    
    // If text is empty
    if (answer=='') {
        // show error message
        this.nextSibling.style.display = 'block';
        return false;
    }
    
    // If not logged in, show login form and stop
    if (!check_login()) {return false};
    
    // If logged in, send the question and update HTML
    send_answer(answer, getUsername(), qid, current_book_id);
// ** Should only delete text if successful!
    this.previousSibling.value = "";
    this.nextSibling.style.display = 'none';
//    updatePanelQA();
//alert(get_the_html_questions(current_book_id))
    return false;
}



function handleUpdatedQA() {
    document.getElementById('bcq_q-2').style.display = "none";
    updatePanelQA();
    refreshQAloc();
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
