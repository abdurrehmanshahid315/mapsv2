# -*- coding: utf-8 -*-
"""
Created on Sun Aug 12 01:02:05 2018
@author: Abdur
"""

import pandas as pd
import pymongo
import json
import numpy as np

#read csv raw data
dfNspl=pd.read_csv("NSPL_FEB_2018_UK.csv")
dfImd=pd.read_csv("imd.csv")
#data reduction
dfNspl=dfNspl.loc[dfNspl['doterm'].isnull()] #livepostcodes only
dfNspl=dfNspl.loc[dfNspl['ctry']=='E92000001']#filtering out all other countries in UK except England
columns_Imd=[
        "lsoa11",
        "EmploymentScore",
        "EducationSkillsandTrainingScore",
        "HealthDeprivationandDisabilityScore",
        "CrimeScore"]

columns_Nspl=["lsoa11","lat","long"]
dfNspl=dfNspl[columns_Nspl]
dfImd=dfImd[columns_Imd]




# merge the reduced datasets
df_merge=pd.merge(dfImd, dfNspl, on='lsoa11', how='outer')#left outer join, to ignore any areas that are not included in IMD dataset

#reduce decimal places and group by lat,long pair (as a composite key) because the 2 columns make one location entity
pd.options.display.float_format = '{:.4f}'.format

rounded=df_merge.round(4)

grouped_rounded = rounded.groupby(['lat','long']).mean()

grouped_rounded = grouped_rounded.reset_index()

final_columns=["lat","long",
               "EmploymentScore",
               "EducationSkillsandTrainingScore",
               "HealthDeprivationandDisabilityScore",
               "CrimeScore"]

#rename columns 
final_new_columns=grouped_rounded.columns = ["lat","long",
               "EmploymentScore",
               "EducationScore",
               "HealthScore",
               "CrimeScore"]
grouped_rounded.rename(columns = {'EducationSkillsandTrainingScore':'EducationScore'
                                  ,'HealthDeprivationandDisabilityScore':'HealthScore'}, inplace = True)


#insert in mongodb
mng_client = pymongo.MongoClient('localhost', 27017);
mng_db = mng_client['myNewdb2'] ;
collection_name = 'shortAndSelected4'

data_json = json.loads(grouped_rounded.to_json(orient='records'))
db_cm = mng_db[collection_name]
db_cm.remove()
db_cm.insert(data_json)
print("done")
#imd District 

dfImdDistrict=pd.read_csv("imd.csv")

#group 
grouped = dfImdDistrict.groupby(['LocalAuthorityDistrictname'],as_index=False).mean()

grouped = grouped.reset_index()
# write to mongo
data_json = json.loads(grouped.to_json(orient='records'))
mng_client = pymongo.MongoClient('localhost', 27017);
mng_db = mng_client['myNewdb2'] ;
collection_name = 'imd2'
db_cm = mng_db[collection_name]
db_cm.remove()
db_cm.insert(data_json)