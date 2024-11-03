// utils/calculateHours.js

export const calculateHours = (events, selectedMonth, selectedYear) => {
    const now = new Date();
    let effectue = 0;
    let aVenir = 0;
  
    events.forEach(event => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      const eventHeure = (eventEnd - eventStart) / (1000 * 60 * 60);
  
      const heureTravaille = eventHeure >= 8 ? 8 : eventHeure;
  
      if (eventStart.getMonth() + 1 === selectedMonth && eventStart.getFullYear() === selectedYear) {
        if (eventEnd < now) {
          effectue += heureTravaille;
        } else if (eventStart > now) {
          aVenir += heureTravaille;
        }
      }
    });
  
    return {
      heuresEffectuees: effectue,
      heuresAVenir: aVenir,
      totalHeures: effectue + aVenir
    };
  };
  