import { useMemo, useState } from "react";

const formatDate = (date) =>
  date.toLocaleDateString("sv-SE"); // returns YYYY-MM-DD in local time

function Timetable({ tasks }) {
  const today = new Date();

  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const isToday = (date) => {
    const now = new Date();
    return (
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate()
    );
  };

  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const totalDays = lastDay.getDate();

    const daysArray = [];
    const paddingStart = (firstDay.getDay() + 6) % 7;

    for (let i = 0; i < paddingStart; i++) {
      daysArray.push(null);
    }

    for (let day = 1; day <= totalDays; day++) {
      daysArray.push(new Date(currentYear, currentMonth, day));
    }

    while (daysArray.length % 7 !== 0) {
      daysArray.push(null);
    }

    return daysArray;
  }, [currentMonth, currentYear]);

  const getStatusIcon = (dayTasks) => {
    const NO_TASKS_ICON = "-";
    if (!dayTasks || dayTasks.length === 0) return NO_TASKS_ICON;

    const allDone = dayTasks.every(task => task.completed);
    return allDone ? "✨\nCompleted" : "🍂";
  };

  const goToPrevMonth = () => {
    setCurrentMonth(prev => {
      if (prev === 0) {
        setCurrentYear(y => y - 1);
        return 11;
      }
      return prev - 1;
    });
  };

  const goToNextMonth = () => {
    setCurrentMonth(prev => {
      if (prev === 11) {
        setCurrentYear(y => y + 1);
        return 0;
      }
      return prev + 1;
    });
  };

  return (
    <>
      <style>{`
        .calendar-container {
          width: 600px;
          margin: 20px auto;
          font-family: sans-serif;
        }
        .calendar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        .calendar-header button {
          font-size: 1.5rem;
          padding: 4px 12px;
          cursor: pointer;
        }
        .calendar-weekdays {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          text-align: center;
          font-weight: bold;
          margin-bottom: 5px;
        }
        .calendar-weekday {
          padding: 8px 0;
          background: #2ebeeeff;
          border: 1px solid #ccc;
        }
        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 2px;
        }
        .calendar-cell {
          height: 80px;
          border: 1px solid #ddd;
          padding: 4px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background: #fff;
        }
        .calendar-today {
          background: #cce5ff;
          border: 2px solid #339af0;
        }
        .calendar-date {
          color: #555;
          font-size: 0.9rem;
        }
        .calendar-icon {
          font-size: 0.9rem;
          text-align: center;
          color: #333;
        }
      `}</style>

      <div className="calendar-container">
        <div className="calendar-header">
          <button onClick={goToPrevMonth}>←</button>
          <h2>
            {new Date(currentYear, currentMonth).toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </h2>
          <button onClick={goToNextMonth}>→</button>
        </div>

        <div className="calendar-weekdays">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => (
            <div key={day} className="calendar-weekday">{day}</div>
          ))}
        </div>

        <div className="calendar-grid">
          {calendarDays.map((date, i) => {
            const formatted = date ? formatDate(date) : null;
            const icon = date ? getStatusIcon(tasks[formatted]) : "";

            return (
              <div
                key={i}
                className={`calendar-cell ${
                  date && isToday(date) ? "calendar-today" : ""
                }`}
              >
                <div className="calendar-date">{date ? date.getDate() : ""}</div>
                <div className="calendar-icon">{icon}</div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
export default Timetable;
