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

function fix_questions_tags(data){
    if(data==[]){
        return []
    }
    result = []
    for (var i = 0; i < data.length; i++) {
        q = data[i]
        q["title"]=q["question"]
        delete q.question
        answs=[]
        for (var j = 0; j < q["answers"].length; j++) {
            a = q["answers"][j]
            a["text"]=a["answer"]
            delete a.answer
            answs.push(a)
        }
        q["answers"] = answs
        result.push(q)
    }
    return result
}

function QA_update_all_AWSDB(book_id)
{
    if(book_id == ""){
        return
    }
    
    var url = AWS_url + "/getquestions/?bookID="+book_id
    
    function handle_JSON(data){
        allQA = fix_questions_tags(data)
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
    
function send_answer_AWSDB(answer, usr, q_id, book_id)
{
    var url = AWS_url + "/addanswer/"
    var data = {"answer":answer, "username":usr, "questionID":q_id}
    
    function handle_JSON(data){
        update_all_QA(book_id);
    }
        
    $.getJSON( url + "?callback=?", data, handle_JSON);
}