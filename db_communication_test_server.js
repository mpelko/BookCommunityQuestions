//var base_url = "http://127.0.0.1:8080"
var base_url = "http://nuclearScotland.bajta.org"

function update_book_id_test_server(book_title)
{
    var url = base_url + "/get/bookID?title="+book_title;
    
    var book_id = "";
    
    function handle_JSON(data){
        current_book_id=data["bid"];
        update_all_QA(current_book_id);
    }
    
    $.getJSON( url + "&callback=?", null,  handle_JSON);
}

function QA_update_all_test_server(book_id)
{
    if(book_id == ""){
        return
    }
    
    var url = base_url + "/get/QAs?bid="+book_id;
    
    function handle_JSON(data){
        allQA = data["QAs"];
        handleUpdatedQA();
    }
    
    $.getJSON( url + "&callback=?", null,  handle_JSON);
}

function send_question_test_server(question, usr, book_id, location)
{

    var url = base_url + "/submit/Q";
    var data = {"title":question, "username":usr, "bid":book_id, "location":location};
    
    function handle_JSON(data){
        // could be used to implement what to do with the server response, if needed
        update_all_QA(book_id);
    }
        
    $.getJSON( url + "?callback=?", data, handle_JSON);

}

function send_answer_test_server(answer, usr, q_id, book_id)
{
//alert('answer to test server: '+answer+' '+usr+' '+q_id+' '+book_id);
    var url = base_url + "/submit/A";
    var data = {"text":answer, "username":usr, "bid":book_id, "qid":q_id};
    
    function handle_JSON(data){
        // could be used to implement what to do with the server response, if 
        update_all_QA(book_id);
    }
        
    $.getJSON( url + "?callback=?", data, handle_JSON);
}
