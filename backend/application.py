# setup flask
from air_quality_prediction_helper import AirQualityPredictionHelper
from flask import Flask, Response
import pickle
from flask_cors import CORS
import re
from flask import request
from graph_helper import GraphHelper
from datetime import datetime, date
import pandas as pd

# as per recommendation from @freylis, compile once only
CLEANR = re.compile('<.*?>') 

app = Flask(__name__)
CORS(app)

# graph helper instance
graph_helper = GraphHelper()

# models
loaded_daily_model = pickle.load(open('model/gbr_air_quality_prediction_model.pkl', 'rb'))
loaded_weekly_model = pickle.load(open('model/gbr_air_quality_prediction_model_weekly.pkl', 'rb'))

@app.route('/')
def index():
	# weekly or daily
	type = request.args.get('type') 

	providedDate = request.args.get('date')
	zipcode = request.args.get('zipcode')
	people_number = request.args.get('peopleNumber')
	wind_speed = request.args.get('windSpeed')
	wind_direction = request.args.get('windDirection')
	sun_radiation = request.args.get('sunRadiation')
	boundary_layer_height = request.args.get('boundaryLayerHeight')

	# format date
	formattedDate = datetime.strptime(providedDate, '%Y-%m-%d')

	# daily predection
	if(type == 'daily'):
		# extract date info
		year = formattedDate.year
		month = formattedDate.month
		day = formattedDate.day
		day_of_week = formattedDate.weekday()
		day_of_year =  date(year, month, day).timetuple().tm_yday

		# use model to predict
		result = loaded_daily_model.predict([[zipcode, people_number, wind_direction, wind_speed, sun_radiation, boundary_layer_height, year, month, day, day_of_week, day_of_year]])[0]
	# weekly predection
	elif(type == 'weekly'):
		# extract date info (season and week number)
		week_number = formattedDate.isocalendar()[1]

		date_offset = (formattedDate.month * 100 + formattedDate.day - 320) % 1300
		season = pd.cut([date_offset], [0, 300, 602, 900, 1300], 
							labels=[1, 2, 3, 4])

		# use model to predict
		result = loaded_weekly_model.predict([[zipcode, week_number, wind_direction, wind_speed, sun_radiation, boundary_layer_height, people_number, season[0]]])[0]

	# round to 2 decimal places
	resultRounded = round(result, 2)

	return AirQualityPredictionHelper.get_air_quality_level(resultRounded)


@app.route('/map')
def map():
	date = request.args.get('date')

	result = graph_helper.get_pollution_vs_people_by_area(date)

	if(not result):
		return Response('No data was found for the specified date', status=400)

	return result