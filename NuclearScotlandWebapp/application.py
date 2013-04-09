from wsgiref.simple_server import make_server
from cgi import parse_qs, escape
import boto.dynamodb
import condition
import re

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

<form name="addBook" action="" method="POST">Enter book information to add it: <br/>
book title: 
<input type="text" name="bookTitle" value=""> <br/>
<input type="submit" value="Add book">
</form>
<br/>
<br/>

<form name="addQuestion" action="" method="POST">Enter question information to add it: <br/>
question: 
<input type="text" name="question" value=""> <br/>
bookID: 
<input type="text" name="bookID" value=""> <br/>
location: 
<input type="text" name="location" value=""> <br/>
<input type="submit" value="Add question">
</form>
<br/>
<br/>

<form name="addAnswer" action="" method="POST">Enter answer information to add it: <br/>
answer: 
<input type="text" name="answer" value=""> <br/>
questionID: 
<input type="text" name="questionID" value=""> <br/>
<input type="submit" value="Add answer">
</form>
<br/>
<br/>

</body>
</html>

"""



def index(environ, start_response):
    conn = boto.dynamodb.connect_to_region(
        'us-west-2',
        aws_access_key_id='AKIAIOTGS64MNYNSZ2WQ',
        aws_secret_access_key='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')
    status = '200 OK'
    headers = [('Content-type', 'text/html')]
    btable = conn.get_table('Books')
    qtable = conn.get_table('Questions')
    atable = conn.get_table('Answers')
    questionsForB1 = conn.scan(qtable, scan_filter={'bookID': condition.EQ(1)})
    aux = response
    start_response(status, headers)
    for item in questionsForB1:
        aux = aux + str(item) + '\n'
    return [aux]
    
def addBook(environ, start_response):
    parameters = parse_qs(environ.get('QUERY_STRING', ''))
    if 'title' in parameters:
        bookTitle = escape(parameters['title'][0])
        conn = boto.dynamodb.connect_to_region(
            'us-west-2',
            aws_access_key_id='AKIAIOTGS64MNYNSZ2WQ',
            aws_secret_access_key='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')
        status = '200 OK'
        headers = [('Content-type', 'text/html')]
        btable = conn.get_table('Books')
        btable.new_item(attrs={"title":str(bookTitle)} )
        start_response(status, headers)
        return [response]
    else:
        return not_found(environ, start_response)
    
def addQuestion(environ, start_response):
    conn = boto.dynamodb.connect_to_region(
        'us-west-2',
        aws_access_key_id='AKIAIOTGS64MNYNSZ2WQ',
        aws_secret_access_key='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')
    status = '200 OK'
    headers = [('Content-type', 'text/html')]
    btable = conn.get_table('Books')
    qtable = conn.get_table('Questions')
    atable = conn.get_table('Answers')
    questionsForB1 = conn.scan(qtable, scan_filter={'bookID': condition.EQ(1)})
    aux = response
    start_response(status, headers)
    for item in questionsForB1:
        aux = aux + str(item) + '\n'
    return [aux]
    
def addAnswer(environ, start_response):
    conn = boto.dynamodb.connect_to_region(
        'us-west-2',
        aws_access_key_id='AKIAIOTGS64MNYNSZ2WQ',
        aws_secret_access_key='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')
    status = '200 OK'
    headers = [('Content-type', 'text/html')]
    btable = conn.get_table('Books')
    qtable = conn.get_table('Questions')
    atable = conn.get_table('Answers')
    questionsForB1 = conn.scan(qtable, scan_filter={'bookID': condition.EQ(1)})
    aux = response
    start_response(status, headers)
    for item in questionsForB1:
        aux = aux + str(item) + '\n'
    return [aux]
    
def getQuestions(environ, start_response):
    parameters = parse_qs(environ.get('QUERY_STRING', ''))
    if 'bookID' in parameters:
        import json
        bookID = escape(parameters['bookID'][0])
        conn = boto.dynamodb.connect_to_region(
            'us-west-2',
            aws_access_key_id='AKIAIOTGS64MNYNSZ2WQ',
            aws_secret_access_key='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')
        status = '200 OK'
        headers = [('content-type','application/json'), ('charset','UTF-8')]
        qtable = conn.get_table('Questions')
        jsonlist = []
        questions = conn.scan(qtable, scan_filter={'bookID': condition.EQ(int(bookID))})
        start_response(status, headers)
        for question in questions:
            jsondict = {"questionID":question["questionID"], "question":question["question"], "location":int(question["location"])}
            jsonlist.append(jsondict)
        response = json.dumps(jsonlist)
        return [response]
    else:
        return not_found(environ, start_response)
    
def getAnswers(environ, start_response):
    parameters = parse_qs(environ.get('QUERY_STRING', ''))
    if 'questionID' in parameters:
        import json
        questionID = escape(parameters['questionID'][0])
        conn = boto.dynamodb.connect_to_region(
            'us-west-2',
            aws_access_key_id='AKIAIOTGS64MNYNSZ2WQ',
            aws_secret_access_key='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')
        status = '200 OK'
        headers = [('content-type','application/json'), ('charset','UTF-8')]
        qtable = conn.get_table('Answers')
        jsonlist = []
        answers = conn.scan(qtable, scan_filter={'questionID': condition.EQ(questionID)})
        start_response(status, headers)
        for answer in answers:
            jsondict = {"answerID":answer["answerID"], "answer":answer["answer"]}
            jsonlist.append(jsondict)
        response = json.dumps(jsonlist)
        return [response]
    else:
        return not_found(environ, start_response)
    
def not_found(environ, start_response):
    """Called if no URL matches."""
    start_response('404 NOT FOUND', [('Content-Type', 'text/plain')])
    return ['Not Found']
    
urls = [
    (r'^$', index),
    (r'addbook/?$', addBook),
    (r'addquestion/?$', addQuestion),
    (r'addanswer/?$', addAnswer),
    (r'getquestions/?$', getQuestions),
    (r'getanswers/?$', getAnswers),
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
