from flask import Flask, request, jsonify
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
import joblib
from pymongo import MongoClient
from flask_cors import CORS
from sklearn.preprocessing import LabelEncoder

app = Flask(__name__)
CORS(app, origins="http://localhost:3001")

# MongoDB connection setup
client = MongoClient("mongodb+srv://castrolbanda:yDqH2xHwVytis3wn@cluster0.xljgd.mongodb.net/")
db = client['school_management']
marks_collection = db['marks']
students_collection = db['students']
subjects_collection = db['subjects']
classes_collection = db['class']

# Fetch subject data from MongoDB
def load_subject_names():
    subject_data = subjects_collection.find()
    return {str(subject['_id']): subject['name'] for subject in subject_data}

# Fetch student data from MongoDB
def load_students():
    student_data = students_collection.find()
    return {str(student['_id']): student['firstName'] for student in student_data}

# Fetch class data from MongoDB
def load_classes():
    class_data = classes_collection.find()
    return {str(class_info['_id']): class_info['className'] for class_info in class_data}

# Fetch marks data from MongoDB
def load_marks_data():
    data = marks_collection.find()
    return pd.DataFrame(list(data))

# Data preparation
def prepare_data(df, students, subjects, classes):
    df = df.dropna()
    df['student'] = df['student'].apply(str)
    df['subject'] = df['subject'].apply(str)
    df['class'] = df['class'].apply(str)
    
    # Keep original subject ID for reference
    df['original_subject_id'] = df['subject']
    
    df['student_name'] = df['student'].map(students)
    df['subject_name'] = df['subject'].map(subjects)
    df['class_name'] = df['class'].map(classes)

    le_student = LabelEncoder()
    le_subject = LabelEncoder()
    le_class = LabelEncoder()
    
    # Apply LabelEncoder to only the 'student', 'subject', and 'class' columns
    df['student'] = le_student.fit_transform(df['student'])
    df['subject'] = le_subject.fit_transform(df['subject'])
    df['class'] = le_class.fit_transform(df['class'])
    df['examType'] = df['examType'].astype('category').cat.codes
    df['term'] = df['term'].astype('category').cat.codes
    
    df['previous_exam_performance'] = df.groupby(['student', 'subject'])['marks'].shift(1).fillna(0)
    df['performance_trend'] = df.groupby(['student', 'subject'])['marks'].diff().fillna(0)

    X = df[['student', 'subject', 'class', 'examType', 'term', 'year', 'previous_exam_performance', 'performance_trend']]
    y = df['marks']
    
    return train_test_split(X, y, test_size=0.2, random_state=42)

# Train and save model
def train_model(X_train, y_train):
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    joblib.dump(model, "student_performance_model.pkl")
    return model

# Load or train model
try:
    model = joblib.load("student_performance_model.pkl")
except FileNotFoundError:
    df = load_marks_data()
    students = load_students()
    subjects = load_subject_names()
    classes = load_classes()
    X_train, X_test, y_train, y_test = prepare_data(df, students, subjects, classes)
    model = train_model(X_train, y_train)

# Prediction endpoint
@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        df = pd.DataFrame(data)

        students = load_students()
        subjects = load_subject_names()  # Mapping subject IDs to names
        classes = load_classes()
        
        # Ensure the 'subject' column is uniform (string format)
        df['subject'] = df['subject'].apply(str)

        # Decode the subject labels
        le_subject = LabelEncoder()
        df['subject'] = le_subject.fit_transform(df['subject'])

        # Keep the original subject ID for name lookup
        df['subject_name'] = df['subject'].map(subjects)

        df['student'] = df['student'].apply(str)
        df['class'] = df['class'].apply(str)

        le_student = LabelEncoder()
        le_class = LabelEncoder()
        
        df['student'] = le_student.fit_transform(df['student'])
        df['class'] = le_class.fit_transform(df['class'])
        df['examType'] = df['examType'].astype('category').cat.codes
        df['term'] = df['term'].astype('category').cat.codes
        df['previous_exam_performance'] = df.groupby(['student', 'subject'])['marks'].shift(1).fillna(0)
        df['performance_trend'] = df.groupby(['student', 'subject'])['marks'].diff().fillna(0)
        
        X = df[['student', 'subject', 'class', 'examType', 'term', 'year', 'previous_exam_performance', 'performance_trend']]
        predictions = model.predict(X)

        student_progress = []
        for student_id, student_data in df.groupby('student'):
            progress = student_data.sort_values('year')[['marks', 'year', 'subject']]
            student_progress.append({
                'student': students.get(str(student_id), 'Unknown'),
                'marks': progress['marks'].tolist(),
                'exam_dates': progress['year'].tolist(),
                'subjects': [subjects.get(str(subj_id), "Unknown") for subj_id in progress['subject'].tolist()]
            })
        
        # Subject-wise performance (average marks by subject)
        subject_analytics = []
        for subject_id, subject_data in df.groupby('subject'):
            avg_marks = subject_data['marks'].mean()
            subject_analytics.append({
                'subject_name': subjects.get(str(subject_id), 'Unknown'),
                'avg_marks': avg_marks
            })

        return jsonify({
            'predictions': predictions.tolist(),
            'student_progress': student_progress,
            'subject_analytics': subject_analytics  # Include subject analytics data
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
