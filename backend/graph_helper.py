import pandas as pd
import pgeocode

nomi = pgeocode.Nominatim('nl')

class GraphHelper:
	# Initialize class
	def __init__(self):
		self.dataframe = self.get_merged_dataframe()

	# Merge datasets
	def get_merged_dataframe(self):
		# read zichtop dataset csv file
		df_zichtop = pd.read_csv('data/zichtop.csv', 
							parse_dates=['date'])

		# read air_pollution dataset csv file
		df_air_pollution = pd.read_csv('data/air_pollution.csv',
							parse_dates=['date'])

		# merge datasets
		df_zichtop_air_pollution = pd.merge(df_zichtop, df_air_pollution[['PC4','date', 'pm2.5']], on=['PC4', 'date'])

		# reorder columns
		zichtop_air_pollution_features = [
			'PC4',
			'date',
			'pop_tot',
			'pm2.5',
			'm00_30',
			'm30_60',
			'H1_2',
			'H2_4',
			'H4_8',
			'H8_16',
			'H16plus'
		]
		df_zichtop_air_pollution = df_zichtop_air_pollution.reindex(zichtop_air_pollution_features, axis=1)

		# rename and separate date and time columns
		df_zichtop_air_pollution.rename(columns={'date': 'date_time'}, inplace=True)
		df_zichtop_air_pollution['date'] = df_zichtop_air_pollution['date_time'].dt.date.astype(str)
		df_zichtop_air_pollution['time'] = df_zichtop_air_pollution['date_time'].dt.time.astype(str)

		return df_zichtop_air_pollution

	# Get pollution vs people by area on a specific date
	def get_pollution_vs_people_by_area(self, date):
		df_zichtop_air_pollution = self.dataframe

		# get specific columns
		people_per_hour = df_zichtop_air_pollution.iloc[:, [0, 3, 4, 5, 11, 12]].copy()

		# calculate number of people per hour
		people_per_hour['peopleNumber'] = people_per_hour['m00_30'] + people_per_hour['m30_60']

		# calculate people number (sum) and pm2.5 (average) per day
		people_pollution_per_day_area = people_per_hour.groupby(['PC4', 'date']).agg({'peopleNumber': 'sum', 'pm2.5': 'mean'}).reset_index()
		# round to 2 decimal places
		people_pollution_per_day_area = people_pollution_per_day_area.round(decimals=2)

		# get people number vs pollution for a specific date
		people_pollution_per_day = people_pollution_per_day_area[people_pollution_per_day_area.date == date].reset_index(drop=True)
		# round to 2 decimal places
		people_pollution_per_day = people_pollution_per_day.round(decimals=2)

		# add lat, long columns
		people_pollution_per_day['lat'] = people_pollution_per_day['PC4'].apply(lambda x: nomi.query_postal_code(x)[9])
		people_pollution_per_day['long'] = people_pollution_per_day['PC4'].apply(lambda x: nomi.query_postal_code(x)[10])

		# convert PC4 to string
		people_pollution_per_day['PC4'] = people_pollution_per_day['PC4'].astype('str')

		# rename pm2.5 and PC4 columns
		people_pollution_per_day.rename(columns={'pm2.5': 'pollution', 'PC4': 'zipcode'}, inplace=True)

		return people_pollution_per_day.to_dict('records')
