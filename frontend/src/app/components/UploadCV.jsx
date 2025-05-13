import React, { useRef, useState, useEffect } from 'react';
import apiCV from '../services/api/apiCV';

export default function UploadCV() {
  const fileInputRef = useRef(null);
  const [uploadMessage, setUploadMessage] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Appel d'analyse une fois le fichier téléchargé
  useEffect(() => {
    if (uploadedFileName) {
      setIsAnalyzing(true);
      apiCV.analyzeCV(uploadedFileName)
        .then((aiResult) => {
          setAnalysis(aiResult.parsed_analysis);
        })
        .catch((err) => {
          console.error("Erreur analyse IA :", err);
          setAnalysis({ error: "Erreur lors de l’analyse automatique du CV." });
        })
        .finally(() => {
          setIsAnalyzing(false);
        });
    }
  }, [uploadedFileName]); // Déclenche l'analyse quand le nom du fichier est mis à jour

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadMessage('');
    setIsUploading(true);

    try {
      const response = await apiCV.uploadCV(file);
      setUploadedFileName(response.filename); // Met à jour le nom du fichier après l'upload
      setUploadMessage('CV téléchargé avec succès !');
    } catch (error) {
      console.error('Erreur lors de l’upload:', error);
      setUploadMessage("Échec de l'envoi du CV");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = () => {
    if (uploadedFileName) {
      apiCV.downloadCV(uploadedFileName);
    }
  };

  return (
    <div className="p-10 max-w-xl mx-auto bg-white shadow-lg rounded-lg mt-24">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">📄 Upload ton CV</h2>

      <input
        type="file"
        accept=".pdf,.doc,.docx"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      <button
        onClick={handleButtonClick}
        className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
        disabled={isUploading}
      >
        {isUploading ? 'Envoi...' : 'Choisir et envoyer mon CV'}
      </button>

      {uploadedFileName && (
        <button
          onClick={handleDownload}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mt-4 ml-2"
        >
          Télécharger mon CV
        </button>
      )}

      {uploadMessage && (
        <p className="mt-4 text-sm text-gray-700">{uploadMessage}</p>
      )}
    </div>
  );
}
