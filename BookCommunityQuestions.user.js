// ==UserScript==
// @name       BookCommunityQuestions
// @namespace  https://read.amazon.com/
// @description    Makes magic happen
// @include  https://read.amazon.com/
// @include  http://read.amazon.com/
// @run-at        document-end
// @grant         none
// @require globals.js
// @require utilities.js
// @require ui.js
// @require styles.js
// @require db_communication_DEBUG.js
// @require db_communication_test_server.js
// @require db_communication_AWSDB.js
// @require db_communication.js
// ==/UserScript==
// Notes:
//   * is a wildcard character
//   .tld is magic that matches all top-level domains (e.g. .com, .co.uk, .us, etc.)


//alert('begin');

addStyles();
setTimeout(greasemonkey_main, 2000);


function greasemonkey_main() {
    //loc = get_read_loc();
    //book = getBookName();
    //alert(book + ': at ' + loc);
    setup_everything();
}

function setup_everything() {
//alert('setting up all');
    setup_newels();
    run_loopers();
    setTimeout(setup_loopers, 500);
}

function setup_newels() {
//alert('setting up new elements');
    addPoseForm();
//    makePanel();
//    addPoseButton();
//    add_qmark_button();
}

function setup_loopers() {
//alert('adding loopers');
    var loopersrunner = window.setInterval(run_loopers,100);
    var loopersrunner2 = window.setInterval(run_long_loopers,5000);
}

function run_loopers() {
//alert('running loopers');
    if (hasBookChanged()) {
//alert('Book has changed')
        current_book_name = getBookName();
        makePanel();
        update_book_id(getBookName()); // will update QA when finished as well
        document.getElementById('bcq_posebookname').textContent = getBookName();
        add_qmark_button();
    }
    if (current_book_id!=="") {
        refreshPoseButton();
        refreshQAloc();
    }
}

function run_long_loopers() {
    //console.log(allQA)
    //console.log(current_book_id)
    //updatePanelQA();
    if (current_book_id!=="") {
        update_all_QA(current_book_id);
    }
}



