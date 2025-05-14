import React, { useEffect, useState } from 'react';
import apiJob from '../services/api/apiJob';
import apiApplication from '../services/api/apiApplication';
import apiCV from '../services/api/apiCV';

export default function CandidateJobList() {
  const [jobs, setJobs] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await apiJob.get('/jobs');
        setJobs(response.data);
      } catch (err) {
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleApply = async (jobId, jobTitle) => {
    if (!selectedFile) return alert('Veuillez sélectionner un CV');

    try {
      // 1. Uploader le CV
      const uploadResponse = await apiCV.uploadCV(selectedFile);

      // 2. Créer la candidature
      const currentUser = auth.currentUser;
      await apiApplication.post('/applications', {
        job_id: jobId,
        job_title: jobTitle,
        candidate_id: currentUser.uid,
        candidate_name: currentUser.displayName || 'Anonyme',
        cv_url: uploadResponse.filename
      });

      alert('Candidature envoyée avec succès!');
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la candidature');
    }
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Offres disponibles</h2>

      <div className="mb-4">
        <input
          type="file"
          onChange={(e) => setSelectedFile(e.target.files[0])}
          className="mb-2"
        />
      </div>

      <div className="grid gap-4">
        {jobs.map(job => (
          <div key={job.id} className="border p-4 rounded shadow">
            <h3 className="text-xl font-bold">{job.title}</h3>
            <p>{job.company} - {job.location}</p>
            <p className="my-2">{job.description}</p>

            <button
              onClick={() => handleApply(job.id, job.title)}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Postuler
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}