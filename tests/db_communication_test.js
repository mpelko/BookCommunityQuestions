var QA_ALL_DEBUG=[{questionID:0, bookID: 0, "username": "scottclowe", "title": "Wait, how are the properties of light similar to those of waves?", "location":26, "answers": [{"text":"Light reflects in the same manner as a wave would.", "username": "mpelko"}, {"text":"Light exhibits the Doppler effect.","username": "mpelko"}]},
                 {questionID:1, bookID: 0, "username": "mpelko", "title": "What's the ether?", "location":35, "answers": [{"text":"James Maxwell thought light moved through a medium called the ether. He was wrong.", "username": "mpelko"}, {"text":"The Michelson-Morley experiment was the first strong evidence against the ether theory.", "username": "mpelko"}]},
                 //{"bookID": 0, "username": "mpelko", "title": "What's so special about the special theory of relativity?", "location":73, "answers": ["The special theory of relativity postulates that all motion is relative and the speed of light is constant in all refernce frames."]},
                 //{"bookID": 0, "username": "acprice", "title": "How is general relativity different from special relativity?", "location":147, "answers": ["General relativity combines special relativity with Einstein's theory of gravity as the curvature of space-time."]},
                 //{"bookID": 0, "username": "dabelman", "title": "Is how the flux capacitor works?", "location":233, "answers": ["No. The flux capacitor is not real. It only exists in Back to the Future.", "I think so."]},
                 //{"bookID": 0, "username": "dantonova", "title": "Who should I read on epistemology?", "location":279, "answers": ["Renee Descartes.", "More modern: Peter Unger."]},
                 //{"bookID": 0, "username": "cpredoi", "title": "So is a moebius strip finite but unbounded?", "location":299, "answers": ["Yes, it's one-dimensional, finite, unbounded."]}
                 ]

var BOOKS_ALL_DEBUG={0:"Sidelights on Relativity", 1:"The Phantom of the Opera"}
DEBUG=true

function test_get()
{   
    alert(get_all_QA(0))
    var subset = get_QA_subset(0, 20,200)
    alert(subset.length)
    var subset = get_QA_subset(0, 50,70)
    alert(subset.length)
    all_QA = get_all_QA(0)
}

function test_question_insertion()
{
    alert(get_all_QA(0).length)
    send_question("NEW QUESTION", "mpelko", 0, 366)
    alert(get_all_QA(0).length)   
}

function test_answer_insertion()
{
    var bookID = 0
    alert(get_all_QA(bookID)[0].answers.length)
    send_answer("NEW ANSWER", "mpelko", get_all_QA(bookID)[0].title, bookID)
    alert(get_all_QA(bookID)[0].answers.length)   
}

function test_get_the_right_QA()
{
    var bookID = 0
    alert(get_the_right_QA(bookID, 30).location)
    alert(get_the_right_QA(bookID, 40).location)
}

function test_get_the_html_question()
{
    var bookID = 0
    var html = get_the_html_question(bookID, 30)
    alert(html)
}

function test_get_book_id()
{
    book_title = "The Phantom of the Opera"
    // should be 1
    alert(get_book_id(book_title))
    // should be 2 
    alert(get_book_id("New title"))
}


