import pandas as pd
import pgeocode

nomi = pgeocode.Nominatim('nl')

class GraphHelper:
	# Initialize class
	def __init__(self):
		self.dataframe = self.get_dataframe()

	# Merge datasets
	def get_dataframe(self):
		# read csv file
		df = pd.read_csv('data/df_prepared_full_data.csv')

		# round to 2 decimal places
		df = df.round(decimals=2)

		# create date column
		df['date'] = pd.to_datetime(df[['year', 'month', 'day']])

		# order dataframe by date and area
		df.sort_values(['date', 'PC4'], ascending=[True, True], inplace=True)

		return df


	# Get pollution vs people by area on a specific date
	def get_pollution_vs_people_by_area(self, date):
		df = self.dataframe

		# get people number vs pollution for a specific date
		df = df[df.date == date].reset_index(drop=True)

		# add lat, long columns
		df['lat'] = df['PC4'].apply(lambda x: nomi.query_postal_code(x)[9])
		df['long'] = df['PC4'].apply(lambda x: nomi.query_postal_code(x)[10])

		# convert PC4 to string
		df['PC4'] = df['PC4'].astype('str')

		# rename pm2.5 and PC4 columns
		df.rename(columns={'pm2.5': 'pollution', 'PC4': 'zipcode'}, inplace=True)

		return df[['zipcode', 'date', 'lat', 'long', 'people_number', 'pollution']].to_dict('records')
