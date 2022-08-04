import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { useGunContext } from "../context";
import { Ellipsis, EllipsisMode } from "react-simple-ellipsis";
import AddFormComment from "./AddFormComment";
// import { stringToColour } from "../util";

const Comment = ({ comment, date, url, id, username, parent }: any) => {
  const gun = useGunContext();
  const [votes, setVotes] = useState<any>();
  const [reply, setReply] = useState<boolean>(false);
  const votesRef = gun.get("licom2-dev").get(url).get(id).get("votes");
  const voted = useRef(0);

  useEffect(() => {
    if (votes) {
      if (voted.current === 1) {
        votesRef.on((data: any) => {
          return setVotes({ up: data.up, down: data.down });
        });
        voted.current = 2;
      }
    }
  }, [votes]);

  const voteUpDown = (type: number) => {
    if (votes) return;

    return votesRef.once((data: any) => {
      if (type === 1) {
        if (!data) {
          data = { up: 1, down: 0 };
        } else {
          data.up++;
          data = { up: data.up++, down: data.down };
        }
      }

      if (type === 0) {
        if (!data) {
          data = { up: 0, down: 1 };
        } else {
          data.down++;
          data = { up: data.up, down: data.down };
        }
      }

      if (data) {
        voted.current = 1;
        votesRef.put(data);
        setVotes(data);
      }
    });
  };

  return (
    <>
      <div className={`comment ${parent ? "parent" : ""}`}>
        <div className="votes">
          <span className="btn" onClick={() => voteUpDown(1)}>
            &#9650;
          </span>
          {/* <span>{i}</span> */}
          <span className="btn" onClick={() => voteUpDown(0)}>
            &#9660;
          </span>
        </div>
        <div className="com">
          <div className="comhead">
            {username} {moment().from(date, true)} ago
            {votes && (
              <span>
                <strong>, {votes.up}</strong> up and{" "}
                <strong>{votes.down}</strong> votes down
              </span>
            )}
          </div>

          <div>
            <Ellipsis
              ellipsis="..."
              label={"Show more"}
              id={id}
              text={comment}
              limit={200}
              mode={EllipsisMode.InPlace}
              class="more"
            />
          </div>

          {!parent && (
            <div className="options">
              <span onClick={() => setReply((prev) => !prev)}>
                {reply ? "cancel reply" : "reply"}
              </span>
            </div>
          )}
        </div>

        {/* <div
          style={{
            backgroundColor: stringToColour(parent ? parent : id),
            opacity: 0.5,
            color: "transparent",
          }}
        >
          X
        </div> */}
      </div>
      <div className="replyBox">
        {reply && (
          <AddFormComment commentid={id} url={url} setReply={setReply} />
        )}
      </div>
    </>
  );
};

export default Comment;
