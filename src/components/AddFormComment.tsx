import { useState, useCallback } from "react";
import { nanoid } from "nanoid";
import { useGunContext } from "../context";

const AddFormComment = ({
  url,
  count,
  chatmode,
  commentid = null,
  setReply,
}: any) => {
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
      .put({ comment, id, username, parent: commentid }, (ack: any) => {
        if (!ack.err) {
          setComment("");
          setError("");
          setReply(false);
        }
      });
  }, [comment, username]);

  return (
    <div className="form">
      <div className="formComment">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={
            chatmode ? "your comment (submit on enter)" : "your comment"
          }
          onKeyDown={(e) => {
            if (e.key === "Enter" && chatmode) {
              AddComment();
            }
          }}
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
        className="username"
        onChange={(e) => setUsername(e.target.value)}
        placeholder="your name (optional)"
      />

      {error && <div style={{ color: "red" }}>{error}</div>}

      {count !== 0 && !commentid && (
        <div className="count">
          {count} {count > 1 ? "comments" : "comment"}
        </div>
      )}
    </div>
  );
};

export default AddFormComment;
