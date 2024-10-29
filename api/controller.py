from db import get_db
import numpy as np

def get_buildings():
    db = get_db()
    cur = db.cursor()
    res = cur.execute('SELECT DISTINCT nearest_building FROM sites')

    output = np.array(res.fetchall()).flatten()
    db.close()
    return list(output)

def get_sites_by_building(building_name):
    db = get_db()
    cur = db.cursor()
    res = cur.execute(f"SELECT * FROM sites WHERE nearest_building='{building_name}'")

    output = res.fetchall()
    dict_list = []
    for row in output:
        keys = ['site_id' , 'nearest_building', 'latitude', 'longitude', 'species']
        row_dict = dict(zip(keys, row))
        dict_list.append(row_dict)
        
    db.close()
    return dict_list
