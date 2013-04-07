
//wrapper function taking the book_id and returning the html version of QA


//function returns all hte questions and answers from a book
//TODO: implement some sort of cashing, so we don't need all the qa every time.

function get_all_QA_html()
{
 return []   
}


function test_QA_get_all(book_id)
{
    QAs = []
    for (var i = 0; i < test_QA_all.length; i++) 
    {
        Q = test_QA_all[i];
        if(Q.book==book_id)
        {
            QAs.push(Q);
        };
    };    
    return QAs
}

function send_answer_test(answer, question, book_id)
{
    for (var i = 0; i < test_QA_all.length; i++) 
    {
        Q = test_QA_all[i];
        if(Q.book==book_id && Q.title==question)
        {
            Q.answers.push(answer);
        };
    };        
}

function get_all_QA(book_id)
{
    if (DEBUG)
    {
        return test_QA_get_all(book_id);
    }
    else {
        if(using_Forum_asDB){
            return get_QA_all_forum(book_id);
        }
        else{
            return get_QA_all_DB(book_id);
        };
    };
}


function send_answer(answer, question, book_id)
{
    if (DEBUG)
    {
        send_answer_test(answer, question, book_id);
    }
    else {
        if(using_Forum_asDB){
            send_answer_forum(question, book_id);
        }
        else{
            send_answer_DB(question, book_id);
        };
    };    
    
}

//wrapper function for stroing the q in the db
function send_question(question, book_id, location)
{
//alert(DEBUG)
    if (DEBUG)
    {
        test_QA_all.push({"book":book_id, "title":question, "location":location, "answers":[]})
    }
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

function get_the_right_QA(book_id, location)
{
    all_QA = get_all_QA(book_id);
    closest_Q = {"location": location+1000}
    for (var i = 0; i < all_QA.length; i++) 
    {
        Q = all_QA[i];
        if(!(Q.location<location-1) && (Q.location-location)<closest_Q.location)
        {
            closest_Q = Q;
        };
    };
    if(closest_Q.location-location < 25)
    {
        return closest_Q
    } 
    else 
    {
        return {}    
    }
}

function get_the_html_question(book_id, location)
{
    Q = get_the_right_QA(book_id, location)
    
    if(!("title" in Q))
    {
        return "";
    }
    else
    {
        html = "<h4>"
        html = html.concat(Q.title,"</h4>")
        if(Q.answers.length > 0)
        {
            html = html.concat("<ul>")
            for (var i = 0; i < Q.answers.length; i++) 
            {
                A = Q.answers[i];
                html = html.concat("<li>", A, "</li>")
            };
            html = html.concat("</ul>")
        }
        else {
            html = html.concat("<i style='padding:5px;'>This question is unanswered. Can you help?</i>")
        }
        return html
    };
}

