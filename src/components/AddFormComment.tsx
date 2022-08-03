import { useState, useCallback } from "react";
import { nanoid } from "nanoid";
import { useGunContext } from "../context";

const AddFormComment = ({ url, count }: any) => {
  const gun = useGunContext();
  const [comment, setComment] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const AddComment = useCallback(async () => {
    const salt: any = nanoid();
    const id: any = nanoid(10);
    const SEA = Gun.SEA;

    if (comment.length < 3) return;
    if (username.length > 30) return setError("username max 30 characters");

    const hash: any = await SEA.work({ comment, id }, salt, null, {
      name: "SHA-256",
    });

    gun
      .get("licom2-dev")
      .get(url)
      .get(hash)
      .put({ comment, id, username }, (ack: any) => {
        if (!ack.err) {
          setComment("");
          setError("");
        }
      });
  }, [comment, username]);

  return (
    <div className="form">
      <div className="formComment">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="your comment"
        ></textarea>
        <button
          disabled={comment.length < 3 && true}
          onClick={() => {
            AddComment();
          }}
        >
          {comment.length < 3 ? "at least 3 char" : "add comment"}
        </button>
      </div>
      <input
        type="text"
        onChange={(e) => setUsername(e.target.value)}
        placeholder="your name (optional)"
      />

      {error && <div style={{ color: "red" }}>{error}</div>}

      {count !== 0 && (
        <div className="count">
          {count} {count > 1 ? "comments" : "comment"}
        </div>
      )}
    </div>
  );
};

export default AddFormComment;
