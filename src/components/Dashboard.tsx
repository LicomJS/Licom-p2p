import { useState, useRef, useLayoutEffect, useEffect } from "react";
import AddFormComment from "./AddFormComment";
import Comment from "./Comment";
import { getUrl } from "../util";
import { useGunContext } from "../context";

const Dashboard = () => {
  const gun = useGunContext();
  const [comments, setComments] = useState<string[]>([]);
  const [childComments, setChildComments] = useState<string[]>([]);
  const [count, setCount] = useState<number>(0);
  const [open, setOpen] = useState<number>(0);
  const [chatmode, setChatmode] = useState<any>(false);
  const [url, setUrl] = useState<any>(getUrl());
  const loaded = useRef(false);
  let ids: string[] = [];
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    chatmode && messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments]);

  useLayoutEffect(() => {
    if (loaded.current === false) {
      setComments([]);
      setChildComments([]);
      setCount(0);
      ids = [];

      if (!url) {
        loaded.current = true;
        return;
      }

      gun
        .get("licom2-dev")
        .get(url)
        .map()
        .once()
        .on((data: any) => {
          if (!ids.includes(data.id) && data.comment) {
            ids.push(data.id);
            setCount((prev) => prev + 1);

            if (data.parent) {
              setChildComments((prev: any) => [...prev, data]);
            } else {
              setComments((prev: any) => [...prev, data]);
            }
          }
        });

      console.log(childComments);
    }
  }, [loaded.current, open]);

  // 0 init - no url, show input | no form
  // 1 init - url, no input | form
  // 2 change - show input | no form

  return (
    <div className={chatmode && "chat"}>
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
          <div>
            <div className="url" onClick={() => setOpen(2)}>
              {url}
            </div>
            <div className="chatbox">
              <label>
                <input
                  type="checkbox"
                  checked={chatmode}
                  onChange={() => setChatmode((prev: boolean) => !prev)}
                />
                chat mode
              </label>
            </div>
          </div>
        )}
      </div>

      {(open === 1 || (open === 0 && url)) && (
        <div className="cbox">
          <AddFormComment url={url} count={count} chatmode={chatmode} />

          {comments.length ? (
            <div className="commentsbox">
              {comments.map((data: any, i: any) => (
                <div key={i}>
                  <Comment
                    comment={data.comment}
                    username={data.username ? data.username : "Anonymouse"}
                    date={data._[">"].comment}
                    url={url}
                    id={data.id}
                    parent={data.parent ? data.parent : null}
                  />
                  {childComments.map((child: any, ii: any) => (
                    <div key={ii}>
                      {data.id === child.parent && (
                        <Comment
                          comment={child.comment}
                          username={
                            child.username ? child.username : "Anonymouse"
                          }
                          date={child._[">"].comment}
                          url={url}
                          id={child.id}
                          parent={child.parent ? child.parent : null}
                        />
                      )}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              ))}
            </div>
          ) : (
            <div className="nc">no comments</div>
          )}
        </div>
      )}

      <footer>
        <a href="https://github.com/LicomJS/Licom-p2p" target="_blank">
          opensource
        </a>
      </footer>
    </div>
  );
};

export default Dashboard;
