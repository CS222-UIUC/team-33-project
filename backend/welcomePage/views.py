from django.shortcuts import render
from django.http import HttpResponse
import requests
from dotenv import load_dotenv
import os
import io
import urllib, base64
import matplotlib.pyplot as plt
from django.shortcuts import render
from sklearn.linear_model import LinearRegression
import numpy as np
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

def temperature_plot(request):
    
    X = np.array([[0], [4], [8], [12], [16], [20], [23]])
    y = np.array([4.2, 5.5, 10.3, 15.2, 13.1, 9.4, 6.3])

    degree = 3
    model = make_pipeline(PolynomialFeatures(degree), LinearRegression())
    model.fit(X, y)

    X_plot = np.linspace(0, 23, 100).reshape(-1, 1)
    y_plot = model.predict(X_plot)


    fig, ax = plt.subplots()
    ax.scatter(X, y, color='blue', label='Actual data')
    ax.plot(X_plot, y_plot, color='red', label=f'Polynomial Regression (degree {degree})')
    ax.set_xlabel('Hour of Day')
    ax.set_ylabel('Temperature (°C)')
    ax.set_title('Polynomial Regression: Hour vs. Temperature')
    ax.legend()
    ax.grid(True)


    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    string = base64.b64encode(buf.read())
    uri = urllib.parse.quote(string)

    context = {'plot': uri}
    return render(request, 'temperature.html', context)
