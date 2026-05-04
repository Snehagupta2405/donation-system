import React, { useEffect, useState } from "react";
import { authFetch } from "../utils/auth";

export default function Areas() {
  const [areas, setAreas] = useState([]);

  useEffect(() => {
    authFetch("/api/admin/areas")
      .then((res) => res.json())
      .then(setAreas)
      .catch((err) => console.error("Error fetching areas:", err));
  }, []);

  return (
    <div>
      <h2>Donation Areas</h2>
      <ul>
        {areas.map((a, i) => (
          <li key={i}>{a}</li>
        ))}
      </ul>
    </div>
  );
}