import { useState, useCallback } from "react";
import { nanoid } from "nanoid";
import { useGunContext } from "../context";

const AddFormComment = ({ url, count }: any) => {
  const gun = useGunContext();
  const [comment, setComment] = useState("");
  const [username, setUsername] = useState("");

  const AddComment = useCallback(async () => {
    const salt: any = nanoid();
    const id: any = nanoid(10);
    const SEA = Gun.SEA;

    if (comment.length < 3) return;

    const hash: any = await SEA.work({ comment, id }, salt, null, {
      name: "SHA-256",
    });

    gun
      .get("licom2-dev")
      .get(url)
      .get(hash)
      .put({ comment, id, username }, (ack: any) => {
        if (!ack.err) setComment("");
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
          add comment
        </button>
      </div>
      <input
        type="text"
        onChange={(e) => setUsername(e.target.value)}
        placeholder="your name (optional)"
      />
      <div className="count">{count} comments</div>
    </div>
  );
};

export default AddFormComment;
