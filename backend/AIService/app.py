from flask import Flask, request, jsonify
import os, uuid, requests
from dotenv import load_dotenv
import google.generativeai as genai
import PyPDF2
import firebase_admin
from firebase_admin import credentials, firestore
from flask_cors import CORS

# --- Chargement variables d’environnement ---
load_dotenv()

# --- Config Flask ---
app = Flask(__name__)
CORS(app)
UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# --- Initialisation Firebase ---
cred = credentials.Certificate("../../firebase/firebase_admin_key.json")
firebase_admin.initialize_app(cred)
db = firestore.client()
print("Firebase initialisé")

# --- Config Gemini ---
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-pro")

# --- Téléchargement du CV via CVService ---
def download_cv_from_cvservice(filename):
    url = f"http://localhost:5001/cv/download/{filename}"
    local_path = os.path.join(UPLOAD_FOLDER, filename)
    try:
        response = requests.get(url)
        if response.status_code == 200:
            with open(local_path, "wb") as f:
                f.write(response.content)
            return local_path
        print("Erreur HTTP:", response.status_code)
        return None
    except Exception as e:
        print("Erreur téléchargement:", e)
        return None

# --- Extraction texte PDF ---
def extract_text_from_pdf(filepath):
    try:
        with open(filepath, 'rb') as f:
            reader = PyPDF2.PdfReader(f)
            return ''.join(page.extract_text() or '' for page in reader.pages).strip()
    except Exception as e:
        print("Erreur PDF:", e)
        return ""

# --- Appel Gemini ---
def analyze_with_ai(cv_text):
    prompt = f"""
Analyse le CV suivant et retourne uniquement ces 3 éléments de manière structurée :
1. Compétences (liste à puces ou séparées par des virgules)
2. Niveau d'expérience (en une phrase)
3. Résumé du profil (3-5 phrases max)

Voici le CV :
{cv_text}
"""
    try:
        response = model.generate_content(prompt)
        return {'analysis': getattr(response, 'text', 'Aucune réponse')}
    except Exception as e:
        return {'error': str(e)}

# --- Parsing du texte Gemini ---
def parse_analysis(raw_text):
    skills, experience, summary = [], "", []
    lines = raw_text.split("\n")

    for i, line in enumerate(lines):
        lower_line = line.lower().strip()

        # 1. Compétences
        if ("compétence" in lower_line or "skills" in lower_line) and not skills:
            # Ligne sous forme : "Compétences : python, SQL, ... "
            if ":" in line:
                after_colon = line.split(":", 1)[1]
                skills = [s.strip(" -•") for s in after_colon.split(",") if s.strip()]
            # Sinon, lignes suivantes
            for j in range(i + 1, len(lines)):
                l = lines[j].strip()
                if l.startswith(("-", "•")):
                    skills.append(l.strip(" -•"))
                elif not l:
                    break

        # 2. Expérience
        elif ("expérience" in lower_line or "experience" in lower_line) and not experience:
            experience = line.strip()

        # 3. Résumé
        elif len(summary) < 5:
            if line.strip() and not any(word in lower_line for word in ["compétence", "expérience"]):
                summary.append(line.strip())

    # Si on n'a pas assez de lignes pour le résumé, on le complète
    if len(summary) < 3:
        summary.append("Résumé trop court pour être extrait")

    return {
        "skills": skills[:10] if skills else ["Aucune détectée"],
        "experience": experience or "Non précisé",
        "summary": " ".join(summary[:5])  # Résumé de 3 à 5 phrases
    }

# --- Route principale ---
@app.route('/analyze-from-cvservice', methods=['POST'])
def analyze_from_cvservice():
    data = request.json
    filename = data.get("filename")
    if not filename:
        return jsonify({'error': 'No filename provided'}), 400

    local_path = download_cv_from_cvservice(filename)
    if not local_path:
        return jsonify({'error': 'Download failed'}), 500

    cv_text = extract_text_from_pdf(local_path)
    if not cv_text:
        return jsonify({'error': 'PDF text extraction failed'}), 400

    result = analyze_with_ai(cv_text)
    raw_text = result.get("analysis", result.get("error"))
    parsed = parse_analysis(raw_text)

    cv_id = filename.split("_")[0]
    db.collection("cv_analysis").document(cv_id).set(parsed)

    return jsonify({
        'filename': filename,
        'cv_id': cv_id,
        'parsed_analysis': parsed
    })


# --- Lancement ---
if __name__ == '__main__':
    app.run(port=5003, debug=True)
