from datetime import date
import pandas as pd
import pickle

class AirQualityPredictionHelper:
	# load models
	daily_model = pickle.load(open('model/gbr_air_quality_prediction_model.pkl', 'rb'))
	weekly_model = pickle.load(open('model/gbr_air_quality_prediction_model_weekly.pkl', 'rb'))

	# Predict daily air quality
	def predect_daily_air_quality(self, formatted_date, zipcode, people_number, wind_speed, wind_direction, sun_radiation, boundary_layer_height):
		# extract date info
		year = formatted_date.year
		month = formatted_date.month
		day = formatted_date.day
		day_of_week = formatted_date.weekday()
		day_of_year =  date(year, month, day).timetuple().tm_yday

		# use model to predict
		result = self.daily_model.predict([[zipcode, people_number, wind_direction, wind_speed, sun_radiation, boundary_layer_height, year, month, day, day_of_week, day_of_year]])[0]
	
		return result


	# Predict weekly air quality
	def predect_weekly_air_quality(self, formatted_date, zipcode, people_number, wind_speed, wind_direction, sun_radiation, boundary_layer_height):		
		# extract date info (season and week number)
		week_number = formatted_date.isocalendar()[1]

		date_offset = (formatted_date.month * 100 + formatted_date.day - 320) % 1300
		season = pd.cut([date_offset], [0, 300, 602, 900, 1300], 
							labels=[1, 2, 3, 4])

		# use model to predict
		result = self.weekly_model.predict([[zipcode, week_number, wind_direction, wind_speed, sun_radiation, boundary_layer_height, people_number, season[0]]])[0]

		return result


	# Get air quality level category
	@staticmethod
	def get_air_quality_level(numerical_air_quality_level):
		air_quality_level_category = ''
		if numerical_air_quality_level <= 12:
			air_quality_level_category = 'Good'
		elif (numerical_air_quality_level > 12) & (numerical_air_quality_level < 25):
			air_quality_level_category = 'Moderate'
		elif (numerical_air_quality_level > 25) & (numerical_air_quality_level < 55):
			air_quality_level_category = 'Unhealthy for Sensitive Groups'
		elif (numerical_air_quality_level > 55) & (numerical_air_quality_level < 150):
			air_quality_level_category = 'Unhealthy'
		elif (numerical_air_quality_level > 150) & (numerical_air_quality_level < 250):
			air_quality_level_category = 'Very Unhealthy'
		else:
			air_quality_level_category = 'Hazardous'

		return {'airQualityLevelNumerical': numerical_air_quality_level, 'airQualityLevel': air_quality_level_category}