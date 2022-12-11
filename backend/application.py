# setup flask
from flask import Flask
import pickle
from flask_cors import CORS
import re
# as per recommendation from @freylis, compile once only
CLEANR = re.compile('<.*?>') 

app = Flask(__name__)
CORS(app)

#loaded_model = pickle.load(open("air_quality_predictor.pkl", "rb"))

@app.route('/<text>')
def index(text):
	input = [text]
	# use model to predict
	#result = loaded_model.predict(input)[0] == 0
	result = ""

	return {"result": result}