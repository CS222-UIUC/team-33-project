from django.shortcuts import render
from django.http import HttpResponse
import requests
from dotenv import load_dotenv
import os
import io
import urllib, base64
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from django.shortcuts import render
from sklearn.linear_model import LinearRegression
import numpy as np
# Create your views here.

def home(request):
    return render(request, 'home.html')



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

from sklearn.preprocessing import PolynomialFeatures
from sklearn.pipeline import make_pipeline

def custom_regression(request):
        if request.method == 'POST':
            hours_str = request.POST.get('hours')
            temps_str = request.POST.get('temps')
            try:
                X = np.array([[float(h)] for h in hours_str.split(',')])
                y = np.array([float(t) for t in temps_str.split(',')])

                model = make_pipeline(PolynomialFeatures(degree=3), LinearRegression())
                model.fit(X, y)

                X_plot = np.linspace(0, 23, 100).reshape(-1, 1)
                y_plot = model.predict(X_plot)

                fig, ax = plt.subplots()
                ax.scatter(X, y, color='blue', label='Your Data')
                ax.plot(X_plot, y_plot, color='green', label='Polynomial Regression')
                ax.set_xlabel('Hour of Day')
                ax.set_ylabel('Temperature (°C)')
                ax.set_title('Your Custom Temperature Model')
                ax.legend()
                ax.grid(True)

                buf = io.BytesIO()
                plt.savefig(buf, format='png')
                buf.seek(0)
                string = base64.b64encode(buf.read())
                uri = urllib.parse.quote(string)

                context = {'plot': uri}
                return render(request, 'custom_regression.html', context)
            except:
                return render(request, 'custom_regression.html', {'error': 'Invalid input'})
        
        return render(request, 'custom_regression.html')

import requests
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import PolynomialFeatures
from sklearn.pipeline import make_pipeline
import matplotlib.pyplot as plt
import io, base64, urllib

def forecast_compare(request):
    if request.method == 'POST':
        load_dotenv(os.path.join(os.path.dirname(__file__), "keys.env"))
        key = os.getenv("API_KEY")
        city = request.POST.get('city')
        api_key = key  # Replace with your real key

        url = f'https://api.openweathermap.org/data/2.5/forecast?q={city}&appid={api_key}&units=metric'

        response = requests.get(url)
        if response.status_code != 200:
            return render(request, 'forecast.html', {'error': 'City not found or API error'})

        data = response.json()
        forecasts = data['list'][:8]  # next 24 hours (8 x 3h)

        hours = []
        temps = []

        for entry in forecasts:
            dt_txt = entry['dt_txt']
            hour = int(dt_txt[11:13])
            temp = entry['main']['temp']
            hours.append(hour)
            temps.append(temp)

        # Your custom model
        X = np.array([[h] for h in hours])
        y = np.array(temps)

        model = make_pipeline(PolynomialFeatures(degree=3), LinearRegression())
        model.fit(X, y)

        X_plot = np.linspace(min(hours), max(hours), 100).reshape(-1, 1)
        y_model = model.predict(X_plot)

        # Plot
        fig, ax = plt.subplots()
        ax.plot(hours, temps, 'o-', label='Actual Forecast')
        ax.plot(X_plot.flatten(), y_model, color='green', label='Custom Model')
        ax.set_title(f'Temperature Forecast for {city}')
        ax.set_xlabel('Hour of Day')
        ax.set_ylabel('Temperature (°C)')
        ax.legend()
        ax.grid(True)

        buf = io.BytesIO()
        plt.savefig(buf, format='png')
        buf.seek(0)
        string = base64.b64encode(buf.read())
        uri = urllib.parse.quote(string)

        context = {'plot': uri, 'city': city}
        return render(request, 'forecast.html', context)

    return render(request, 'forecast.html')

def micro(request):
    return render(request, "main.html")

import requests
from django.shortcuts import render

def travel_suggestions(request):
    if request.method == "POST":
        load_dotenv(os.path.join(os.path.dirname(__file__), "keys.env"))
        key = os.getenv("API_KEY")
        city = request.POST.get('city')
        api_key = key
        url = f'http://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}&units=metric'
        response = requests.get(url)
        data = response.json()

        if data.get('cod') != 200:
            suggestion = "City not found."
        else:
            weather_condition = data['weather'][0]['main'].lower()
            if weather_condition in ['clear', 'sunny']:
                suggestion = "It's sunny! How about going for a hike or enjoying outdoor activities?"
            elif weather_condition in ['rain', 'drizzle']:
                suggestion = "It's rainy! You might want to visit a museum or a café."
            elif weather_condition in ['snow', 'snowy']:
                suggestion = "It's snowy! Perfect time for skiing or a hot drink indoors."
            else:
                suggestion = "Weather is mild. Enjoy a relaxed day or go for a walk."

            temperature = data['main']['temp']
            humidity = data['main']['humidity']

        context = {
            'city': city,
            'weather_condition': weather_condition,
            'temperature': temperature,
            'humidity': humidity,
            'suggestion': suggestion
        }
        return render(request, 'suggestions.html', context)

    return render(request, 'suggestions.html')




