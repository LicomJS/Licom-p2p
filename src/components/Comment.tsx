import moment from "moment";
import { useEffect, useRef, useState } from "react";
import snarkdown from "snarkdown";
import { useGunContext } from "../context";

const Comment = ({ comment, date, url, id, username }: any) => {
  const gun = useGunContext();
  const [votes, setVotes] = useState<any>();
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

    // return () => {
    //   votesRef.off();
    // };
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
    <div className="comment">
      <div className="votes">
        <span className="btn" onClick={() => voteUpDown(1)}>
          &#9650;
        </span>
        {/* <span>{i}</span> */}
        {/* <span>{"0"}</span> */}
        <span className="btn" onClick={() => voteUpDown(0)}>
          &#9660;
        </span>
      </div>
      <div className="com">
        <div className="comhead">
          {username} {moment().from(date, true)} ago {/*| next [&ndash;]*/}
          {votes && (
            <span>
              <strong>{votes.up}</strong> up and <strong>{votes.down}</strong>{" "}
              votes down
            </span>
          )}
        </div>

        <div>{comment}</div>
        {/* <div>{snarkdown(comment)}</div> */}

        <div className="options">reply</div>
      </div>
    </div>
  );
};

export default Comment;
