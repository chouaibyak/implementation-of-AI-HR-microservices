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
        if (!storedCV) return;

        const scores = {};
        for (const job of jobsData) {
          try {
            const scoreRes = await fetch(`http://localhost:5004/match/${storedCV}/${job.id}`);
            const matchData = await scoreRes.json();
            if (scoreRes.ok) {
              scores[job.id] = matchData.match_score;
            } else {
              scores[job.id] = null;  // Pas de score ou erreur
            }
          } catch (e) {
            console.error("Erreur lors du matching:", e);
          }
        }
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
      alert("Veuillez d'abord déposer votre CV via l’onglet 'Déposez votre CV'");
      return;
    }

    try {
      const filenameToUse = storedCV;
      if (!filenameToUse) {
        alert("Veuillez d'abord déposer votre CV via l’onglet 'Déposez votre CV'");
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
        {jobs.map(job => (
          <div key={job.id} className="border p-4 rounded shadow">
            <h3 className="text-xl font-bold">{job.title}</h3>
            <p>{job.company} - {job.location}</p>
            <p className="my-2">{job.description}</p>

            {matchScores[job.id] !== undefined && (
              <p className="text-green-700 font-semibold">
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