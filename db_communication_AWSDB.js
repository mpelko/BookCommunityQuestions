
function get_book_id_AWSDB(book_title)
{
    var url = "http://127.0.0.1:8080/get/bookID?title="+book_title
    
    alert(book_title)
    
    var book_id = ""
    
    function handle_JSON(data){
        book_id=data["bid"]
    }
    
    $.getJSON( url + "&callback=?", null,  handle_JSON);
    return book_id
}

function QA_get_all_AWSDB(book_id)
{
    var url = "http://127.0.0.1:8080/get/QAs?bid="+book_id
    //var url = "http://nuclearscotland-env-tyc9qsrnmg.elasticbeanstalk.com/getquestions?bookID=" + book_id
    
    var QAs = ""
    function handle_JSON(data){
        alert(Object.keys(data))
        QAs = data["QAs"]
    }
    
    alert(url)
    
    $.getJSON( url + "?callback=?", null,  handle_JSON);
    return QAs
}

function send_question_AWSDB(question, usr, book_id, location)
{
    // TODO: implement
}
    
function send_answer_AWSDB(answer, usr, q_id, book_id)
{
    // TODO: implement
}
