# setup flask
from air_quality_prediction_helper import AirQualityPredictionHelper
from flask import Flask, Response
import pickle
from flask_cors import CORS
import re
from flask import request
from graph_helper import GraphHelper
from datetime import datetime, date

# as per recommendation from @freylis, compile once only
CLEANR = re.compile('<.*?>') 

app = Flask(__name__)
CORS(app)

# graph helper instance
graph_helper = GraphHelper()

loaded_model = pickle.load(open('model/gbr_air_quality_prediction_model.pkl', 'rb'))

@app.route('/')
def index():
	providedDate = request.args.get('date')
	zipcode = request.args.get('zipcode')
	people_number = request.args.get('peopleNumber')
	wind_speed = request.args.get('windSpeed')
	wind_direction = request.args.get('windDirection')
	sun_radiation = request.args.get('sunRadiation')
	boundary_layer_height = request.args.get('boundaryLayerHeight')

	# format date
	formattedDate = datetime.strptime(providedDate, "%Y-%m-%d")

	# extract date info
	year = formattedDate.year
	month = formattedDate.month
	day = formattedDate.day
	day_of_week = formattedDate.weekday()
	day_of_year =  date(year, month, day).timetuple().tm_yday

	# use model to predict
	result = loaded_model.predict([[zipcode, people_number, wind_direction, wind_speed, sun_radiation, boundary_layer_height, year, month, day, day_of_week, day_of_year]])[0]

	return AirQualityPredictionHelper.get_air_quality_level(result)



@app.route('/map')
def map():
	date = request.args.get('date')

	result = graph_helper.get_pollution_vs_people_by_area(date)

	if(not result):
		return Response("No data was found for the specified date", status=400)

	return result