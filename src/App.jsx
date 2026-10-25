
import { useState } from "react";
import {
  Activity,
  ArrowUpRight,
  Bell,
  ChevronDown,
  CircleHelp,
  Clock3,
  Gavel,
  LayoutDashboard,
  Medal,
  Search,
  Settings2,
  Shield,
  Users,
  Wallet,
  Zap,
} from "lucide-react";
import "./App.css";

const teams = [
  { name: "Mumbai Indians", short: "MI", color: "#36a9ff", purse: 32.5, spent: 87.5, players: 18 },
  { name: "Chennai Super Kings", short: "CSK", color: "#ffc928", purse: 24.8, spent: 95.2, players: 17 },
  { name: "Royal Challengers", short: "RCB", color: "#ff5268", purse: 18.4, spent: 101.6, players: 19 },
  { name: "Kolkata Knight Riders", short: "KKR", color: "#b18aff", purse: 41.2, spent: 78.8, players: 16 },
];

const players = [
  { name: "Rishabh Pant", role: "WICKETKEEPER", country: "INDIA", age: 28, base: 2, initials: "RP", color: "#ff875f", rating: 92 },
  { name: "Jasprit Bumrah", role: "FAST BOWLER", country: "INDIA", age: 32, base: 2, initials: "JB", color: "#6b9eff", rating: 96 },
  { name: "Travis Head", role: "BATTER", country: "AUSTRALIA", age: 32, base: 2, initials: "TH", color: "#f1bd64", rating: 89 },
];

function money(value) {
  return `₹${value.toFixed(2)} Cr`;
}

function App() {
  const [playerIndex, setPlayerIndex] = useState(0);
  const [bid, setBid] = useState(2);
  const [leader, setLeader] = useState(null);
  const [sold, setSold] = useState(false);
  const [activeTeam, setActiveTeam] = useState(0);
  const [purchases, setPurchases] = useState([]);
  const [activity, setActivity] = useState([
    "Auction room initialized",
    "Franchises are ready",
  ]);
  const [search, setSearch] = useState("");
  const [teamData, setTeamData] = useState(teams);

  const player = players[playerIndex];
  const currentTeam = teamData[activeTeam];
  const winningTeam = teamData.find(
  (team) => team.short === leader
);

const priceIncrease = player.base > 0
  ? (((bid - player.base) / player.base) * 100).toFixed(0)
  : 0;
  const [bidHistory, setBidHistory] = useState([]);


function resetAuction() {
  const confirmed = window.confirm(
    "Are you sure you want to reset the entire auction?"
  );

  if (!confirmed) return;

  setPlayerIndex(0);
  setBid(players[0].base);
  setLeader(null);
  setSold(false);
  setActiveTeam(0);
  setTeamData(teams);
  setActivity([
    "Auction has been reset",
    "Auction room initialized",
  ]);
  setSearch("");
  setBidHistory([]);
  setPurchases([]);
}
  function nextPlayer() {
    setPlayerIndex((i) => (i + 1) % players.length);
    setBid(2);
    setLeader(null);
    setSold(false);
    setActivity((a) => ["Next player is on the block", ...a].slice(0, 5));
  }

function placeBid() {
  if (sold) return;

  if (leader === currentTeam.short) {
    alert("Your team already has the highest bid!");
    return;
  }

  const next = leader ? bid + 0.25 : player.base;

  if (currentTeam.purse < next) {
    alert("Not enough purse for this bid!");
    return;
  }

  setBid(Number(next.toFixed(2)));
  setLeader(currentTeam.short);

  setBidHistory((history) => [
    {
      team: currentTeam.short,
      amount: Number(next.toFixed(2)),
      time: new Date().toLocaleTimeString(),
    },
    ...history,
  ].slice(0, 10));

  setActivity((a) =>
    [`${currentTeam.short} bid ₹${next.toFixed(2)} Cr`, ...a].slice(0, 5)
  );
}

function sellPlayer() {
  if (sold) {
    nextPlayer();
    return;
  }

  
setPurchases((prev) => [
  {
    player: player.name,
    team: leader,
    price: bid,
  },
  ...prev,
]);

setSold(true);
setActivity((a) =>
  [`${player.name} SOLD to ${leader} for ₹${bid.toFixed(2)} Cr`, ...a].slice(0, 5)
);


  const winningTeam = teamData.find((t) => t.short === leader);

  if (!winningTeam || winningTeam.purse < bid) {
    alert("Sale failed: check team purse.");
    return;
  }

  setTeamData((prev) =>
    prev.map((team) =>
      team.short === leader
        ? {
            ...team,
            purse: Number((team.purse - bid).toFixed(2)),
            spent: Number((team.spent + bid).toFixed(2)),
            players: team.players + 1,
          }
        : team
    )
  );

  setSold(true);
  setActivity((a) =>
    [`${player.name} SOLD to ${leader} for ₹${bid.toFixed(2)} Cr`, ...a].slice(0, 5)
  );
}

const filteredTeams = teamData.filter((team) =>
  team.name.toLowerCase().includes(search.toLowerCase())
);

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark"><Gavel size={23} /></div>
          <div><strong>IPL<span>AUCTION</span></strong><small>COMMAND CENTER</small></div>
        </div>

        <div className="season-chip"><span className="live-dot" /> SEASON 2026 <ChevronDown size={14} /></div>

        <p className="nav-label">WORKSPACE</p>
        <nav>
          <button className="nav-item active"><LayoutDashboard size={18} /> Auction Room <span className="nav-count">01</span></button>
          <button className="nav-item" onClick={() => setActivity(["Squad overview selected", ...activity].slice(0, 5))}><Users size={18} /> Team Squads</button>
          <button className="nav-item" onClick={() => setActivity(["Leaderboard selected", ...activity].slice(0, 5))}><Medal size={18} /> Leaderboard</button>
          <button className="nav-item" onClick={() => setActivity(["Auction history selected", ...activity].slice(0, 5))}><Activity size={18} /> Auction History</button>
        </nav>

        <p className="nav-label">YOUR FRANCHISE</p>
        <div className="team-nav">
          {teams.map((team, i) => (
            <button key={team.short} className={`team-nav-item ${activeTeam === i ? "selected" : ""}`} onClick={() => setActiveTeam(i)}>
              <span className="team-emblem" style={{ "--team": team.color }}>{team.short.slice(0, 1)}</span>
              <span>{team.name}</span>
              <span className="team-mini-dot" style={{ background: team.color }} />
            </button>
          ))}
        </div>

        <div className="sidebar-bottom">
          <div className="help-card"><CircleHelp size={19} /><div><strong>Need a hand?</strong><span>Auction guide & rules</span></div><ArrowUpRight size={15} /></div>
          <button className="profile"><div className="avatar">JN</div><div><strong>Jatin Nagwani</strong><span>League Commissioner</span></div><Settings2 size={17} /></button>
        </div>
      </aside>

      <section className="main-area">
        <header className="topbar">
          <div><div className="breadcrumb">LEAGUES <span>/</span> IPL 2026 <span>/</span> <b>AUCTION ROOM</b></div><h1>The Auction Room<span className="title-period">.</span></h1></div>
          <div className="top-actions"><div className="online-pill"><span className="live-dot" /> LIVE SESSION</div><button className="icon-btn"><Bell size={18} /><i /></button><div className="top-avatar">JN</div></div>
        </header>

        <section className="stats-row">
          <div className="stat-card"><div className="stat-top"><span>PLAYERS AUCTIONED</span><Users size={17} /></div><div className="stat-value">124 <small>/ 250</small></div><div className="stat-foot"><span className="positive">+12</span> in the last 10 min<div className="mini-bars">{[35, 58, 40, 74, 55, 86, 64, 95, 70, 100].map((h, i) => <i key={i} style={{ height: `${h}%` }} />)}</div></div></div>
          <div className="stat-card"><div className="stat-top"><span>TOTAL SPEND</span><Wallet size={17} /></div><div className="stat-value">₹363.1 <small>Cr</small></div><div className="stat-foot"><span className="positive">68.4%</span> of combined purse used</div><div className="progress-track"><i style={{ width: "68.4%" }} /></div></div>
          <div className="stat-card"><div className="stat-top"><span>ACTIVE FRANCHISES</span><Shield size={17} /></div><div className="stat-value">10 <small>teams</small></div><div className="stat-foot"><span className="positive">All ready</span> for the next bid</div><div className="team-dots">{teams.map(t => <i key={t.short} style={{ background: t.color }} />)}</div></div>
          <div className="stat-card"><div className="stat-top"><span>AUCTION PACE</span><Zap size={17} /></div><div className="stat-value">Fast <small>mode</small></div><div className="stat-foot"><span className="positive">● On track</span> · 8 sec per bid</div><div className="pace-line"><i /></div></div>
        </section>

        <div className="content-grid">
          <section className="auction-column">
            <div className="section-heading"><div><span className="eyebrow">UP NEXT · PLAYER LOT {String(124 + playerIndex + 1).padStart(3, "0")}</span><h2>Live bidding <span className="live-tag"><i /> LIVE</span></h2></div><button className="outline-btn" onClick={nextPlayer}>Skip player <ArrowUpRight size={15} /></button></div>
            <button className="outline-btn" onClick={resetAuction}>Reset Auction</button>

            <article className={`player-card ${sold ? "player-sold" : ""}`}>
              <div className="player-card-bg">{player.initials}</div>
              <div className="player-card-top"><span className="lot-badge">LOT #{String(125 + playerIndex).padStart(3, "0")}</span><span className="player-rating"><Medal size={14} /> RATING {player.rating}</span></div>
              <div className="player-main">
                <div className="player-art" style={{ "--player-color": player.color }}><div className="player-glow" /><div className="player-silhouette">{player.initials}</div><span className="player-country">{player.country}</span></div>
                <div className="player-info"><span className="role-label">{player.role}</span><h3>{player.name.split(" ")[0]}<br /><span>{player.name.split(" ").slice(1).join(" ")}</span></h3><div className="player-meta"><span>{player.age} YRS</span><i /> <span>{player.country}</span></div><div className="base-price"><span>BASE PRICE</span><strong>{money(player.base)}</strong></div></div>
              </div>
              {sold && <div className="sold-stamp">SOLD!</div>}
              <div className="player-card-bottom"><span><i /> VERIFIED PLAYER PROFILE</span><span>ALL-ROUNDER INDEX <b>{player.rating}/100</b></span></div>
            </article>

            <section className="bid-panel">
              <div className="bid-panel-top"><div><span className="eyebrow">CURRENT HIGHEST BID</span><div className="bid-amount">{money(bid)}</div></div><div className="bid-team"><span className="bid-team-icon" style={{ "--team": (teams.find(t => t.short === leader) || currentTeam).color }}>{leader || currentTeam.short}</span><div><span>LEADING FRANCHISE</span><strong>{(teams.find(t => t.short === leader) || currentTeam).name}</strong></div></div></div>
              <div className="bid-divider" />
              <div className="bid-controls"><span className="bid-hint"><Clock3 size={15} /> {sold ? "Lot closed" : "Place your next bid"}</span><div className="bid-buttons"><button className="bid-increment" onClick={() => setBid(Math.max(0.25, bid - 0.25))} disabled={sold}>−</button><button className="bid-action" onClick={placeBid} disabled={sold}><Gavel size={18} /> BID + ₹0.25 Cr</button><button className="bid-increment" onClick={() => setBid(bid + 0.5)} disabled={sold}>+0.50</button></div><button className="sell-btn" onClick={sellPlayer}>{sold ? "NEXT PLAYER →" : "🔨  SOLD / UNSOLD"}</button></div>
            </section>

            <section className="activity-card">

              {sold && (
  <section className="activity-card">
    <div className="activity-head">
      <h3><Medal size={17} /> Auction Result</h3>
      <span>{leader ? "SOLD" : "UNSOLD"}</span>
    </div>

    {leader && winningTeam ? (
      <>
        <div className="activity-item">
          <span className="activity-dot bright" />
          <span>
            <strong>{player.name}</strong> sold to{" "}
            <strong>{winningTeam.name}</strong>
          </span>
          <time>{money(bid)}</time>
        </div>

        <div className="activity-item">
          <span className="activity-dot bright" />
          <span>Base price: {money(player.base)}</span>
          <time>+{priceIncrease}%</time>
        </div>
      </>
    ) : (
      <p style={{ padding: "12px 0", color: "#999" }}>
        {player.name} went unsold. No team placed a bid.
      </p>
    )}
  </section>
)}
  <div className="activity-head">
    <h3><Gavel size={17} /> Bid History</h3>
    <span>{bidHistory.length} BIDS</span>
  </div>

  {bidHistory.length === 0 ? (
    <p style={{ padding: "12px 0", color: "#999" }}>
      No bids yet. Place the first bid!
    </p>
  ) : (
    bidHistory.map((item, index) => (
      <div className="activity-item" key={`${item.time}-${index}`}>
        <span className={`activity-dot ${index === 0 ? "bright" : ""}`} />
        <span>
          <strong>{item.team}</strong> bid {money(item.amount)}
        </span>
        <time>{item.time}</time>
      </div>
    ))
  )}
</section>

            <section className="activity-card"><div className="activity-head"><h3><Activity size={17} /> Auction activity</h3><span>LIVE FEED</span></div>{activity.map((item, i) => <div className="activity-item" key={`${item}-${i}`}><span className={`activity-dot ${i === 0 ? "bright" : ""}`} /><span>{item}</span><time>{i === 0 ? "NOW" : `${i * 2}m AGO`}</time></div>)}</section>
          </section>


<section className="activity-card">
  <div className="activity-head">
    <h3><Users size={17} /> Recent Purchases</h3>
    <span>{purchases.length} SIGNED</span>
  </div>

  {purchases.length === 0 ? (
    <p style={{ padding: "12px 0", color: "#999" }}>
      No players purchased yet.
    </p>
  ) : (
    purchases.map((item, index) => (
      <div className="activity-item" key={`${item.player}-${index}`}>
        <span className="activity-dot bright" />
        <span>
          <strong>{item.player}</strong> → {item.team}
        </span>
        <time>{money(item.price)}</time>
      </div>
    ))
  )}
</section>



<aside className="right-column">
  <section className="franchise-card">
    <div className="right-heading">
      <div>
        <span className="eyebrow">FRANCHISE OVERVIEW</span>
        <h3>Team purses</h3>
      </div>
      <button className="icon-btn">
        <Settings2 size={17} />
      </button>
    </div>

    <label className="search-box">
      <Search size={16} />
      <input
        placeholder="Search franchises..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
    </label>

    <div className="team-list">
      {filteredTeams.map(team => (
        <div className="purse-team" key={team.short}>
          <div className="purse-team-top">
            <div
              className="team-emblem large"
              style={{ "--team": team.color }}
            >
              {team.short.slice(0, 1)}
            </div>

            <div className="purse-team-name">
              <strong>{team.name}</strong>
              <span>{team.players} players signed</span>
            </div>

            <button className="dots-btn">···</button>
          </div>

          <div className="purse-numbers">
            <span>REMAINING PURSE</span>
            <strong>{money(team.purse)}</strong>
          </div>

          <div className="progress-track">
            <i
              style={{
                width: `${team.spent}%`,
                background: team.color
              }}
            />
          </div>

          <div className="purse-foot">
            <span>₹{team.spent} Cr spent</span>
            <span>{100 - team.spent}% left</span>
          </div>
        </div>
      ))}
    </div>

    <button className="view-all-btn" onClick={() => setSearch("")}>
      VIEW ALL FRANCHISES <ArrowUpRight size={15} />
    </button>
  </section>

  {/* NEW FEATURE: SQUAD OVERVIEW */}
  <section className="franchise-card">
    <div className="right-heading">
      <div>
        <span className="eyebrow">SQUAD OVERVIEW</span>
        <h3>{currentTeam.name}</h3>
      </div>
      <Users size={20} />
    </div>

    <div className="team-list">
      {purchases.filter(item => item.team === currentTeam.short).length === 0 ? (
        <p style={{ padding: "12px 0", color: "#999" }}>
          No players purchased by this team yet.
        </p>
      ) : (
        purchases
          .filter(item => item.team === currentTeam.short)
          .map((item, index) => (
            <div
              className="purse-team"
              key={`${item.player}-${index}`}
            >
              <div className="purse-team-top">
                <div className="purse-team-name">
                  <strong>{item.player}</strong>
                  <span>Purchased by {item.team}</span>
                </div>
                <strong>{money(item.price)}</strong>
              </div>
            </div>
          ))
      )}
    </div>
  </section>

  <section className="next-card">
    <div className="next-card-head">
      <span className="eyebrow">AUCTION CONTROL</span>
      <span className="control-live"><i /> READY</span>
    </div>

    <h3>Keep the momentum.</h3>
    <p>
      Every bid brings your dream squad closer. Make your next move count.
    </p>

    <button onClick={nextPlayer}>
      Next player <ArrowUpRight size={16} />
    </button>

    <div className="next-decoration">
      <Gavel size={88} />
    </div>
  </section>

  <section className="quick-stats">
    <div>
      <span>YOUR SQUAD</span>
      <strong>{currentTeam.players}<small>/ 25</small></strong>
    </div>
    <div>
      <span>REMAINING PURSE</span>
      <strong>{money(currentTeam.purse)}</strong>
    </div>
    <div>
      <span>AVAILABLE SLOTS</span>
      <strong>{25 - currentTeam.players}</strong>
    </div>
  </section>
</aside>

        </div>
        <footer className="footer"><span>IPL AUCTION SIMULATOR <i>•</i> SEASON 2026</span><span>BUILT FOR THE LOVE OF THE GAME <span className="footer-heart">♥</span></span></footer>
      </section>
    </main>
  );
}

export default App;
