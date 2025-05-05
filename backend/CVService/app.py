from flask import Flask, Blueprint, request, jsonify, send_from_directory
import os
import uuid

# Création du blueprint
cv_bp = Blueprint('cv', __name__)
UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')

# S'assurer que le dossier existe
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Route pour uploader un CV
@cv_bp.route('/upload', methods=['POST'])
def upload_cv():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']
    filename = f"{uuid.uuid4()}_{file.filename}"
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    file.save(filepath)

    return jsonify({'message': 'Upload successful', 'filename': filename}), 200

# Route pour récupérer un fichier
@cv_bp.route('/download/<filename>', methods=['GET'])
def download_cv(filename):
    try:
        return send_from_directory(UPLOAD_FOLDER, filename, as_attachment=True)
    except FileNotFoundError:
        return jsonify({'error': 'File not found'}), 404

# Configuration de l'application Flask
app = Flask(__name__)
app.register_blueprint(cv_bp, url_prefix='/cv')

if __name__ == '__main__':
    app.run(debug=True)
