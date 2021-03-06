var QA_ALL_DEBUG=[{questionID:0, bookID: 0, "username": "scottclowe", "title": "Wait, how are the properties of light similar to those of waves?", "location":26, "answers": [{"text":"Light reflects in the same manner as a wave would.", "username": "mpelko"}, {"text":"Light exhibits the Doppler effect.","username": "mpelko"}]},
                 {questionID:1, bookID: 0, "username": "mpelko", "title": "What's the ether?", "location":35, "answers": [{"text":"James Maxwell thought light moved through a medium called the ether. He was wrong.", "username": "mpelko"}, {"text":"The Michelson-Morley experiment was the first strong evidence against the ether theory.", "username": "mpelko"}]},
                 {questionID:2, bookID: 1, "username": "scottclowe", "title": "I am unsure of the liguistic devices being employed here. Could somebody explain?", "location":217, "answers": [{"text":"There are several things happening here, and I will address them in a seperate post.", "username": "mpelko"}, {"text":"Sorry, bit busy now.", "username": "mpelko"}]},
                 {questionID:3, bookID: 1, "username": "mpelko", "title": "What's the box?", "location":198, "answers": []},
                 //{"bookID": 0, "username": "mpelko", "title": "What's so special about the special theory of relativity?", "location":73, "answers": ["The special theory of relativity postulates that all motion is relative and the speed of light is constant in all refernce frames."]},
                 //{"bookID": 0, "username": "acprice", "title": "How is general relativity different from special relativity?", "location":147, "answers": ["General relativity combines special relativity with Einstein's theory of gravity as the curvature of space-time."]},
                 //{"bookID": 0, "username": "dabelman", "title": "Is how the flux capacitor works?", "location":233, "answers": ["No. The flux capacitor is not real. It only exists in Back to the Future.", "I think so."]},
                 //{"bookID": 0, "username": "dantonova", "title": "Who should I read on epistemology?", "location":279, "answers": ["Renee Descartes.", "More modern: Peter Unger."]},
                 //{"bookID": 0, "username": "cpredoi", "title": "So is a moebius strip finite but unbounded?", "location":299, "answers": ["Yes, it's one-dimensional, finite, unbounded."]}
                 ]

var BOOKS_ALL_DEBUG={0:"Sidelights on Relativity", 1:"The Phantom of the Opera"}


function update_book_id_DEBUG(book_title)
{
    for (var id in BOOKS_ALL_DEBUG)
        if(BOOKS_ALL_DEBUG[id]==book_title)
        {
            current_book_id = id;
            return
        }
    new_id = Object.keys(BOOKS_ALL_DEBUG).length;
    BOOKS_ALL_DEBUG[new_id]=book_title;
    current_book_id = new_id;
}


function QA_update_all_DEBUG(book_id)
{
    var QAs = [];
    for (var i = 0; i < QA_ALL_DEBUG.length; i++) 
    {
        Q = QA_ALL_DEBUG[i];
        if(Q.bookID==book_id);
        {
            QAs.push(Q);
        };
    };
    allQA = QAs;
    handleUpdatedQA();
}


function send_question_DEBUG(question, usr, book_id, location)
{
    Qid = QA_ALL_DEBUG[QA_ALL_DEBUG.length-1].questionID +1;
    QA_ALL_DEBUG.push({questionID:Qid, bookID:book_id, "title":question, "username":usr, "location":location, "answers":[]});
    update_all_QA(book_id);
}
    

function send_answer_DEBUG(answer, usr, q_id, book_id)
{
//alert('sending-answer ' + answer +' '+ usr +' '+ q_id +' '+ book_id);
    for (var i = 0; i < QA_ALL_DEBUG.length; i++) 
    {
        Q = QA_ALL_DEBUG[i];
        if(Q.bookID==book_id && Q.questionID==q_id)
        {
            Q.answers.push({"text":answer, "username":usr});
        }
    }
    update_all_QA(book_id);     
}
