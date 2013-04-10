
function get_book_id(book_title)
{
    if (DEBUG)
    {
        return get_book_id_DEBUG(book_title);
    }
    else {
        if(using_AWSDB){
            return get_book_id_AWSDB(book_title);
        }
    };    
}

function get_all_QA(book_id)
{
    if (DEBUG)
    {
        return QA_get_all_DEBUG(book_id);
    }
    else {
        if(using_AWSDB){
            return get_QA_all_AWSDB(book_id);
        }
    };
}

function send_answer(answer, usr, questionID, book_id)
{
    if (DEBUG)
    {
        send_answer_DEBUG(answer, usr, questionID, book_id);
    }
    else {
        if(using_AWSDB){
            send_answer_AWSDB(answer, usr, questionID, book_id);
        }
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
    allQA = get_all_QA(book_id);
    for (var j=0; j<allQA.length; j++) {
        Q = allQA[j];
        html += html_qa(Q);
    }
    return html;
}

function html_qa(Q) {
    html = '<div id="bcq_q' + Q.questionID + '" qid="' + Q.questionID + '">';
    html += '<h4>' + Q.title + ' <span style="color:grey;font-size:small;font-style:italic;"> - ' + Q.username + '</span>' + '</h4>';
    html += html_answers(Q.answers);
    html += '<form id="bcq_q' + Q.questionID + '_ansform" onsubmit="return false;"><textarea id="bcq_q' + Q.questionID + '_ta" style="width:100%;height:100px;"></textarea><input id="bcq_q' + Q.questionID + '_answbutton" qid="' + Q.questionID + '" type="submit" value="Add answer" /></form>';
    html += '</div>';
    return html;
}

function html_answers(answs) {
    if(answs.length > 0) {
        html = '<ul is_answs=true class="bcq_answers">';
        for (var i = 0; i < answs.length; i++)  {
            html += '<li>' + answs[i].text + '<span style="color:grey;font-size:small;font-style:italic;"> - ' + answs[i].username + '</span>' + '</li>';
        };
        html += '</ul>';
    }
    else {
        html = '<i is_answs=true style="padding:5px;">This question is unanswered. Can you help?</i>';
    }
    return html;
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
