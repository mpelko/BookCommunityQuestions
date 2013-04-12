
function update_book_id(book_title)
{
    if (DEBUG)
    {
        update_book_id_DEBUG(book_title);
    }
    else {
        if(using_AWSDB){
            update_book_id_AWSDB(book_title);
        }
        else{        
            if(using_test_server){
                update_book_id_test_server(book_title);
            }
        };

    };    
}

function update_all_QA(book_id)
{
    if (DEBUG)
    {
        return QA_update_all_DEBUG(book_id);
    }
    else {
        if(using_AWSDB){
            return QA_update_all_AWSDB(book_id);
        }
        else{        
            if(using_test_server){
                QA_update_all_test_server(book_id);
            }
        };

    };
}

function send_answer(answer, usr, questionID, book_id)
{
//alert(answer+' '+usr+' '+questionID+' '+book_id);
    if (DEBUG)
    {
        send_answer_DEBUG(answer, usr, questionID, book_id);
    }
    else {
        if(using_AWSDB){
            send_answer_AWSDB(answer, usr, questionID, book_id);
        }
        else{        
            if(using_test_server){
                send_answer_test_server(answer, usr, questionID, book_id);
            }
        };
    };
    
    
}

//wrapper function for stroing the q in the db
function send_question(question, usr, book_id, location)
{
//alert(DEBUG)
    if (DEBUG)
    {
        send_question_DEBUG(question, usr, book_id, location)
    }
    else {
        if(using_AWSDB){
            send_question_AWSDB(question, usr, book_id, location);
        }
        else{        
            if(using_test_server){
                send_question_test_server(question, usr, book_id, location);
            }
        };
    };    
}

function get_QA_subset(book_id, min_loc, max_loc)
{
    var QAs = allQA
    var subset = [];
    for (var i = 0; i < QAs.length; i++) 
    {
        Q = QAs[i];
        if(Q.location<max_loc && Q.location>min_loc)
        {
            subset.push(Q);
        };
    };
    return subset;
}

function get_the_right_QA(book_id, location)
{
    var QAs = allQA
    closest_Q = {"location": location+1000}
    for (var i = 0; i < QAs.length; i++) 
    {
        Q = QAs[i];
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
                html = html.concat("<li>", Q.answers[i].text, "</li>")
            };
            html = html.concat("</ul>")
        }
        else {
            html = html.concat("<i style='padding:5px;'>This question is unanswered. Can you help?</i>")
        }
        return html
    };
}


function get_the_html_questions(book_id) {
    html = '<div id="bcq_q-1"><p style="font-style:italic;">No questions here.</p></div>';
    var QAs = allQA
    for (var j=0; j<QAs.length; j++) {
        Q = QAs[j];
        html += html_qa(Q);
    }
    return html;
}


