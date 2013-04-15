from dynamodb_mapper.model import DynamoDBModel
from dynamodb_mapper.model import ConnectionBorg
from django.db import models
#from settings import MEDIA_ROOT
from boto.dynamodb import condition
from django.db.models.signals import post_save
from django.contrib.auth.models import User


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

    
class UserProfile(models.Model):
    posts = models.IntegerField(default=0)
    user = models.ForeignKey(User, unique=True)

    def __unicode__(self):
        return unicode(self.user)


def create_user_profile(sender, **kwargs):
    """When creating a new user, make a profile for him."""
    u = kwargs["instance"]
    if not UserProfile.objects.filter(user=u):
        UserProfile(user=u).save()

post_save.connect(create_user_profile, sender=User)