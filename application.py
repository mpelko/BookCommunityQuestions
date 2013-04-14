from wsgiref.simple_server import make_server
from cgi import parse_qs, escape
import boto.dynamodb
import condition
import re
import json

response = """
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
  <!--
    Copyright 2012 Amazon.com, Inc. or its affiliates. All Rights Reserved.

    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

        http://aws.Amazon/apache2.0/

    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
  -->
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <title>Welcome</title>

</head>
<body id="sample">

<form name="getBookID" action="/getbookid/" method="GET">Enter book title to get its id. If book doen't exit, it will be created and its id will be returned: <br/>
Title: 
<input type="text" name="booktitle" value=""> <br/>
<input type="submit" value="Get bookID">
</form>
<br/>
<br/>


<form name="getQuestions" action="/getquestions/" method="GET">Enter bookID to get questions: <br/>
bookID: 
<input type="text" name="bookID" value=""> <br/>
<input type="submit" value="Get questions">
</form>
<br/>
<br/>

<form name="getAnswers" action="/getanswers/" method="GET">Enter questionID to get answers: <br/>
questionID: 
<input type="text" name="questionID" value=""> <br/>
<input type="submit" value="Get answers">
</form>
<br/>
<br/>

<form name="addBook" action="/addbook/" method="GET">Enter book information to add it: <br/>
book title: 
<input type="text" name="title" value=""> <br/>
<input type="submit" value="Add book">
</form>
<br/>
<br/>

<form name="addQuestion" action="/addquestion/" method="GET">Enter question information to add it: <br/>
question: 
<input type="text" name="question" value=""> <br/>
bookID: 
<input type="text" name="bookID" value=""> <br/>
location: 
<input type="text" name="location" value=""> <br/>
username:
<input type="text" name="username" value=""> <br/>
<input type="submit" value="Add question">
</form>
<br/>
<br/>

<form name="addAnswer" action="/addanswer/" method="GET">Enter answer information to add it: <br/>
answer: 
<input type="text" name="answer" value=""> <br/>
questionID: 
<input type="text" name="questionID" value=""> <br/>
username: 
<input type="text" name="username" value=""> <br/>
<input type="submit" value="Add answer">
</form>
<br/>
<br/>

</body>
</html>

"""

def generateID(conn, table):
    counter = table.get_item(hash_key="lastcount")
    count = counter["count"] + 1
    counter.add_attribute("count", 1)
    counter.save()
    return count

def index(environ, start_response):
    conn = boto.dynamodb.connect_to_region(
        'us-west-2',
        aws_access_key_id='AKIAJMFCMKYSPE42Q7LQ',
        aws_secret_access_key='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')
    status = '200 OK'
    headers = [('Content-type', 'text/html')]
    start_response(status, headers)
    return [response]
    
def addBook(environ, start_response):
    parameters = parse_qs(environ.get('QUERY_STRING', ''))
    if 'title' in parameters:
        bookTitle = escape(parameters['title'][0])
        conn = boto.dynamodb.connect_to_region(
            'us-west-2',
            aws_access_key_id='AKIAJMFCMKYSPE42Q7LQ',
            aws_secret_access_key='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')
        status = '200 OK'
        headers = [('Content-type', 'application/json')]
        btable = conn.get_table('Books')
        if 'bookID' in parameters:
            bookID = escape(parameters['bookID'][0])
        else:
            bookID = 'b' + str(generateID(conn, btable))
        if 'callback' in parameters:
            callback_function = escape(parameters['callback'][0])
            headers = [('content-type','application/javascript'), ('charset','UTF-8')]
        else:
            headers = [('content-type','application/json'), ('charset','UTF-8')]
        start_response(status, headers)     
        try:
            item = btable.new_item(attrs={"bookID": bookID, "title":bookTitle} )
            conn.put_item(item)
            if 'callback' in parameters:
                return jsonp(callback_function, json.dumps({"daffodil":0}))
            else:
                return json.dumps({"daffodil":0})
        except:
            if 'callback' in parameters:
                return jsonp(callback_function, json.dumps({"daffodil":1, "errormsg":"Something went wrong when trying to put book %s in DynamoDB" % bookID}))
            else:
                return json.dumps(json.dumps({"daffodil":1, "errormsg":"Something went wrong when trying to put book %s in DynamoDB" % bookID}))
    else:
        return not_found(environ, start_response)
    
def addQuestion(environ, start_response):
    parameters = parse_qs(environ.get('QUERY_STRING', ''))
    if ('bookID' in parameters) and ('location' in parameters) and ('question' in parameters) and ('username' in parameters):
        bookID = escape(parameters['bookID'][0])
        location = escape(parameters['location'][0])
        question = escape(parameters['question'][0])
        username = escape(parameters['username'][0])
        conn = boto.dynamodb.connect_to_region(
            'us-west-2',
            aws_access_key_id='AKIAJMFCMKYSPE42Q7LQ',
            aws_secret_access_key='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')
        status = '200 OK'
        if 'callback' in parameters:
            callback_function = escape(parameters['callback'][0])
            headers = [('content-type','application/javascript'), ('charset','UTF-8')]
        else:
            headers = [('content-type','application/json'), ('charset','UTF-8')]
        start_response(status, headers)
        qtable = conn.get_table('Questions')
        if 'questionID' in parameters:
            questionID = escape(parameters['questionID'][0])
        else:
            questionID = 'q' + str(generateID(conn, qtable))
        try:
            item = qtable.new_item(
                attrs={"questionID": questionID, 
                    "question": question,
                    "bookID": bookID,
                    "location": int(location),
                    "username": username} )
            conn.put_item(item)
            if 'callback' in parameters:
                return jsonp(callback_function, json.dumps({"daffodil":0}))
            else:
                return json.dumps({"daffodil":0})
        except:
            if 'callback' in parameters:
                return jsonp(callback_function, json.dumps({"daffodil":1, "errormsg":"Something went wrong when trying to put question %s in DynamoDB" % questionID}))
            else: 
                return json.dumps({"daffodil":1, "errormsg":"Something went wrong when trying to put question %s in DynamoDB" % questionID})
    else:
        return not_found(environ, start_response)
    
def addAnswer(environ, start_response):
    parameters = parse_qs(environ.get('QUERY_STRING', ''))
    if ('questionID' in parameters) and ('answer' in parameters) and ('username' in parameters):
        questionID = escape(parameters['questionID'][0])
        answer = escape(parameters['answer'][0])
        username = escape(parameters['username'][0])
        conn = boto.dynamodb.connect_to_region(
            'us-west-2',
            aws_access_key_id='AKIAJMFCMKYSPE42Q7LQ',
            aws_secret_access_key='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')
        status = '200 OK'
        if 'callback' in parameters:
            callback_function = escape(parameters['callback'][0])
            headers = [('content-type','application/javascript'), ('charset','UTF-8')]
        else:
            headers = [('content-type','application/json'), ('charset','UTF-8')]
        start_response(status, headers)
        atable = conn.get_table('Answers')
        if 'answerID' in parameters:
            answerID = escape(parameters['answerID'][0])
        else:
            answerID = 'a' + str(generateID(conn, atable))
        try:
            item = atable.new_item(
                attrs={"answerID": answerID,
                    "answer": answer,
                    "questionID": questionID,
                    "username": username} )
            conn.put_item(item)
            if 'callback' in parameters:
                return jsonp(callback_function, json.dumps({"daffodil":0}))
            else:
                return json.dumps({"daffodil":0})
        except:
            if 'callback' in parameters:
                return jsonp(callback_function, json.dumps({"daffodil":1, "errormsg":"Something went wrong when trying to put answer %s in DynamoDB" % answerID}))
            else:
                return json.dumps({"daffodil":1, "errormsg":"Something went wrong when trying to put answer %s in DynamoDB" % answerID})
    else:
        return not_found(environ, start_response)

def getBookID(environ, start_response):
    parameters = parse_qs(environ.get('QUERY_STRING', ''))
    if 'booktitle' in parameters:
        bookTitle = escape(parameters['booktitle'][0])
        conn = boto.dynamodb.connect_to_region(
            'us-west-2',
            aws_access_key_id='AKIAJMFCMKYSPE42Q7LQ',
            aws_secret_access_key='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')
        status = '200 OK'
        btable = conn.get_table('Books')
        jsonlist = []
        books = conn.scan(btable, scan_filter={'title': condition.EQ(bookTitle)})
        existsBook = False
        for book in books:
            jsondict = {"bookID":book["bookID"], "title":book["title"]}
            jsonlist.append(jsondict)
            existsBook = True
        if not existsBook:
            bookID = 'b' + str(generateID(conn, btable))
            item = btable.new_item(attrs={"bookID": bookID, "title":bookTitle} )
            conn.put_item(item)
            jsonlist.append({"bookID":bookID, "title":bookTitle})
        response = json.dumps(jsonlist)
        if 'callback' in parameters:
            headers = [('content-type','application/javascript'), ('charset','UTF-8')]
            start_response(status, headers)
            callback_function = escape(parameters['callback'][0])
            return jsonp(callback_function, response)
        else:
            headers = [('content-type','application/json'), ('charset','UTF-8')]
            start_response(status, headers)
            return [response]
    else:
        return not_found(environ, start_response)

def getQuestions(environ, start_response):
    parameters = parse_qs(environ.get('QUERY_STRING', ''))
    if 'bookID' in parameters:
        bookID = escape(parameters['bookID'][0])
        conn = boto.dynamodb.connect_to_region(
            'us-west-2',
            aws_access_key_id='AKIAJMFCMKYSPE42Q7LQ',
            aws_secret_access_key='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')
        status = '200 OK'
        qtable = conn.get_table('Questions')
        jsonlist = []
        questions = conn.scan(qtable, scan_filter={'bookID': condition.EQ(bookID)})
        for question in questions:
            jsondict = {"questionID":question["questionID"], 
                "title":question["question"], 
                "location":int(question["location"]), 
                "username":question["username"],
                "answers":getAnswersforQ(conn, question["questionID"])}
            jsonlist.append(jsondict)
        response = json.dumps(jsonlist)
        if 'callback' in parameters:
            headers = [('content-type','application/javascript'), ('charset','UTF-8')]
            start_response(status, headers)
            callback_function = escape(parameters['callback'][0])
            return jsonp(callback_function, response)
        else:
            headers = [('content-type','application/json'), ('charset','UTF-8')]
            start_response(status, headers)
            return [response]
    else:
        return not_found(environ, start_response)

def getAnswersforQ(conn, questionID):
    qtable = conn.get_table('Answers')
    jsonlist = []
    answers = conn.scan(qtable, scan_filter={'questionID': condition.EQ(questionID)})
    for answer in answers:
        jsondict = {"answerID":answer["answerID"], "text":answer["answer"], "username":answer["username"]}
        jsonlist.append(jsondict)
    return jsonlist
    
def getAnswers(environ, start_response):
    parameters = parse_qs(environ.get('QUERY_STRING', ''))
    if 'questionID' in parameters:
        questionID = escape(parameters['questionID'][0])
        conn = boto.dynamodb.connect_to_region(
            'us-west-2',
            aws_access_key_id='AKIAJMFCMKYSPE42Q7LQ',
            aws_secret_access_key='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')
        status = '200 OK'
        qtable = conn.get_table('Answers')
        jsonlist = []
        answers = conn.scan(qtable, scan_filter={'questionID': condition.EQ(questionID)})
        for answer in answers:
            jsondict = {"answerID":answer["answerID"], "answer":answer["answer"], "username":answer["username"]}
            jsonlist.append(jsondict)
        response = json.dumps(jsonlist)
        if 'callback' in parameters:
            headers = [('content-type','application/javascript'), ('charset','UTF-8')]
            start_response(status, headers)
            callback_function = escape(parameters['callback'][0])
            return jsonp(callback_function, response)
        else:
            headers = [('content-type','application/json'), ('charset','UTF-8')]
            start_response(status, headers)
            return [response]
    else:
        return not_found(environ, start_response)
    
def not_found(environ, start_response):
    """Called if no URL matches."""
    start_response('404 NOT FOUND', [('Content-Type', 'text/plain')])
    return ['Not Found']
    
def jsonp(callback, dictionary):
    if (callback):
        return "%s(%s)" % (callback, dictionary)
    return dictionary
    
def deleteBook(environ, start_response):
    parameters = parse_qs(environ.get('QUERY_STRING', ''))
    if ('bookID' in parameters):
        bookID = escape(parameters['bookID'][0])
        conn = boto.dynamodb.connect_to_region(
            'us-west-2',
            aws_access_key_id='AKIAJMFCMKYSPE42Q7LQ',
            aws_secret_access_key='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')
        status = '200 OK'
        if 'callback' in parameters:
            callback_function = escape(parameters['callback'][0])
            headers = [('content-type','application/javascript'), ('charset','UTF-8')]
        else:
            headers = [('content-type','application/json'), ('charset','UTF-8')]
        start_response(status, headers)
        btable = conn.get_table('Books')
        qtable = conn.get_table('Questions')
        atable = conn.get_table('Answers')
        questions = conn.scan(qtable, scan_filter={'bookID': condition.EQ(bookID)})
        for question in questions:
            questionID = question["questionID"]
            answers = conn.scan(qtable, scan_filter={'questionID': condition.EQ(questionID)})
            for answer in answers:
                conn.delete_item(answer)
            conn.delete_item(question)
        try:
            item = conn.get_item( table=btable, hash_key=bookID)
            conn.delete_item(item)
            if 'callback' in parameters:
                return jsonp(callback_function, json.dumps({"daffodil":0}))
            else:
                return json.dumps({"daffodil":0})
        except:
            if 'callback' in parameters:
                return jsonp(callback_function, json.dumps({"daffodil":1, "errormsg":"Something went wrong when trying to delete book %s from DynamoDB" % bookID}))
            else:
                return json.dumps(json.dumps({"daffodil":1, "errormsg":"Something went wrong when trying to delete book %s from DynamoDB" % bookID}))
    else:
        return not_found(environ, start_response)
        
def deleteQuestion(environ, start_response):
    parameters = parse_qs(environ.get('QUERY_STRING', ''))
    if ('questionID' in parameters):
        questionID = escape(parameters['questionID'][0])
        conn = boto.dynamodb.connect_to_region(
            'us-west-2',
            aws_access_key_id='AKIAJMFCMKYSPE42Q7LQ',
            aws_secret_access_key='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')
        status = '200 OK'
        if 'callback' in parameters:
            callback_function = escape(parameters['callback'][0])
            headers = [('content-type','application/javascript'), ('charset','UTF-8')]
        else:
            headers = [('content-type','application/json'), ('charset','UTF-8')]
        start_response(status, headers)
        qtable = conn.get_table('Questions')
        try:
            item = conn.get_item( table=qtable, hash_key=questionID)
            conn.delete_item(item)
            if 'callback' in parameters:
                return jsonp(callback_function, json.dumps({"daffodil":0}))
            else:
                return json.dumps({"daffodil":0})
        except:
            if 'callback' in parameters:
                return jsonp(callback_function, json.dumps({"daffodil":1, "errormsg":"Something went wrong when trying to delete question %s from DynamoDB" % questionID}))
            else:
                return json.dumps(json.dumps({"daffodil":1, "errormsg":"Something went wrong when trying to delete question %s from DynamoDB" % questionID}))
    else:
        return not_found(environ, start_response)
        
def deleteAnswer(environ, start_response):
    parameters = parse_qs(environ.get('QUERY_STRING', ''))
    if ('answerID' in parameters):
        answerID = escape(parameters['answerID'][0])
        conn = boto.dynamodb.connect_to_region(
            'us-west-2',
            aws_access_key_id='AKIAJMFCMKYSPE42Q7LQ',
            aws_secret_access_key='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')
        status = '200 OK'
        if 'callback' in parameters:
            callback_function = escape(parameters['callback'][0])
            headers = [('content-type','application/javascript'), ('charset','UTF-8')]
        else:
            headers = [('content-type','application/json'), ('charset','UTF-8')]
        start_response(status, headers)
        atable = conn.get_table('Answers')
        try:
            item = conn.get_item( table=atable, hash_key=answerID)
            conn.delete_item(item)
            if 'callback' in parameters:
                return jsonp(callback_function, json.dumps({"daffodil":0}))
            else:
                return json.dumps({"daffodil":0})
        except:
            if 'callback' in parameters:
                return jsonp(callback_function, json.dumps({"daffodil":1, "errormsg":"Something went wrong when trying to delete answer %s from DynamoDB" % answerID}))
            else:
                return json.dumps(json.dumps({"daffodil":1, "errormsg":"Something went wrong when trying to delete answer %s from DynamoDB" % answerID}))
    else:
        return not_found(environ, start_response)
    
urls = [
    (r'^$', index),
    (r'addbook/?$', addBook),
    (r'addquestion/?$', addQuestion),
    (r'addanswer/?$', addAnswer),
    (r'getbookid/?$', getBookID),
    (r'getquestions/?$', getQuestions),
    (r'getanswers/?$', getAnswers),
    (r'deletebook/?$', deleteBook),
    (r'deletequestion/?$', deleteQuestion),
    (r'deleteanswer/?$', deleteAnswer),
]
def application(environ, start_response):
    """
    The main WSGI application. Dispatch the current request to
    the functions from above and store the regular expression
    captures in the WSGI environment as  `myapp.url_args` so that
    the functions from above can access the url placeholders.

    If nothing matches call the `not_found` function.
    """
    path = environ.get('PATH_INFO', '').lstrip('/')
    for regex, callback in urls:
        match = re.search(regex, path)
        if match is not None:
            environ['myapp.url_args'] = match.groups()
            return callback(environ, start_response)
    return not_found(environ, start_response)
    


if __name__ == '__main__':
    httpd = make_server('', 8000, application)
    print "Serving on port 8000..."
    httpd.serve_forever()
