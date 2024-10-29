import sqlite3
from flask import Flask, jsonify
from controller import get_buildings, get_sites_by_building

app = Flask(__name__)

@app.route('/api/buildings')
def building_list():
    return {'buildingList': get_buildings()}, 200

@app.route('/api/building/<building_name>')
def building(building_name):
    sites = get_sites_by_building(building_name)
    lat_list = [ site['latitude'] for site in sites ]
    lon_list = [ site['longitude'] for site in sites ]
    center = [sum(lat_list)/len(sites), 
              sum(lon_list)/len(sites)]
    bounds = [[max(lat_list) + 0.0005, min(lon_list) - 0.0005], [min(lat_list) - 0.0005, max(lon_list) + 0.0005]]
    print('bounds', bounds)

    return {'data': sites, 'center': center, 'bounds': bounds}, 200
    

