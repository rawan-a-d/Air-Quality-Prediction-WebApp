# setup flask
from flask import Flask
import pickle
from flask_cors import CORS
import re
from flask import request
from graph_helper import GraphHelper
# as per recommendation from @freylis, compile once only
CLEANR = re.compile('<.*?>') 

app = Flask(__name__)
CORS(app)

#loaded_model = pickle.load(open('air_quality_predictor.pkl', 'rb'))

@app.route('/')
def index():
	#return this.httpClient.get(`${this.url}?date=${airQuality.date}&zipcode=${airQuality.zipcode}&peopleNumber=${airQuality.peopleNumber}&windSpeed=${airQuality.windSpeed}&windDirection=${airQuality.windDirection}&sunRadiation=${airQuality.sunRadiation}&boundaryLayerHeight=${airQuality.boundaryLayerHeight}`)

	date = request.args.get('date')
	zipcode = request.args.get('zipcode')
	people_number = request.args.get('peopleNumber')
	wind_speed = request.args.get('windSpeed')
	wind_direction = request.args.get('windDirection')
	sun_radiation = request.args.get('sunRadiation')
	boundary_layer_height = request.args.get('boundaryLayerHeight')

	# use model to predict
	#result = loaded_model.predict(date, zipcode, people_number, wind_speed, wind_direction, sun_radiation, boundary_layer_height)[0] == 0
	result = ''

	return {'date': date, 'zipcode': zipcode}



@app.route('/map')
def map():
	date = request.args.get('date')

	result = GraphHelper.get_pollution_vs_people_by_area(date)

	return result