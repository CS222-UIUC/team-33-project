# Introduction

## What is TempWise?

**TempWise** is a Node.js/Django-based web application that helps users explore, predict, and understand temperature data through interactive features, IoT devices, regression modeling, and real-time weather forecasts.

For more details, view the full project proposal [here](https://docs.google.com/document/d/1r9J_nPqgmsCsHMisUa338GkrDwXB0oKijnIRtwspQKE/edit?usp=sharing).

# Technical Architecture

![Assignment Aggregator Technical Architecture](https://github.com/CS222-UIUC/team-33-project/blob/main/techarc.png)

# Developers

- **Nathan Jacobs**: Worked on Node.js backend and UI Design
- **Serkan Gozel**: Worked on IoT socket connection and Data Collection 
- **Hasan Colak**: Worked on IoT socket connection and API handling
- **Furkan Akin**: Worked on Django backend and frontend

# Environment Setup

## Initial venv Installation

Navigate to your source directory, and run the following command.

```
python3 -m venv env
```

## Running venv

Before running any code, run the following:

For Windows Users:
```
env/Scripts/activate/
```
For Mac Users:
```
source env/bin/activate 
```
# Development

## Node.js
For this project, you will need to have Node.js downloaded.

For Windows Users:
```
nvm install lstm
```
For Mac Users:
```
brew install node
```


## Package Updates

To enable package updates, run the following command ONCE: 
```
pip install pipreqs
```

To update packages, run the following from the home directory:
```
pipreqs . --force
```

## Package Management

To install the necessary modules, run the following:

```
pip install -r requirements.txt
```

# Project Instructions

1. To start your Django server:
```
python manage.py runserver
```

Note, you must:
- have installed all the modules located in `requirements.txt`.

2. Setting up the IOTS:
# TempWise Arduino + DHT11 Setup Guide

This guide walks you through connecting a DHT11 temperature sensor to an Arduino Uno and uploading the sample sketch to begin reading and printing temperature values over Serial.

---

## Hardware Needed

- **Arduino Uno**  
- **DHT11** temperature & humidity sensor  
- Jumper wires  
- Breadboard (optional)

---

## Wiring

If your DHT11 has 3 pins, wire it as follows:

| DHT11 Pin | Arduino Pin   |
|-----------|---------------|
| VCC       | 5V            |
| GND       | GND           |
| DATA      | Digital Pin 9 |

---

## Software Setup

1. **Install the Arduino IDE**  
   Download & install from:  
   https://www.arduino.cc/en/software

2. **Install Required Libraries**  
   1. Open the Arduino IDE.  
   2. Go to **Sketch** → **Include Library** → **Manage Libraries…**  
   3. Search for **DHT sensor library by Adafruit** and click **Install**.  
   4. Also install **Adafruit Unified Sensor**.

---

## Uploading the Sketch

1. Connect your Arduino Uno to your computer via USB.  
2. In the Arduino IDE, select:  
   - **Tools → Board → Arduino Uno**  
   - **Tools → Port → (your COM port)**  
3. Open the provided `TempWise_DHT11.ino` sketch.  
4. Click **Upload** (the → arrow button).  
5. Open **Serial Monitor** (Tools → Serial Monitor) at **9600 baud** to view temperature readings.

Links:
1. Link to the sensor used: https://sensorkit.arduino.cc/sensorkit/module/lessons/lesson/08-the-temperature-sensor
2. Link to the IOT device: https://store-usa.arduino.cc/products/arduino-uno-rev3?gQT=3


 
