base_url = "http://nuclearscotland-env-tyc9qsrnmg.elasticbeanstalk.com"

function update_book_id_AWSDB(book_title)
{
    var url = base_url + "/getbookid/?booktitle="+book_title
    
    function handle_JSON(data){
        current_book_id=data[0]["bookID"]
    }
    
    $.getJSON( url + "&callback=?", null,  handle_JSON);
}

function QA_update_all_AWSDB(book_id)
{
    // TODO: do the actual implementation
    if(book_id == ""){
        return
    }
    
    var url = "http://127.0.0.1:8080/get/QAs?bid="+book_id
    //var url = "http://nuclearscotland-env-tyc9qsrnmg.elasticbeanstalk.com/getquestions?bookID=" + book_id
    
    function handle_JSON(data){
        allQA = data["QAs"]
    }
    
    $.getJSON( url + "&callback=?", null,  handle_JSON);
}

function send_question_AWSDB(question, usr, book_id, location)
{
   // TODO: do the actual implementation
 
    //var url = "http://nuclearscotland-env-tyc9qsrnmg.elasticbeanstalk.com/getquestions?bookID=" + book_id
    var url = "http://127.0.0.1:8080/submit/Q"
    var data = {"title":question, "username":usr, "bid":book_id, "location":location}
    
    function handle_JSON(data){
        // could be used to implement what to do with the server response, if needed
        return
    }
        
    $.getJSON( url + "?callback=?", data);

}
    
function send_answer_AWSDB(answer, usr, q_id, book_id)
{
    // TODO: do the actual implementation
 
    //var url = "http://nuclearscotland-env-tyc9qsrnmg.elasticbeanstalk.com/getquestions?bookID=" + book_id
    var url = "http://127.0.0.1:8080/submit/A"
    var data = {"text":answer, "username":usr, "bid":book_id, "qid":q_id}
    
    function handle_JSON(data){
        // could be used to implement what to do with the server response, if needed
        return
    }
        
    $.getJSON( url + "?callback=?", data);
}