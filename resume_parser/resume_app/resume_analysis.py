import numpy as np
from pyresparser import ResumeParser
import pandas as pd
from keras.models import Sequential
from keras.layers import Dense, LSTM, Dropout
from sklearn.preprocessing import LabelEncoder
from keras.preprocessing.sequence import pad_sequences

def analyze_resume(resume_path):
    # Parse the resume and extract information
    data = ResumeParser(resume_path).get_extracted_data()

    resume_skills = data.get("skills")
    #df = pd.read_csv('Role_csv.csv')

    # Load dataset
    df = pd.read_csv('Role_csv.csv')

    # Convert CSV file skills to lowercase
    df['Skills'] = df['Skills'].apply(lambda x: [skill.lower() for skill in x])

    # Fit and transform the skill_encoder
    skill_encoder = LabelEncoder()
    df['skill_seq'] = df['Skills'].apply(lambda x: skill_encoder.fit_transform(x).tolist())

    # Encode job roles as numerical values
    job_encoder = LabelEncoder()
    df['Role'] = job_encoder.fit_transform(df['Role'])

    # Pad sequences to have a variable length
    X = pad_sequences(df['skill_seq'], maxlen=None, padding='post')

    # Split dataset into input and output
    Y = df['Role'].values

    model = Sequential()
    model.add(LSTM(128, input_shape=(None, 1), return_sequences=True))
    model.add(LSTM(64, return_sequences=True))
    model.add(LSTM(32))
    model.add(Dense(32, activation='relu'))
    model.add(Dense(130, activation='softmax'))

    # Compile model
    model.compile(loss='sparse_categorical_crossentropy', optimizer='adam', metrics=['accuracy'])

    # Train model
    model.fit(X[..., np.newaxis], Y, epochs=50, batch_size=64)

    skill_enc = LabelEncoder()
    skill_seq = skill_enc.fit_transform(resume_skills)

    # Convert CSV file skills to lowercase
    df['Skills'] = df['Skills'].apply(lambda x: [skill.lower() for skill in x])

    # Convert resume skills to lowercase
    resume_skills = [skill.lower() for skill in resume_skills]

    # Encode resume skills, handling unseen labels
    skill_seq = []
    for skill in resume_skills:
        if skill in skill_encoder.classes_:
            encoded_skill = skill_encoder.transform([skill])[0]
            skill_seq.append(encoded_skill)
        else:
            skill_seq.append(-1)  # Assign a special value for unseen skills

    # Pad sequence to have variable length
    X_new = pad_sequences([skill_seq], maxlen=None, padding='post')

    # Make prediction
    job_role_probabilities = model.predict(X_new[..., np.newaxis])
    job_role_encoded = np.argmax(job_role_probabilities, axis=1)
    job_role = job_encoder.inverse_transform(job_role_encoded)[0]

    return job_role
