import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
import re
from datetime import datetime
import pytz
from tzlocal import get_localzone
import json
import requests
import socket
import time

cred = credentials.Certificate(
    "./chatstop-cit-firebase-adminsdk-uzdgc-c0216daa49.json")
app = firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://chatstop-cit.firebaseio.com/'
})

ref = db.reference('chatrooms')
botsref = db.reference('bots')


urls = {}
bots_last_state = {}


def chat_listener(event):
    print(event.event_type)  # can be 'put' or 'patch'
    print(event.path)  # relative to the reference, it seems

    if("chat" in event.path):
        arr = ["message"]
        if any(re.findall('|'.join(arr), event.path)):
            print("edit")
        else:
            path = event.path.split("/")
            print(path)
            branchid = path[1]
            botid = path[2]
            userid = path[3]
            if(event.data):

                dictRef = event.data

                if(dictRef.get('type') == "newmsg"):
                    posts_ref = ref.child(branchid).child(botid).child(userid).child("chats")

                    botsref.child(path[2]).update({'typing': True})

                    #url_bot = botsref.child(path[1]).child("api-url").get()
                    address = botsref.child(path[2]).child("address").get()
                    url_bot = "http://" + address.get("ip") + ":" + address.get("port") + "/" + address.get("api")

                    data = {
                        "sender": botid + "_" + userid,
                        "message": dictRef.get('message')
                    }
                    
                    try:
                        r = requests.post(str(url_bot), json=data)
                        r.raise_for_status()
                        respJson = r.json()
                        botsref.child(path[2]).update({'typing': False})
                        if len(respJson):
                            for j in respJson:
                                print(j)
                                respText = j.get("text")
                                sendResponse(posts_ref, respText)
                        else:
                            respText = "*No response*"
                            sendResponse(posts_ref, respText)                        
                    except requests.exceptions.HTTPError as err:
                        print(err.response.text)
                        respText = err.response.text
                        sendResponse(posts_ref, respText)
                    


def sendResponse(posts_ref, text):
    new_post_ref = posts_ref.push()
    new_post_ref.set({
        'message': '' + text,
        'sendDate': '' + str(datetime.now()),
        'type': 'botresponse',
        'user': 'bot'

    })


def initLastState(botid):
    if(botid not in bots_last_state):
        bots_last_state[botid] = False


def bots_listener(event):
    """ print(event.path)
    print(event.event_type)
    print(event.data) """
    path = event.path.split("/")
    if(len(path) > 1):
        botid = path[1]

        if not (event.data is None):

            if type(event.data) is dict and "address" in event.data:
                newurl = event.data.get('address')
                urls[botid] = newurl
                initLastState(botid)

            elif type(event.data) is str:
                if "ip" in event.path:
                    urls[botid]['ip'] = event.data
                elif "port" in event.path:
                    urls[botid]['port'] = event.data
                elif "api" in event.path:
                    urls[botid]['api'] = event.data
                initLastState(botid)

        else:
            urls.pop(botid, None)
            bots_last_state.pop(botid, None)


firebase_admin.db.reference('chatrooms').listen(chat_listener)


firebase_admin.db.reference('bots').listen(bots_listener)

print('Getting bots...')
bots = botsref.get()
for bot_k, bot_v in bots.items():

    address = bot_v.get("address")
    urls[bot_k] = address
    bots_last_state[bot_k] = False
    botsref.child(bot_k).update({
        'available': False
    })
    print(bot_k)


print('Listening...')
while True:
    for url in urls:

        ip = urls[url].get("ip")
        port = urls[url].get("port")        

        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

        result = sock.connect_ex((ip, int(port)))
        currentState = False
        if result == 0:
            currentState = True
        if(bots_last_state.get(url) != currentState):
            botsref.child(url).update({
                'available': currentState
            })
            bots_last_state[url] = currentState

        sock.close()
    time.sleep(10)
