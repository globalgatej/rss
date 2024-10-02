import React, {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';



function App() {
  const [rssUrl, setRssUrl] = useState('');
  const [feedItems, setFeedItems] = useState([]);
  const [error, setError] = useState(null);

  const fetchRSSFeed = async (e) => {
    e.preventDefault();

    // RSS to JSON APIを使用してRSSフィードを取得
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.status === 'ok') {
        setFeedItems(data.items); // RSSフィードのアイテムを保存
        setError(null);
      } else {
        setError('RSSフィードを取得できませんでした。');
        setFeedItems([]);
      }
    } catch (err) {
      setError('エラーが発生しました。');
      setFeedItems([]);
    }
  };
  const truncateText = (str, num) => {
    return str.length > num ? str.slice(0, num) + '...' : str;
  };

  return (
    <div className="container">

      <div className="row py-4">
        <div className="col text-center">
          <h1 className="fs-2 fw-bold">RSSリーダー</h1>
        </div>
      </div>

      {/* RSSフィードURL入力フォーム */}
      <div className="row">
        <div className="col-12">
          <label htmlFor="rssUrl" className="form-label">RSSフィードのURLを入力してください:</label>
          <input
            type="url"
            className="form-control"
            id="rssUrl"
            value={rssUrl}
            onChange={(e) => setRssUrl(e.target.value)}
            placeholder="https://example.com/rss"
            required
          />
        </div>
      </div>
      <div className="row  py-4">

        <div className="col-auto">
          <button className="btn btn-primary" onClick={fetchRSSFeed}>RSSを取得</button>

        </div>
      </div>

      {/* エラーメッセージ */}
      {error && <p className="text-danger">{error}</p>}

      {/* RSSフィードのアイテム表示 */}
      <div className="row">
        <div className="col-12">

          {feedItems.length > 0 && (
            <ul className="list-group bg-white">
              {feedItems.map((item) => (
                <li key={item.guid} className="list-group-item bg-white">
                  <div className="mb-2">
                    <a href={item.link} target="_blank" rel="noopener noreferrer" class="fw-bold">
                      {item.title}
                    </a>
                  </div>
                  <div className="mb-2">
                    {truncateText(item.description, 40)}
                  </div>
                  <div>{item.pubDate}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

    </div>
  );
}

export default App;
