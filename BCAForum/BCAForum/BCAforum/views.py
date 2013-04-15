from django.template.loader import get_template
from django.shortcuts import render_to_response
from django.core.urlresolvers import reverse
from models import Books, Questions, Answers, UserProfile
from boto.dynamodb import condition
from django.core.context_processors import csrf
from django.http import HttpResponseRedirect, HttpResponse
from django.contrib.auth.decorators import login_required
from django.forms import ModelForm

class ProfileForm(ModelForm):
    class Meta:
        model = UserProfile
        exclude = ["posts", "user"]

def main(request):
    """Main listing."""
    #return HttpResponse("Hello world")
    books = list(Books.scan())
    return render_to_response("list.html", dict(books=books, user=request.user))

def add_csrf(request, ** kwargs):
    d = dict(user=request.user, ** kwargs)
    d.update(csrf(request))
    return d

def mk_paginator(request, items, num_items):
    """Create and return a paginator."""
    #paginator = Paginator(items, num_items)
    #try: page = int(request.GET.get("page", '1'))
    #except ValueError: page = 1

    #try:
    #    items = paginator.page(page)
    #except (InvalidPage, EmptyPage):
    #    items = paginator.page(paginator.num_pages)
    #return items
    pass

def book(request, pk):
    questions = list(Questions.scan({"bookID":condition.EQ(pk)}))
    return render_to_response("book.html", add_csrf(request, questions=questions, pk=pk))

def question(request, pk):
    """Listing of answers to a question."""
    answers = list(Answers.scan({"questionID":condition.EQ(pk)}))
    title = Questions.get(pk).question
    return render_to_response("question.html", add_csrf(request, answers=answers, pk=pk,
        title=title))
    
def post(request, ptype, pk):
    """Display a post form."""
    action = reverse("BCAforum.views.%s" % ptype, args=[pk])
    if ptype == "new_thread":
        title = "Ask a question"
        subject = ''
    elif ptype == "reply":
        title = "Answer"
        subject = "Re: " + Questions.get(pk).question

    return render_to_response("question.html", add_csrf(request, subject=subject,
        action=action, title=title))

def increment_post_counter(request):
    profile = request.user.userprofile_set.all()[0]
    profile.posts += 1
    profile.save()

def new_question(request, pk):
    """Start a new thread."""
    p = request.POST
    if p["body"]:
        q=Questions()
        q.title=p["body"]
        q.username=request.user
        q.bookID=pk
        q.save()
        increment_post_counter(request)
    return HttpResponseRedirect(reverse("BCAforum.views.forum", args=[pk]))

@login_required
def profile(request, pk):
    """Edit user profile."""
    profile = UserProfile.objects.get(user=pk)

    if request.method == "POST":
        pf = ProfileForm(request.POST, request.FILES, instance=profile)
        if pf.is_valid():
            pf.save()
            # resize and save image under same filename
    else:
        pf = ProfileForm(instance=profile)

    return render_to_response("profile.html", add_csrf(request, pf=pf))


def reply(request, pk):
    #"""Reply to a thread."""
    #p = request.POST
    #if p["body"]:
    #    thread = Thread.objects.get(pk=pk)
    #    post = Post.objects.create(thread=thread, title=p["subject"], body=p["body"],
    #        creator=request.user)
    #return HttpResponseRedirect(reverse("dbe.forum.views.thread", args=[pk]) + "?page=last")
    pass