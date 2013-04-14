from django.template.loader import get_template
from django.shortcuts import render_to_response
from django.core.urlresolvers import reverse
from models import Books, Questions, Answers
from django.http import HttpResponse
from boto.dynamodb import condition
from django.core.context_processors import csrf

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
    action = reverse("dbe.BCAforum.views.%s" % ptype, args=[pk])
    if ptype == "new_thread":
        title = "Ask a question"
        subject = ''
    elif ptype == "reply":
        title = "Answer"
        subject = "Re: " + Questions.get(pk).question

    return render_to_response("question.html", add_csrf(request, subject=subject,
        action=action, title=title))
    
def new_question(request, pk):
    #"""Start a new thread."""
    #p = request.POST
    #if p["subject"] and p["body"]:
    #    forum = Forum.objects.get(pk=pk)
    #    thread = Thread.objects.create(forum=forum, title=p["subject"], creator=request.user)
    #    Post.objects.create(thread=thread, title=p["subject"], body=p["body"], creator=request.user)
    #return HttpResponseRedirect(reverse("dbe.forum.views.forum", args=[pk]))
    pass

def reply(request, pk):
    #"""Reply to a thread."""
    #p = request.POST
    #if p["body"]:
    #    thread = Thread.objects.get(pk=pk)
    #    post = Post.objects.create(thread=thread, title=p["subject"], body=p["body"],
    #        creator=request.user)
    #return HttpResponseRedirect(reverse("dbe.forum.views.thread", args=[pk]) + "?page=last")
    pass