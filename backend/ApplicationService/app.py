from flask import Flask, request, jsonify
import firebase_admin
from firebase_admin import credentials, firestore
from flask_cors import CORS
import uuid
from datetime import datetime

cred = credentials.Certificate("../../firebase/firebase_admin_key.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

app = Flask(__name__)
CORS(app)

# POST: un candidat postule à une offre
@app.route('/applications', methods=['POST'])
def apply_to_job():
    data = request.get_json()
    application_id = str(uuid.uuid4())

    application = {
        'id': application_id,
        'job_id': data['job_id'],
        'job_title': data['job_title'],
        'candidate_id': data['candidate_id'],
        'candidate_name': data['candidate_name'],
        'cv_url': data['cv_url'],
        'applied_at': datetime.utcnow().isoformat()
    }

    db.collection('applications').document(application_id).set(application)
    return jsonify(application), 201

# GET: récupérer toutes les candidatures pour un candidat
@app.route('/applications/candidate/<candidate_id>', methods=['GET'])
def get_candidate_applications(candidate_id):
    applications = db.collection('applications')\
                    .where('candidate_id', '==', candidate_id)\
                    .stream()
    return jsonify([app.to_dict() for app in applications]), 200

if __name__ == '__main__':
    app.run(port=5005, debug=True)