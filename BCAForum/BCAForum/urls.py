from django.conf.urls import patterns, include, url
from BCAforum.views import main, book, question, post, reply, new_question, profile

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
    url(r"^$ ", main),
    url(r"^main/$", main),
    url(r"^book/(.*?)/$", book),
    (r"^question/(.*?)/$", question),
    url(r"^post/(new_question|reply)/(.*?)/$", post),
    url(r"^reply/(.*?)/$", reply),
    url(r"^new_question/(.*?)/$", new_question),
    url(r"^new_question/(.*?)/$", new_question),
    url(r"^profile/(\d+)/$", profile),
    (r'^accounts/', include('registration.urls')),
)

