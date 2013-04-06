function test_get()
{    
    alert(get_all_QA(0)[0].location)
    alert([])
    var subset = get_QA_subset(0, 50,200)
    alert(subset)
    var subset = get_QA_subset(0, 50,70)
    alert(subset)
    all_QA = get_all_QA(0)
}

function test_question_insertion()
{
    alert(get_all_QA("Book1").length)
    send_question("NEW QUESTION", "Book1", 366)
    alert(get_all_QA("Book1").length)   
}

function test_answer_insertion()
{
    var bookID = "Book1"
    alert(get_all_QA(bookID)[0].answers.length)
    send_answer("NEW ANSWER", get_all_QA(bookID)[0].title, bookID)
    alert(get_all_QA(bookID)[0].answers.length)   
}

function test_get_the_right_QA()
{
    var bookID = "Book1"
    alert(get_the_right_QA(bookID, 70).location)
    alert(get_the_right_QA(bookID, 120).location)
}

function test_get_the_html_question()
{
    var bookID = "Book1"
    var html = get_the_html_question(bookID, 70)
    alert(html)
}


