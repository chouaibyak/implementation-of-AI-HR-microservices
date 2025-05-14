import React, { useState, useEffect } from 'react';
import apiCV from '../services/api/apiCV';
import { FileText } from 'lucide-react';

export default function UploadCV() {
  const [uploadStatus, setUploadStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  //  Charger l'analyse enregistrée depuis localStorage au chargement de la page
  useEffect(() => {
    const savedAnalysis = localStorage.getItem("cv_analysis");
    if (savedAnalysis) {
      setAnalysis(JSON.parse(savedAnalysis));
      setUploadStatus(" Feedback chargé depuis l'enregistrement.");
    }
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      setUploadStatus(" Aucun fichier sélectionné.");
      return;
    }

    setIsLoading(true);
    setUploadStatus("Envoi du CV en cours...");
    setAnalysis(null); // Reset feedback display

    try {
      const uploadResponse = await apiCV.uploadCV(file);
      setUploadStatus(" CV bien uploadé. Analyse en cours...");

      const analyzeResponse = await apiCV.analyzeCV(uploadResponse.filename);
      console.log(analyzeResponse);

      setUploadStatus("Analyse terminée !");
      setAnalysis(analyzeResponse.parsed_analysis);

      // sauvegarde locale de l’analyse
      localStorage.setItem("cv_analysis", JSON.stringify(analyzeResponse.parsed_analysis));
    } catch (error) {
      console.error("Erreur : ", error);
      setUploadStatus("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-20 mx-5">
      <h1 className="text-5xl font-extrabold text-center text-gray-900">Déposez votre CV</h1>
      <p className="text-center mt-6 text-gray-600">Pour analyser et découvrir les offres disponibles spécialement adaptées à votre profil !</p>

      <div className="border-4 border-dashed border-gray-300 mt-12 p-10 w-full max-w-3xl mx-auto rounded-lg shadow-lg transition-all hover:shadow-xl hover:border-gray-500">
        <div className="flex flex-col items-center justify-center">
          <FileText className="text-6xl text-gray-500 mb-4" />
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            className="hidden"
            id="cv-upload"
          />
          <label htmlFor="cv-upload" className="text-lg text-gray-700 font-semibold cursor-pointer text-center">
            <span className="text-blue-700">Choisissez un fichier</span> ou déposez un fichier ici (.pdf)
          </label>
        </div>
      </div>

      {/* Statut */}
      {uploadStatus && (
        <div className="mt-6 text-center text-xl font-medium text-gray-800">
          {isLoading ? "Chargement en cours..." : uploadStatus}
        </div>
      )}

      {/* Feedback analysé */}
      {analysis && (
        <div className="mt-10 flex justify-center">
          <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-3xl text-gray-800 border border-gray-200">
            <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">Feedback de votre CV</h2>

            <div className="mb-4">
              <h3 className="text-xl font-semibold text-gray-700">Compétences :</h3>
              <ul className="list-disc list-inside ml-4 mt-2">
                {analysis.skills.map((skill, index) => (
                  <li key={index} className="text-gray-600">{skill}</li>
                ))}
              </ul>
            </div>

            <div className="mb-4">
              <h3 className="text-xl font-semibold text-gray-700">Expérience :</h3>
              <p className="mt-2 text-gray-600">{analysis.experience}</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-700"> Résumé du profil :</h3>
              <p className="mt-2 text-gray-600">{analysis.summary}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
