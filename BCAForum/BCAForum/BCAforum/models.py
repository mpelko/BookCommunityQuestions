from dynamodb_mapper.model import DynamoDBModel
from dynamodb_mapper.model import ConnectionBorg
from string import join
#from settings import MEDIA_ROOT
from boto.dynamodb import condition

conn = ConnectionBorg()
conn.set_region('us-west-2')

class Books(DynamoDBModel):
    __table__ = u"Books"
    __hash_key__ = u"bookID"
    __schema__ = {
        u"bookID": unicode,
        u"title": unicode,
    }
    def __unicode__(self):
        return self.title
    def num_quest(self):
        return len(list(Questions.scan({"bookID":condition.EQ(self.bookID)})))
       
class Questions(DynamoDBModel):
    __table__ = u"Questions"
    __hash_key__ = u"questionID"
    __schema__ = {
        u"questionID": unicode,
        u"bookID": unicode,
        u"question": unicode,
        u"username": unicode,
        u"location": int,
    }
    def __unicode__(self):
        return self.question
    def num_answs(self):
        return len(list(Answers.scan({"questionID":condition.EQ(self.questionID)})))

class Answers(DynamoDBModel):
    __table__ = u"Answers"
    __hash_key__ = u"answerID"
    __schema__ = {
        u"answerID": unicode,
        u"questionID": unicode,
        u"answer": unicode,
        u"username": unicode,
    }
    def __unicode__(self):
        return self.answer