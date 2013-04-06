
//wrapper function taking the book_id and returning the html version of QA
function get_QA_html(book_id)
{
    if (DEBUG){return test_QA_html;}
    else {
        if(using_Forum_asDB){
            return get_QA_html_forum(book_id);
        }
        else{
            return get_QA_html_DB(book_id);
        };
    };
}

//wrapper function for stroing the q in the db
function send_question(question, book_id, location)
{
    if (DEBUG){return;}
    else {
        if(using_Forum_asDB){
            send_question_forum(question, book_id, location);
        }
        else{
            get_QA_html_DB(book_id);
        };
    };    
}
