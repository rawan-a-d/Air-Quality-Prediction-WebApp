# A RESTful API built with Flask

It makes use of a trained AI model ([Air Quality Prediction Prediction AI](https://github.com/rawan-a-d/Air-Quality-Prediction)) that predicts air quality in a certain area in Eindhoven on a certain day.

## Run app:

1. Activate environment

```bash
source .venv/Scripts/activate
```

2. Create environment variables (must be run everytime the terminal is reopened)

```bash
export FLASK_APP=application.py
export FLASK_DEBUG=true
```

3. Run Flask app

```bash
flask run
```

## First Time Setup:

1. Create a virtual environment to isolate dependencies for this app

```bash
python -m venv .venv
```

2. Activate environment

```bash
source .venv/Scripts/activate
```

3. Install packages in requirements.txt

```bash
pip3 install -r requirements.txt
```

4. Create environment variables

```bash
export FLASK_APP=application.py
export FLASK_DEBUG=true
```

5. Run Flask app

```bash
flask run
```

## Update packages in requirements.txt file:

```bash
pip3 freeze > requirements.txt
```

## Resources:

https://www.youtube.com/watch?v=qbLc5a9jdXo
https://stackoverflow.com/questions/34122949/working-outside-of-application-context-flask
