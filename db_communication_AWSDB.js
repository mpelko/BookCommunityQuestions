AWS_url = "http://nuclearscotland-env.elasticbeanstalk.com"

function update_book_id_AWSDB(book_title)
{
    var url = AWS_url + "/getbookid/?booktitle="+book_title
    
    function handle_JSON(data){
        current_book_id=data[0]["bookID"]
        update_all_QA(current_book_id);
    }
    
    $.getJSON( url + "&callback=?", null,  handle_JSON);
}

function QA_update_all_AWSDB(book_id)
{
    if(book_id == ""){
        return
    }
    
    var url = AWS_url + "/getquestions/?bookID="+book_id
    
    function handle_JSON(data){
        allQA = data
        handleUpdatedQA();
    }
    
    $.getJSON( url + "&callback=?", null,  handle_JSON);
}

function send_question_AWSDB(question, usr, book_id, location)
{
    var url = AWS_url + "/addquestion/"
    var data = {"question":question, "username":usr, "bookID":book_id, "location":location}
    
    function handle_JSON(data){
            update_all_QA(book_id);
    }
        
    $.getJSON( url + "?callback=?", data, handle_JSON);
}
    
function send_answer_AWSDB(answer, usr, q_id, book_id, element_handle)
{
    var url = AWS_url + "/addanswer/"
    var data = {"answer":answer, "username":usr, "questionID":q_id}
    
    function handle_JSON(data){
        if(data["daffodil"]==0)
        {
            answerSendSuccess(element_handle)
            update_all_QA(book_id);
        }
        else if(data["daffodil"]==1)
        {
            answerSendFailure(element_handle)
        }
    }
        
    $.getJSON( url + "?callback=?", data, handle_JSON);
}

function send_vote_AWSDB(answerID, usr, vote)
{
    var url = AWS_url + "/voteanswer/"
    var data = {"answerID":answerID, "username":usr, "vote":vote}
    
    function handle_JSON(data){
        update_all_QA(book_id);
    }
        
    $.getJSON( url + "?callback=?", data, handle_JSON);    
}
