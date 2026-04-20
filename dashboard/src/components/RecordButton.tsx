import { useEffect, useRef, useState } from "react";
import { startRecording, stopRecording } from "../services/mcapRecorder";

type TopicItem = { topic: string };

type Props = {
  topics: TopicItem[];
  wsUrl: string;
};

export default function RecordButton({ topics, wsUrl }: Props): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isRecording, setIsRecording] = useState(false);
  const [outputPath, setOutputPath] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Keep newly discovered topics selected by default
  useEffect(() => {
    setSelected((prev) => {
      const next = new Set(prev);
      topics.forEach(({ topic }) => next.add(topic));
      return next;
    });
  }, [topics]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  function toggleTopic(topic: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(topic)) next.delete(topic);
      else next.add(topic);
      return next;
    });
  }

  function toggleAll() {
    if (selected.size === topics.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(topics.map((t) => t.topic)));
    }
  }

  async function handleStart() {
    setError(null);
    setOutputPath(null);
    try {
      const topicList = selected.size > 0 ? [...selected] : null;
      const result = await startRecording(wsUrl, topicList);
      setIsRecording(true);
      setOutputPath(result.output);
      setIsOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  async function handleStop() {
    setError(null);
    try {
      const result = await stopRecording();
      setIsRecording(false);
      setOutputPath(result.path);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  const allSelected = topics.length > 0 && selected.size === topics.length;

  return (
    <div style={{ position: "relative" }} ref={dropdownRef}>
      <button
        className={`record-btn${isRecording ? " recording" : ""}`}
        onClick={isRecording ? handleStop : () => setIsOpen((o) => !o)}
      >
        {isRecording && <span className="record-dot" />}
        {isRecording ? "■ Stop" : "● Record"}
      </button>

      {isOpen && !isRecording && (
        <div className="record-dropdown">
          <div className="record-dropdown-header">
            <span>Topics</span>
            <button className="record-toggle-all" onClick={toggleAll}>
              {allSelected ? "Deselect All" : "Select All"}
            </button>
          </div>

          <div className="record-topic-list">
            {topics.length === 0 ? (
              <p className="record-empty">No topics discovered yet</p>
            ) : (
              topics.map(({ topic }) => (
                <label key={topic} className="record-topic-row">
                  <input
                    type="checkbox"
                    checked={selected.has(topic)}
                    onChange={() => toggleTopic(topic)}
                  />
                  <span>{topic}</span>
                </label>
              ))
            )}
          </div>

          {error && <p className="record-error">{error}</p>}

          <button
            className="record-start-btn"
            onClick={handleStart}
            disabled={topics.length === 0}
          >
            Start Recording
          </button>
        </div>
      )}

      {!isOpen && outputPath && !isRecording && (
        <p className="record-output">Saved: {outputPath}</p>
      )}
      {!isOpen && error && !isRecording && (
        <p className="record-error">{error}</p>
      )}
    </div>
  );
}
