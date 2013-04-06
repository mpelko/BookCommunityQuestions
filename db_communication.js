
//wrapper function taking the book_id and returning the html version of QA


//function returns all hte questions and answers from a book
//TODO: implement some sort of cashing, so we don't need all the qa every time.
function get_all_QA(book_id)
{
    if (DEBUG){return test_QA_all;}
    else {
        if(using_Forum_asDB){
            return get_QA_all_forum(book_id);
        }
        else{
            return get_QA_all_DB(book_id);
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

function get_QA_subset(book_id, min_loc, max_loc)
{
    all_QA = get_all_QA(book_id);
    var subset = [];
    for (var i = 0; i < all_QA.length; i++) 
    {
        Q = all_QA[i];
        if(Q.location<max_loc && Q.location>min_loc)
        {
            subset.push(Q);
        };
    };
    return subset;
}
