import { useEffect, useState } from "react";
import { useGetCallsMutation } from "../redux/slice/api.slice";
import incomingIcon from "../assets/incomingIcon.svg";
import outgoingIcon from "../assets/outgoingIcon.svg";
// import AudioPlayer from "../components/AudioPlayer/AudioPlayer";
import CallFilter from "../components/FilterCall/CallFilter";
import "./CallList.css";
import DateCarousel from "../components/DateCarousel/DateCarousel";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CallList = () => {
  const [getCalls] = useGetCallsMutation();

  const [calls, setCalls] = useState<any[]>([]);
  console.log("calls: ", calls);
  const [filter, setFilter] = useState<"all" | "in" | "out">("all");
  const [period, setPeriod] = useState<"3days" | "week" | "month" | "year">(
    "3days"
  );
  const [page, setPage] = useState(1);
  const limit = 20;
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const getPeriodDateRange = () => {
    const now = new Date();
    let startDate: Date;
    switch (period) {
      case "3days":
        startDate = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
        break;
      case "week":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "month":
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
        break;
      case "year":
        startDate = new Date(now);
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    }
    return {
      date_start: startDate.toISOString().slice(0, 10),
      date_end: now.toISOString().slice(0, 10),
    };
  };

  const fetchCalls = async (pageNumber: number) => {
    if (pageNumber < 1) return;
    setIsLoading(true);
    setError(null);
    try {
      const { date_start, date_end } = getPeriodDateRange();

      const in_out = filter === "all" ? undefined : filter === "in" ? 1 : 0;

      const response = await getCalls({
        date_start,
        date_end,
        limit,
        offset: (pageNumber - 1) * limit,
        sort_by: "date",
        in_out,
      }).unwrap();

      setCalls(response.results);
      setTotalCount(response.count);
      setPage(pageNumber);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCalls(1);
  }, [period, filter]);

  const totalPages = Math.ceil(totalCount / limit);

  const getRandomRating = () => {
    const ratings = ["Плохо", "Хорошо", "Отлично"];
    const randomIndex = Math.floor(Math.random() * ratings.length);
    return ratings[randomIndex];
  };

  const renderCallRow = (call: any) => {
    const callDate = new Date(call.date);

    const isMissedCall = call.status === "Не дозвонился";

    const isZeroTime = callDate.getHours() === 0 && callDate.getMinutes() === 0;
    const rating = isMissedCall || isZeroTime ? "" : getRandomRating();

    const callTime = callDate.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    let ratingClass = "";
    switch (rating) {
      case "Плохо":
        ratingClass = "bad";
        break;
      case "Хорошо":
        ratingClass = "good";
        break;
      case "Отлично":
        ratingClass = "excellent";
        break;
      default:
        ratingClass = "";
    }
    console.log(ratingClass);
    return (
      <tr key={call.id}>
        <td className="call-item">
          <img
            src={call.in_out === 1 ? incomingIcon : outgoingIcon}
            alt={call.in_out === 1 ? "Входящий" : "Исходящий"}
            className="icon"
          />
        </td>
        <td className="call-item call-time">{callTime}</td>
        <td className="call-item">
          {call.person_avatar ? (
            <img src={call.person_avatar} alt="Аватар" className="avatar" />
          ) : (
            <div className="avatar placeholder" />
          )}
        </td>
        <td className="call-item">
          +{call.in_out === 1 ? call.from_number : call.to_number}
        </td>
        <td className="call-item">{call.line_name || ""}</td>
        <td className="call-item">
          {rating && (
            <span className={`rating-badge ${ratingClass}`}>{rating}</span>
          )}
        </td>
        <td className="call-item">
          <span className="duration">
            {`${String(Math.floor(call.time / 60)).padStart(2, "0")}:${String(
              call.time % 60
            ).padStart(2, "0")}`}
          </span>
        </td>
      </tr>
    );
  };

  return (
    <div className="container">
      <div className="filters">
        <div>
          <CallFilter filter={filter} setFilter={setFilter} />
        </div>
        <div>
          <DateCarousel period={period} setPeriod={setPeriod} />
        </div>
      </div>

      <div className="call-list">
        {isLoading && <p className="loading">Загрузка...</p>}
        {error && (
          <p className="error">
            Ошибка загрузки данных{error.message ? `: ${error.message}` : ""}
          </p>
        )}
        {!isLoading && !error && calls.length === 0 && <p>Нет звонков</p>}

        {calls.length > 0 && (
          <table className="call-table">
            <thead>
              <tr>
                <th className="table-title">Тип</th>
                <th className="table-title">Время</th>
                <th className="table-title">Сотрудник</th>
                <th className="table-title">Звонок</th>
                <th className="table-title">Источник</th>
                <th className="table-title">Оценка</th>
                <th className="table-title">Длительность</th>
              </tr>
            </thead>
            <tbody>{calls.map(renderCallRow)}</tbody>
          </table>
        )}
      </div>

      <div className="pagination-container">
        <button
          className="pagination-button"
          onClick={() => fetchCalls(page - 1)}
          disabled={page <= 1 || isLoading}
        >
          <ChevronLeft size={20} />
        </button>
        <button
          className="pagination-button"
          onClick={() => fetchCalls(page + 1)}
          disabled={page >= totalPages || isLoading}
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default CallList;
