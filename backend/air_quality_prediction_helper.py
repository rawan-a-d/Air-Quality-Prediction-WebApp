class AirQualityPredictionHelper:
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