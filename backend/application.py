# setup libraries
from air_quality_prediction_helper import AirQualityPredictionHelper
from flask import Flask, Response
from flask_cors import CORS
import re
from flask import request
from graph_helper import GraphHelper
from datetime import datetime

# as per recommendation from @freylis, compile once only
CLEANR = re.compile('<.*?>') 

app = Flask(__name__)
CORS(app)

# helper instances
graph_helper = GraphHelper()
air_quality_predection_helper = AirQualityPredictionHelper()

@app.route('/')
def index():
	# weekly or daily
	type = request.args.get('type') 

	provided_date = request.args.get('date')
	zipcode = request.args.get('zipcode')
	people_number = request.args.get('peopleNumber')
	wind_speed = request.args.get('windSpeed')
	wind_direction = request.args.get('windDirection')
	sun_radiation = request.args.get('sunRadiation')
	boundary_layer_height = request.args.get('boundaryLayerHeight')

	# format date
	formatted_date = datetime.strptime(provided_date, '%Y-%m-%d')

	# daily predection
	if(type == 'daily'):
		result = air_quality_predection_helper.predect_daily_air_quality(formatted_date, zipcode, people_number, wind_speed, wind_direction, sun_radiation, boundary_layer_height)

	## weekly predection
	elif(type == 'weekly'):
		result = air_quality_predection_helper.predect_weekly_air_quality(formatted_date, zipcode, people_number, wind_speed, wind_direction, sun_radiation, boundary_layer_height)

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