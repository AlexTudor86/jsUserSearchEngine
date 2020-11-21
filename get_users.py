#!/usr/bin/python

import requests
import urllib
import json
import time

def date_transform(s):
    months = {
            '01': 'January',
            '02': 'February',
            '03': 'March',
            '04': 'April',
            '05': 'May',
            '06': 'June', 
            '07': 'July',
            '08': 'August',
            '09': 'Semptember',
            '10': 'October',
            '11': 'November',
            '12': 'December'
            }
    s = s.split('-')
    year = s[0]
    month = months[s[1]]
    day = s[2]
    return day + ' ' +  month + ' '  + year


url = 'https://randomuser.me/api'
users = []

# generam 200 users 
j = 1


for i in range(200):
    resp = requests.get(url)
    user_obj = {}
    user_raw_obj = json.loads(resp.text)
    # luam doar cheile de interes
    user_obj['Nume'] = user_raw_obj['results'][0]['name']['last']
    user_obj['Prenume'] = user_raw_obj['results'][0]['name']['first']
    user_obj['data_nastere'] = date_transform(user_raw_obj['results'][0]['dob']['date'].split('T')[0])
    user_obj['localitate'] = user_raw_obj['results'][0]['location']['city'] + ', ' + \
                             user_raw_obj['results'][0]['location']['country']    
    error = False
    for key in user_obj:
        try:
            user_obj[key] = str(user_obj[key])
        except UnicodeEncodeError:
            error = True
            break
    if not error:
        user_pic_link = user_raw_obj['results'][0]['picture']['large']
        user_pic_file = './user-pics/' + 'user{:03d}.jpg'.format(j)
        urllib.urlretrieve(user_pic_link, user_pic_file)
        user_obj['src'] = user_pic_file
        users.append(user_obj)
        j += 1
        time.sleep(0.5)


with open('users.json', 'a') as f:
    f.write(json.dumps(users))
    
