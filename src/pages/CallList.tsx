import React, { useEffect } from "react";
import { useGetCallsMutation } from "../redux/slice/api.slice";
import incomingIcon from "../assets/incomingIcon.svg";
import outgoingIcon from "../assets/outgoingIcon.svg";
import AudioPlayer from "../components/AudioPlayer/AudioPlayer";
import "./CallList.css"; 

const CallList = () => {
  const [getCalls, { data, isLoading, error }] = useGetCallsMutation();

  useEffect(() => {
    getCalls({
      date_start: "2024-05-01",
      date_end: "2024-05-27",
      limit: 50,
    });
  }, [getCalls]);

  const getRandomRating = () => {
    const ratings = ["Плохо", "Хорошо", "Отлично"];
    return ratings[Math.floor(Math.random() * ratings.length)];
  };

  if (isLoading) return <p className="loading">Загрузка...</p>;
  if (error) return <p className="error">Ошибка загрузки</p>;

  return (
    <div className="call-list">
      <table className="call-table">
        <thead>
          <tr >
            <th className="table-title">Тип</th>
            <th className="table-title">Время</th>
            <th className="table-title">Сотрудник</th>
            <th className="table-title">Звонок</th>
            <th className="table-title">Источник</th>
            <th className="table-title">Оценка</th>
            <th className="table-title">Длительность</th>
          </tr>
        </thead>
        <tbody>
          {data?.results.map((call: any) => (
            <tr key={call.id}>
              <td className="call-item">
                <img
                  src={call.in_out === 1 ? incomingIcon : outgoingIcon}
                  alt={call.in_out === 1 ? "Входящий" : "Исходящий"}
                  className="icon"
                />
              </td>
              <td className="call-item call-time">
                {new Date(call.date).toLocaleTimeString("ru-RU", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}
              </td>
              <td className="call-item">
                {call.person_avatar ? (
                  <img
                    src={call.person_avatar}
                    alt="Аватар"
                    className="avatar"
                  />
                ) : (
                  <div className="avatar placeholder" />
                )}
              </td>
              <td className="call-item">{call.in_out === 1 ? call.from_number : call.to_number}</td>
              <td className="call-item">{call.line_name || ""}</td>
              <td className="call-item">
                {call.status === "Не дозвонился" ? "" : getRandomRating()}
              </td>
              <td className="call-item">
                {call.record && call.partnership_id ? (
                  <AudioPlayer
                    recordId={call.record}
                    partnershipId={call.partnership_id}
                    duration={`${String(Math.floor(call.time / 60)).padStart(
                      2,
                      "0"
                    )}:${String(call.time % 60).padStart(2, "0")}`}
                  />
                ) : (
                  <span className="duration">
                    {`${String(Math.floor(call.time / 60)).padStart(
                      2,
                      "0"
                    )}:${String(call.time % 60).padStart(2, "0")}`}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CallList;
