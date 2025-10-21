import React, { useEffect, useState, useRef } from 'react';
import '../styles/profileteam.css';
import TeamPageCard from "./teampage-card";

function ProfileTeam() {
  const [isVisible, setIsVisible] = useState(false);
  const teamRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );

    if (teamRef.current) observer.observe(teamRef.current);
    return () => teamRef.current && observer.unobserve(teamRef.current);
  }, []);

  const anggota = [
    { foto: '/item/team2.png', nama: 'Nasrul Adadi', peran: 'Ketua', tugas: 'Project Leader' },
    { foto: '/item/team3.png', nama: 'Desi Fauza Nurjanah', peran: 'Anggota', tugas: 'Content Developer' },
    { foto: '/item/team1.png', nama: 'Defrizal Yahdiyan Risyad', peran: 'Anggota', tugas: 'AI & Virtual Robot Engineer' },
    { foto: '/item/team4.png', nama: 'Muhammad Ridho Fajri', peran: 'Anggota', tugas: 'Visual Designer' },
    { foto: '/item/team5.png', nama: 'Muhammad Fathin Mughits', peran: 'Anggota', tugas: 'Web Developer' },
  ];

  return (
    <div className="teampage" ref={teamRef} id='team'>
      <h2 className={`profil ${isVisible ? 'visible' : ''}`}>Profil Team</h2>
      <div className="teampage-konten">
        {anggota.map((item, index) => (
          <div key={index} className={`team-card ${isVisible ? 'visible' : ''}`}>
            <TeamPageCard {...item} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProfileTeam;
