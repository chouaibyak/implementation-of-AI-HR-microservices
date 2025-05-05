from flask import Flask, request, jsonify
import firebase_admin
from firebase_admin import credentials, auth, firestore
from functools import wraps
import os

app = Flask(__name__)

# Initialise Firebase
try:
    cred = credentials.Certificate(os.path.abspath("../../firebase/firebase_admin_key.json"))
    firebase_admin.initialize_app(cred)
    db = firestore.client()
except Exception as e:
    print(f"Erreur d'initialisation Firebase : {e}")
    db = None

# Middleware pour vérifier les tokens
def verify_token(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        if not token:
            return jsonify({'error': 'Token manquant'}), 401
        try:
            decoded_token = auth.verify_id_token(token)
            request.user = decoded_token
            return f(*args, **kwargs)
        except Exception as e:
            return jsonify({'error': 'Token invalide ou expiré', 'details': str(e)}), 401
    return wrapper

# Inscription
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    try:
        user = auth.create_user(
            email=data['email'],
            password=data['password'],
            display_name=data.get('name', '')
        )
        user_data = {
            'uid': user.uid,
            'email': user.email,
            'name': user.display_name,
            'role': data.get('role', 'candidat'),
            'createdAt': firestore.SERVER_TIMESTAMP
        }
        db.collection('users').document(user.uid).set(user_data)
        return jsonify({'message': 'Utilisateur créé et enregistré', 'uid': user.uid}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# Vérifier le token manuellement
@app.route('/verify', methods=['POST'])
def verify():
    token = request.json.get('token')
    try:
        decoded_token = auth.verify_id_token(token)
        uid = decoded_token['uid']
        user_doc = db.collection('users').document(uid).get()
        return jsonify({'status': 'valid', 'user': user_doc.to_dict()})
    except Exception as e:
        return jsonify({'status': 'invalid', 'error': str(e)}), 401

# Voir son propre profil
@app.route('/me', methods=['GET'])
@verify_token
def get_user_profile():
    uid = request.user['uid']
    user_doc = db.collection('users').document(uid).get()
    if user_doc.exists:
        return jsonify(user_doc.to_dict())
    else:
        return jsonify({'error': 'Profil non trouvé'}), 404

# Mise à jour du profil
@app.route('/update-profile', methods=['PUT'])
@verify_token
def update_profile():
    uid = request.user['uid']
    data = request.json
    db.collection('users').document(uid).update(data)
    return jsonify({'message': 'Profil mis à jour'})

# Supprimer le compte
@app.route('/delete-account', methods=['DELETE'])
@verify_token
def delete_account():
    uid = request.user['uid']
    try:
        auth.delete_user(uid)
        db.collection('users').document(uid).delete()
        return jsonify({'message': 'Compte supprimé'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# Route de test/protection
@app.route('/protected', methods=['GET'])
@verify_token
def protected_route():
    return jsonify({'message': f"Bienvenue {request.user['email']}"})

# Lancer l'application
if __name__ == '__main__':
    app.run(debug=True)


