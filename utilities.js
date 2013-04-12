// Useful general functions

function get_read_loc() {
    var doc2=document.getElementById("KindleReaderIFrame").contentDocument;
    var loct = doc2.getElementById('kindleReader_footer_message').textContent;
    var patt=/% · (\d+) of/;
    var matches = patt.exec(loct);
    if (matches==null) {return null};
    var loc = matches[1];
    return loc;
}

function goto_loc(location) {
    var doc2=document.getElementById("KindleReaderIFrame").contentDocument;
    doc2.getElementById('kindleReader_button_goto').click();
    doc2.getElementById('kindleReader_goToMenuItem_goToLocation').click();
    var gotobutton = findGoToButton();
    doc2.getElementById('kindleReader_dialog_gotoField').value = location;
    gotobutton.click();
}

function findGoToButton() {
    var doc2=document.getElementById("KindleReaderIFrame").contentDocument;
    var buts = doc2.getElementsByTagName("button")
    for (var i=0; i<buts.length; i++){
        var x=buts[i].children;
        if (x.length==1 && x[0].textContent=="Go to location"){
            return buts[i];
        }
    }
}

function getBookName() {
    // <label id="kindleReader_title" style="color: rgb(153, 153, 153);">Les Misérables - Tome I - Fantine</label>
    var frame=document.getElementById("KindleReaderIFrame");
    if (frame==null) {return null;}
    var doc2 = frame.contentDocument;
    var bookel = doc2.getElementById("kindleReader_title");
    if (bookel==null) {return null;}
    return bookel.textContent;
}


function hasBookChanged() {
    var frame = document.getElementById("KindleReaderIFrame");
    if (frame==null) {
        // Have returned to Library page from Book page
        // reset book name, and wait
        current_book_id = "";
        allQA = [];
        current_book_name = "";
        return false;
    }
    new_book_name = getBookName();
    if (new_book_name==null || new_book_name=="") {
        // Have landed straight onto Library page
        // do nothing, as there is nothing to do...?
        current_book_name = "";
        return false;
    }
    else if (new_book_name!==current_book_name){
        // Have gone to book from Library or other book
        // Need to setup again
        return true;
    }
    else {
        return false;
    }
}



function login_as(usr) {
    username = usr;
}

function isLoggedIn() {
    if (getUsername()=="") {
        return false;
    }
    else {
        return true;
    }
}

function getUsername() {
    return username;
}
