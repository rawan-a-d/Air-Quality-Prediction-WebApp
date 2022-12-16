# setup flask
from flask import Flask, render_template
import pickle
from flask_cors import CORS
import re
from flask import request
# as per recommendation from @freylis, compile once only
CLEANR = re.compile('<.*?>') 
import matplotlib.pyplot as plt, mpld3

# Regular EDA (exploratory data analysis) and plotting libraries
import pandas as pd
import numpy as np
import pgeocode
import plotly.express as px
from datetime import datetime, date, timedelta
from mpld3 import fig_to_html, plugins
import time

# Set the style
plt.style.use("ggplot")
# plt.style.available

app = Flask(__name__)
CORS(app)

#loaded_model = pickle.load(open("air_quality_predictor.pkl", "rb"))

# read zichtop dataset csv file
df_zichtop = pd.read_csv("data/zichtop.csv", 
                    parse_dates=["date"])

# read air_pollution dataset csv file
df_air_pollution = pd.read_csv("data/air_pollution.csv",
                    parse_dates=["date"])


df_zichtop_air_pollution = pd.merge(df_zichtop, df_air_pollution[["PC4","date", "pm2.5"]], on=["PC4", "date"])
df_zichtop_air_pollution.sample(5)	

zichtop_air_pollution_features = [
    "PC4",
    "date",
    "pop_tot",
    "pm2.5",
    "m00_30",
    "m30_60",
    "H1_2",
    "H2_4",
    "H4_8",
    "H8_16",
    "H16plus"
]

df_zichtop_air_pollution = df_zichtop_air_pollution.reindex(zichtop_air_pollution_features, axis=1)

df_zichtop_air_pollution.sample(5)

df_zichtop_air_pollution.rename(columns={"date": "date_time"}, inplace=True)

df_zichtop_air_pollution["date"] = df_zichtop_air_pollution["date_time"].dt.date.astype(str)
df_zichtop_air_pollution["time"] = df_zichtop_air_pollution["date_time"].dt.time.astype(str)

nomi = pgeocode.Nominatim('nl')

# Get specific columns
people_per_hour = df_zichtop_air_pollution.iloc[:, [0, 3, 4, 5, 11, 12]].copy()
# Calculate number of people per hour
people_per_hour["people_number"] = people_per_hour["m00_30"] + people_per_hour["m30_60"]

people_per_hour.head(5)

# Calculate people number (sum) and pm2.5 (average) per day
people_pollution_per_day_area = people_per_hour.groupby(["PC4", "date"]).agg({"people_number": "sum", "pm2.5": "mean"}).reset_index()
## Round to 2 decimal places
people_pollution_per_day_area = people_pollution_per_day_area.round(decimals=2)

people_pollution_per_day_area.head(5)

# Calculate people number (sum) and pm2.5 (average) on 2021-09-25
#people_pollution_per_day = people_pollution_per_day_area[people_pollution_per_day_area.date == "2021-09-25"].reset_index(drop=True)
## Round to 2 decimal places
#people_pollution_per_day = people_pollution_per_day.round(decimals=2)

#people_pollution_per_day.head(5)

#people_pollution_per_day["latitude"] = people_pollution_per_day["PC4"].apply(lambda x: nomi.query_postal_code(x)[9])
#people_pollution_per_day["longitude"] = people_pollution_per_day["PC4"].apply(lambda x: nomi.query_postal_code(x)[10])

#people_pollution_per_day["PC4"] = people_pollution_per_day["PC4"].astype("str")

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
	result = ""

	return {"date": date, "zipcode": zipcode}



@app.route('/map')
def map():
	#return this.httpClient.get(`${this.url}?date=${airQuality.date}&zipcode=${airQuality.zipcode}&peopleNumber=${airQuality.peopleNumber}&windSpeed=${airQuality.windSpeed}&windDirection=${airQuality.windDirection}&sunRadiation=${airQuality.sunRadiation}&boundaryLayerHeight=${airQuality.boundaryLayerHeight}`)

	date = "2021-09-25"

	# Calculate people number (sum) and pm2.5 (average) on 2021-09-25
	people_pollution_per_day = people_pollution_per_day_area[people_pollution_per_day_area.date == date].reset_index(drop=True)
	# Round to 2 decimal places
	people_pollution_per_day = people_pollution_per_day.round(decimals=2)

	people_pollution_per_day.head(5)

	people_pollution_per_day["latitude"] = people_pollution_per_day["PC4"].apply(lambda x: nomi.query_postal_code(x)[9])
	people_pollution_per_day["longitude"] = people_pollution_per_day["PC4"].apply(lambda x: nomi.query_postal_code(x)[10])

	people_pollution_per_day["PC4"] = people_pollution_per_day["PC4"].astype("str")

	#fig = plt.plot([3,1,4,1,5], 'ks-', mec='w', mew=5, ms=20)
	#mpld3.show()

	time.sleep(8) # Sleep for 3 seconds

	fig = px.scatter_mapbox(people_pollution_per_day, 
                        title="Number of people vs. fine inhalable particulate matter per zip code in Eindhoven on " + date, 
                        lat="latitude", 
                        lon="longitude", 
                        hover_name="PC4", 
                        color="pm2.5", 
                        size="people_number", 
                        color_continuous_scale=px.colors.diverging.balance, 
                        size_max=15, 
                        zoom=10, 
                        height=300)
	fig.update_layout(mapbox_style="carto-positron")
	fig.update_layout(margin={"r":0, "t":30, "l":0, "b":0})
	fig.show()

	#plt.subplots(1, 1, figsize=(8, 2))
	#ecg = X
	#fig=plt.figure()
	#alt = np.arange(len(ecg))/125
	#plt.plot(alt,ecg)
	#mpld3.save_html(fig,"test.html")
	#mpld3.fig_to_html(fig,template_type="simple")

	#mpld3.save_html(fig, "test.html")

	#fig, ax = plt.subplots()
	#lines = ax.plot(range(10), 'o')
	##plugins.connect(fig, LineLabelTooltip(lines[0]))
	#fig_to_html(fig)
	#mpld3.save_html(fig, "templates/test.html")
	return fig_to_html(fig)

	#return {"date": date, "zipcode": zipcode}
	#return render_template("test.html")