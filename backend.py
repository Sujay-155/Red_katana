from flask import Flask, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

app.config["MONGO_URI"] = "mongodb://localhost:27017/red"
mongo = PyMongo(app)

@app.route('/get_games', methods=['GET'])
def get_games():
    games = list(mongo.db.games.find({}, {"_id": 0}))
    
    print("Sending Data:", games)  # Debugging line to check if images are included
    
    return jsonify(games)

if __name__ == '__main__':
    app.run(debug=True)
