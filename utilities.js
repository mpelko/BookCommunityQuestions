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
    var doc2=document.getElementById("KindleReaderIFrame").contentDocument;
    var book = doc2.getElementById("kindleReader_title").innerHTML;
    return book;
}

function handleUpdatedQA() {
    updatePanelQA();
    updatePanelLoc();
}
