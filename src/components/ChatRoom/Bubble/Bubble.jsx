import { timeConverter } from "../../../utils/utils";
import "./bubble.css";

export default function Bubble({ message, sender, index, len, time, status, first }) {

  return (
    <div className={`bubble p-2 mt-1 ${sender === "self" ? "self" : "other"} ${first}`}>
      <p className="message mb-0">
        {message}
        <span className="time">{timeConverter(time)}</span>
      </p>
      {
        index === len - 1 && sender === "self" && (
          <span className="status">{status}</span>
        )
      }
    </div>
  );
}