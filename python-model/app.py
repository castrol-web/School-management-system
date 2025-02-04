from flask import Flask, request, jsonify
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error
from flask_cors import CORS  # Importing CORS

app = Flask(__name__)

# Enable CORS for all domains or specify a specific domain (localhost:3001 for React frontend)
CORS(app, origins="http://localhost:3001")  # Change this to your frontend's URL

# Load data
def load_marks_data():
    data = [
        {'student_id': 1, 'subject_id': 101, 'class_id': 10, 'exam_type': 'Midterm', 'marks': 85, 'term': 'Spring', 'year': 2023},
        {'student_id': 2, 'subject_id': 101, 'class_id': 10, 'exam_type': 'Midterm', 'marks': 78, 'term': 'Spring', 'year': 2023},
        {'student_id': 1, 'subject_id': 101, 'class_id': 10, 'exam_type': 'Final', 'marks': 90, 'term': 'Spring', 'year': 2023},
        {'student_id': 2, 'subject_id': 101, 'class_id': 10, 'exam_type': 'Final', 'marks': 82, 'term': 'Spring', 'year': 2023},
        # Add more rows for testing
    ]
    return pd.DataFrame(data)

# Data preparation
def prepare_data(df):
    df['exam_type'] = df['exam_type'].astype('category').cat.codes
    df['term'] = df['term'].astype('category').cat.codes

    X = df[['student_id', 'subject_id', 'class_id', 'exam_type', 'term', 'year']]
    y = df['marks']

    return train_test_split(X, y, test_size=0.2, random_state=42)

# Train model
def train_model(X_train, y_train):
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    return model

# Predict and evaluate
@app.route('/predict', methods=['POST'])
def predict():
    data = request.json  # Receive data from the client (Node.js app)

    # Convert input data into a DataFrame
    df = pd.DataFrame(data)

    # Prepare the data
    X_train, X_test, y_train, y_test = prepare_data(df)

    # Train the model
    model = train_model(X_train, y_train)

    # Predict and evaluate
    predictions = model.predict(X_test)
    mse = mean_squared_error(y_test, predictions)

    return jsonify({
        'predictions': predictions.tolist(),
        'mse': mse
    })

if __name__ == '__main__':
    app.run(debug=True)
