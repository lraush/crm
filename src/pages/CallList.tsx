import React, { useEffect, useState } from "react";
import { useGetCallsMutation } from "../redux/slice/api.slice";
import incomingIcon from "../assets/incomingIcon.svg";
import outgoingIcon from "../assets/outgoingIcon.svg";
import AudioPlayer from "../components/AudioPlayer/AudioPlayer";
import "./CallList.css";

const CallList = () => {
  const [getCalls, { data, isLoading, error }] = useGetCallsMutation();
  console.log("data: ", data);

  const getRandomRating = () => {
    const ratings = ["Плохо", "Хорошо", "Отлично"];
    return ratings[Math.floor(Math.random() * ratings.length)];
  };

  useEffect(() => {
    getCalls({
      date_start: "2024-05-01",
      date_end: "2024-05-27",
      limit: 50,
    });
  }, [getCalls]);

  if (isLoading) return <p>Загрузка...</p>;
  if (error) return <p>Ошибка загрузки</p>;

  return (
    <div className="crm-table">
      <table
        border={1}
        cellPadding={8}
        style={{ borderCollapse: "collapse", width: "100%" }}
      >
        <thead className="table">
          <tr>
            <th>Тип</th>
            <th>Время</th>
            <th>Сотрудник</th>
            <th>Звонок</th>
            <th>Источник</th>
            <th>Оценка</th>
            <th>Длительность</th>
          </tr>
        </thead>
        <tbody>
          {data?.results.map((call: any) => (
            <tr key={call.id}>
              <td>
                {call.in_out === 1 ? (
                  <img
                    src={incomingIcon}
                    alt="Входящий звонок"
                    width={16}
                    height={16}
                  />
                ) : (
                  <img
                    src={outgoingIcon}
                    alt="Исходящий звонок"
                    width={16}
                    height={16}
                  />
                )}
              </td>
              <td>
                {new Date(call.date).toLocaleTimeString("ru-RU", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}
              </td>

              <td>
                {call.person_avatar ? (
                  <img
                    src={call.person_avatar}
                    alt="Аватар"
                    width={40}
                    height={40}
                    style={{ borderRadius: "50%" }}
                  />
                ) : (
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      backgroundColor: "#ccc",
                    }}
                  />
                )}
              </td>
              <td>{call.in_out === 1 ? call.from_number : call.to_number}</td>
              <td>{call.line_name || ""}</td>
              <td>
                {call.status === "Не дозвонился" ? "" : getRandomRating()}
              </td>
              <td>
                {call.record && call.partnership_id ? (
                  <AudioPlayer
                    recordId={call.record}
                    partnershipId={call.partnershipId}
                    duration={`${String(Math.floor(call.time / 60)).padStart(2, "0")}:${String(call.time % 60).padStart(2, "0")}`}
                  />
                ) : (
                  <span>{`${String(Math.floor(call.time / 60)).padStart(
                    2,
                    "0"
                  )}:${String(call.time % 60).padStart(2, "0")}`}</span>
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
