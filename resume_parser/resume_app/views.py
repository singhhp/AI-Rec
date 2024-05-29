import os
from django.shortcuts import render
from django.http import JsonResponse
from pyresparser import ResumeParser
import json
from django.core.files.storage import FileSystemStorage
from .resume_analysis import analyze_resume

def react_frontend(request):
    return render(request, 'index.html')

def upload_resume(request):
    return render(request, 'upload_resume.html')

def process_resume(request):
    print("Processing resume")
    if request.method == 'POST' and request.FILES['resume']:
        resume = request.FILES['resume']
        fs = FileSystemStorage()
        filename = fs.save(resume.name, resume)
        resume_path = fs.path(filename)
        print(f"Resume path: {resume_path}")
        data = ResumeParser(resume_path).get_extracted_data()
        print(f"Extracted data: {data}")

        # Analyze the resume and get the predicted job role
        predicted_job_role = analyze_resume(resume_path)

        # Add the predicted job role to the data dictionary
        data['predicted_job_role'] = predicted_job_role

        # File Path and Appending Data
        file_path = os.path.join(os.path.dirname(__file__), 'static', 'resume_data.json')

        # Create or clear the file before adding new data
        with open(file_path, 'w') as file:
            pass

        resume_json = json.dumps(data)
        with open(file_path, 'a') as file:
            file.write(resume_json + "\n")

        # Remove the PDF file
        os.remove(resume_path)

        return JsonResponse(data)  # Return the data as JSON response

    return render(request, 'upload_resume.html')

def resume_analysis(request):
    # Your code for resume analysis goes here
    return render(request, 'resume_analysis.html')
