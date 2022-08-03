import { useState, useRef, useLayoutEffect } from "react";
import AddFormComment from "./AddFormComment";
import Comment from "./Comment";
import { getUrl } from "../util";
import { useGunContext } from "../context";

const Dashboard = () => {
  const gun = useGunContext();
  const [comments, setComments] = useState<string[]>([]);
  const [count, setCount] = useState<number>(0);
  const [open, setOpen] = useState<number>(0);
  const [url, setUrl] = useState<any>(getUrl());
  const loaded = useRef(false);
  let ids: string[] = [];

  useLayoutEffect(() => {
    if (loaded.current === false) {
      setComments([]);
      setCount(0);
      ids = [];

      gun
        .get("licom2-dev")
        .get(url)
        .map()
        .once()
        .on((data: any) => {
          if (!ids.includes(data.id) && data.comment) {
            setComments((prev: any) => [...prev, data]);
            ids.push(data.id);
            setCount((prev) => prev + 1);
          }
        });

      loaded.current = true;
    }
  }, [loaded.current, open]);

  // 0 init - no url, show input | no form
  // 1 init - url, no input | form
  // 2 change - show input | no form

  return (
    <div>
      <div className="urlbar">
        {open === 2 || (open === 0 && !url) ? (
          <div>
            <input
              type="text"
              value={url ? url : ""}
              placeholder="url"
              onChange={(e) => {
                setUrl(e.target.value);
                setOpen(2);
              }}
            />
            <button
              onClick={() => {
                if (url) {
                  loaded.current = false;
                  setOpen(1);
                }
              }}
            >
              submit
            </button>
          </div>
        ) : (
          <div className="url" onClick={() => setOpen(2)}>
            {url}
          </div>
        )}
      </div>

      {(open === 1 || (open === 0 && url)) && (
        <div>
          <AddFormComment url={url} count={count} />

          {comments.length ? (
            <div>
              {comments.map((data: any, i: any) => (
                <div key={i}>
                  <Comment
                    comment={data.comment}
                    username={data.username ? data.username : "Anonymouse"}
                    date={data._[">"].comment}
                    url={url}
                    id={data.id}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="nc">no comments</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
