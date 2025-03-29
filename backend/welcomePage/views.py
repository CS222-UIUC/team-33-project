from django.shortcuts import render
from django.http import HttpResponse
import requests
from dotenv import load_dotenv
import os
# Create your views here.



def home(request):
    return HttpResponse('Welcome to TempWise!')

def callAPI(request):
    load_dotenv(os.path.join(os.path.dirname(__file__), "keys.env"))
    key = os.getenv("API_KEY")
    city = "Chicago"
    response = requests.get(f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={key}&units=metric")

    weather_data = response.json()
    
    if response.status_code == 200:
            context = {
                "city": weather_data["name"],
                "temperature": weather_data["main"]["temp"],
                "weather": weather_data["weather"][0]["description"],
                "icon": weather_data["weather"][0]["icon"],
            }
    return render(request, "weather.html", context)


