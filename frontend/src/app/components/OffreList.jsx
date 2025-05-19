import React, { useEffect, useState } from 'react';
import apiJob from '../services/api/apiJob';
import apiApplication from '../services/api/apiApplication';
import apiCV from '../services/api/apiCV';
import { auth } from '../firebase';

export default function OffreList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [matchScores, setMatchScores] = useState({});


  useEffect(() => {
    const fetchJobsAndScores = async () => {
      try {
        const response = await apiJob.get('/jobs');
        const jobsData = response.data;
        setJobs(jobsData);

        const storedCV = localStorage.getItem("last_uploaded_cv");
        console.log("CV stocké:", storedCV);

        if (!storedCV) {
          console.log("Aucun CV trouvé dans le localStorage");
          return;
        }

        // Extraire l'ID du CV du nom du fichier (première partie avant le premier underscore)
        const cvId = storedCV.split("_")[0];
        console.log("ID du CV extrait:", cvId);

        const scores = {};
        for (const job of jobsData) {
          try {
            console.log(`Récupération du score pour le job ${job.id} avec le CV ${cvId}`);
            const scoreRes = await fetch(`http://localhost:5004/match/${cvId}/${job.id}`);
            const matchData = await scoreRes.json();

            if (scoreRes.ok) {
              console.log(`Score trouvé pour le job ${job.id}:`, matchData.match_score);
              scores[job.id] = matchData.match_score;
            } else {
              console.error(`Erreur de matching pour le job ${job.id}:`, matchData.error);
              scores[job.id] = null;
            }
          } catch (e) {
            console.error(`Erreur lors du matching pour le job ${job.id}:`, e);
            scores[job.id] = null;
          }
        }
        console.log("Scores finaux:", scores);
        setMatchScores(scores);
      } catch (err) {
        console.error('Erreur lors de la récupération des offres:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobsAndScores();
  }, []);


  const handleApply = async (jobId, jobTitle) => {
    const storedCV = localStorage.getItem("last_uploaded_cv");
    const currentUser = auth.currentUser;

    if (!storedCV && !selectedFile) {
      alert("Veuillez d'abord déposer votre CV via l'onglet 'Déposez votre CV'");
      return;
    }

    try {
      const filenameToUse = storedCV;
      if (!filenameToUse) {
        alert("Veuillez d'abord déposer votre CV via l'onglet 'Déposez votre CV'");
        return;
      }

      await apiApplication.post('/applications', {
        job_id: jobId,
        job_title: jobTitle,
        candidate_id: currentUser.uid,
        candidate_name: currentUser.displayName || 'Anonyme',
        cv_url: filenameToUse
      });

      alert('Candidature envoyée avec succès!');
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la candidature');
    }
  };


  if (loading) return <p>Chargement...</p>;

  return (
    <div className="p-6 mt-20">
      <h2 className="text-2xl font-bold mb-4">Offres disponibles</h2>

      {localStorage.getItem("last_uploaded_cv") && (
        <p className="text-green-600 text-sm mb-4">
          CV déjà enregistré : {localStorage.getItem("last_uploaded_cv")}
        </p>
      )}

      <div className="grid gap-4">
        {jobs
          .sort((a, b) => {
            const scoreA = matchScores[a.id] ?? -1; // -1 pour mettre les scores null à la fin
            const scoreB = matchScores[b.id] ?? -1;
            return scoreB - scoreA; // Tri décroissant
          })
          .map(job => (
            <div key={job.id} className="border p-4 rounded shadow">
              <h3 className="text-xl font-bold">{job.title}</h3>
              <p>{job.company} - {job.location}</p>
              <p className="my-2">{job.description}</p>

              {matchScores[job.id] !== undefined && (
                <p className={`font-semibold ${matchScores[job.id] >= 70 ? 'text-green-700' : matchScores[job.id] >= 40 ? 'text-yellow-600' : 'text-red-600'}`}>
                  Score de compatibilité : {matchScores[job.id] ?? 'Non disponible'}%
                </p>
              )}

              <button
                onClick={() => handleApply(job.id, job.title)}
                className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
              >
                Postuler
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}