from flask import Flask, request, jsonify
# import yourbot 

app = Flask(__name__)

@app.route('/chatstop/bot_request/', methods=['POST'])
def bot_response():
    data = request.json
    return jsonify([{"text": str(data.get("message"))}])
    #return yourbot.getAnswers(user_input) # replace with your bot function. Response example: [{"text": "resp1"}]

if __name__ == '__main__':
    app.run()