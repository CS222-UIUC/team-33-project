# Introduction

## What is the TempWise?

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

2. To add links for LMS:
```
python src/ics.py add <link> <lms>
```

3. To read and get your data:
```
python src/ics.py read [notion | todoist]
```
 - To access your assignments into Todoist, follow the instructions [here](https://todoist.com/help/articles/importing-or-exporting-project-templates#importing-project-templates-from-a-csv-file) to import the "new_data.csv" file to a Project. You can repeatedly import this file as it updates and Todoist will automatically merge them for you.
