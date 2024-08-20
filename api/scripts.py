import numpy as np
import pandas as pd
import sqlite3

# con = sqlite3.connect('database.db')
# cur = con.cursor()


# res = cur.execute('SELECT name FROM sqlite_master')
# print(res.fetchone())

# script to import csv data and add to sqlite3 database
def import_database(filepath):
    df = pd.read_csv('../sites.csv', index_col=False)

    if df.empty:
        print('could not find file or file is empty')
        return

    # remove stumps, empty plots, etc
    df.drop(df[df['Species'] == "Stump, (Stump)"].index, inplace=True)

    # only keep necessary columns
    df.rename(columns = {'Site ID': 'site_id', 'Nearest Building': 'nearest_building', 'Latitude': 'latitude', 'Longitude': 'longitude', 'Species': 'species'}, inplace=True)
    df = df[['site_id' , 'nearest_building', 'latitude', 'longitude', 'species']]
    df.set_index('site_id', inplace=True)


    con = sqlite3.connect('database.db')
    cur = con.cursor()
    cur.execute('CREATE TABLE IF NOT EXISTS sites(site_id UNIQUE, nearest_building, latitude, longitude, species)')

    # insert all rows into db
    df.to_sql('sites', con, if_exists='append')










