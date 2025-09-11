from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allows cross-origin requests from frontend

# Temporary in-memory storage
feedbacks = []

@app.route('/')
def home():
    return "Feedback Logger API is running!"

@app.route('/submit-feedback', methods=['POST'])
def submit_feedback():
    data = request.json
    print("Received:", data)

    # Add to in-memory list
    feedbacks.append(data)
    return jsonify({"message": "Feedback received!"}), 200

@app.route('/get-feedback', methods=['GET'])
def get_feedback():
    return jsonify(feedbacks), 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)