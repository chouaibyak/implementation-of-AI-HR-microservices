from flask import Flask, request, jsonify
import firebase_admin
from firebase_admin import credentials, firestore
import uuid
from flask_cors import CORS


# Initialiser Firebase
cred = credentials.Certificate("../../firebase/firebase_admin_key.json")

firebase_admin.initialize_app(cred)
db = firestore.client()

app = Flask(__name__)
CORS(app)

#  Créer une offre
@app.route('/jobs', methods=['POST'])
def create_job():
    data = request.get_json()
    job_id = str(uuid.uuid4())
    job_ref = db.collection('jobs').document(job_id)
    job_data = {
        'id': job_id,
        'title': data.get('title'),
        'description': data.get('description'),
        'company': data.get('company'),
        'location': data.get('location'),
        'skills': data.get('skills', [])
    }
    job_ref.set(job_data)
    return jsonify(job_data), 201

#  Lire toutes les offres
@app.route('/jobs', methods=['GET'])
def get_all_jobs():
    jobs = db.collection('jobs').stream()
    job_list = [doc.to_dict() for doc in jobs]
    return jsonify(job_list), 200

#  Lire une offre par ID
@app.route('/jobs/<job_id>', methods=['GET'])
def get_job(job_id):
    doc = db.collection('jobs').document(job_id).get()
    if not doc.exists:
        return jsonify({'error': 'Job not found'}), 404
    return jsonify(doc.to_dict()), 200

#  Modifier une offre
@app.route('/jobs/<job_id>', methods=['PUT'])
def update_job(job_id):
    doc_ref = db.collection('jobs').document(job_id)
    if not doc_ref.get().exists:
        return jsonify({'error': 'Job not found'}), 404
    data = request.get_json()
    doc_ref.update(data)
    return jsonify({'message': 'Job updated'}), 200

#  Supprimer une offre
@app.route('/jobs/<job_id>', methods=['DELETE'])
def delete_job(job_id):
    doc_ref = db.collection('jobs').document(job_id)
    if not doc_ref.get().exists:
        return jsonify({'error': 'Job not found'}), 404
    doc_ref.delete()
    return jsonify({'message': 'Job deleted'}), 200

# Lancer le microservice
if __name__ == '__main__':
    app.run(port=5002, debug=True)
