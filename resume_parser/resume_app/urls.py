from django.urls import path
from . import views

app_name = 'resume_app'

urlpatterns = [
    #path('', views.react_frontend, name='react_frontend'),
    path('', views.upload_resume, name='upload_resume'),
    path('process/', views.process_resume, name='process_resume'),
    path('resume-analysis/', views.resume_analysis, name='resume_analysis'),
   # path('react/', views.react_frontend, name='react_frontend'),  # Add this URL pattern
    # Add other URL patterns as needed
    # Add other URL patterns as needed
]

#urlpatterns = [
#    path('', views.upload_resume, name='upload_resume'),
    # Add other URL patterns as needed
#]
