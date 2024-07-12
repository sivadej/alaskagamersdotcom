'use client';

export default function Timeslot(timeslot: { startTimeRaw: number; scheduledPlayers: { name: string; game: string; poolId: string; station: string; url: string; }[]; }) {
  const date = new Date(timeslot.startTimeRaw * 1000);
  const dayOfWeek = convertDateToDayOfWeek(date);
  return <div style={{ marginBottom: '2em' }}>
    <h3>{dayOfWeek} {date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}</h3>
    <div>
      {timeslot.scheduledPlayers.map((sch) => {
        return (
          <div key={`${sch.poolId}|${sch.name}`} className="bg-gray-900" style={{ padding: '8px', display: 'flex', border: '1px solid rgba(255,255,255,0.2) ', alignItems: 'center' }}>
            <div style={{ fontSize: '1.2em' }} className="text-blue-400 flex-none md:w-56 w-32 mr-2">{sch.name}</div>
            <div style={{ flex: '1' }}>
              <span className="text-xs md:text-base mr-2">{sch.game}</span>
            </div>
            <div style={{ flex: '0 0 50px' }}><small style={{ color: 'rgba(255,255,255,0.5)' }}>Station</small><br />{sch.station}</div>
            <div style={{ flex: '0 0 60px', textAlign: 'right' }}><a href={sch.url}><small style={{ color: 'rgba(255,255,255,0.5)' }}>Bracket</small><br /><span className="text-blue-400">{sch.poolId}</span></a></div>
          </div>
        );
      })}
    </div>
  </div>
}


function convertDateToDayOfWeek(dateIn: Date) {
  const dayOfWeek = dateIn.getDay();
  switch (dayOfWeek) {
    case 0:
      return "Sunday";
    case 1:
      return "Monday";
    case 2:
      return "Tuesday";
    case 3:
      return "Wednesday";
    case 4:
      return "Thursday";
    case 5:
      return "Friday";
    case 6:
      return "Saturday";
    default:
      return "Unknown";
  }
}
