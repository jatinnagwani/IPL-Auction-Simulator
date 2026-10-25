
const { teams, players } = require("../auctionData");

const MIN_INCREMENT = 0.25;
const MAX_SQUAD_SIZE = 25;
const MAX_OVERSEAS_PLAYERS = 8;

// Auction ki current state
const auction = {
  currentPlayerId: players[0]?.id ?? null,
  currentBid: 0,
  highestBidderId: null,
  status: "LIVE",
};

function getCurrentPlayer() {
  return players.find((player) => player.id === auction.currentPlayerId);
}

function getState() {
  return {
    teams: teams.map((team) => ({ ...team })),
    players: players.map((player) => ({ ...player })),
    currentPlayer: getCurrentPlayer()
      ? { ...getCurrentPlayer() }
      : null,
    auction: { ...auction },
  };
}

function placeBid(teamId) {
  if (auction.status !== "LIVE") {
    throw new Error("Auction is not live.");
  }

  const team = teams.find((item) => item.id === teamId);

  if (!team) {
    throw new Error("Invalid team ID.");
  }

  const player = getCurrentPlayer();

  if (!player || player.status !== "AVAILABLE") {
    throw new Error("No available player to bid on.");
  }

  if (auction.highestBidderId === teamId) {
    throw new Error("Your team already has the highest bid.");
  }

  if (team.players >= MAX_SQUAD_SIZE) {
    throw new Error("Squad limit reached.");
  }

  const isOverseas = player.country !== "INDIA";

  if (isOverseas && team.overseas >= MAX_OVERSEAS_PLAYERS) {
    throw new Error("Overseas player limit reached.");
  }

  const nextBid =
    auction.highestBidderId === null
      ? player.basePrice
      : Number((auction.currentBid + MIN_INCREMENT).toFixed(2));

  if (team.purse < nextBid) {
    throw new Error("Insufficient purse for this bid.");
  }

  auction.currentBid = nextBid;
  auction.highestBidderId = teamId;

  return getState();
}

function sellPlayer() {
  if (auction.status !== "LIVE") {
    throw new Error("Auction is not live.");
  }

  const player = getCurrentPlayer();

  if (!player || player.status !== "AVAILABLE") {
    throw new Error("No available player to sell.");
  }

  if (!auction.highestBidderId) {
    throw new Error("No bids placed. Mark this player unsold instead.");
  }

  const winningTeam = teams.find(
    (team) => team.id === auction.highestBidderId
  );

  // Final safety checks before completing the sale
  if (!winningTeam || winningTeam.purse < auction.currentBid) {
    throw new Error("Sale failed: invalid team purse.");
  }

  winningTeam.purse = Number(
    (winningTeam.purse - auction.currentBid).toFixed(2)
  );
  winningTeam.players += 1;

  if (player.country !== "INDIA") {
    winningTeam.overseas += 1;
  }

  player.status = "SOLD";
  player.soldTo = winningTeam.id;
  player.soldPrice = auction.currentBid;

  auction.status = "SOLD";

  return getState();
}

function markUnsold() {
  if (auction.status !== "LIVE") {
    throw new Error("Auction is not live.");
  }

  const player = getCurrentPlayer();

  if (!player || player.status !== "AVAILABLE") {
    throw new Error("No available player to mark unsold.");
  }

  if (auction.highestBidderId) {
    throw new Error("A player with active bids cannot be marked unsold.");
  }

  player.status = "UNSOLD";
  auction.status = "UNSOLD";

  return getState();
}

function nextPlayer() {
  if (!["SOLD", "UNSOLD"].includes(auction.status)) {
    throw new Error("Finish the current player's auction first.");
  }

  const next = players.find((player) => player.status === "AVAILABLE");

  if (!next) {
    auction.currentPlayerId = null;
    auction.currentBid = 0;
    auction.highestBidderId = null;
    auction.status = "COMPLETED";

    return getState();
  }

  auction.currentPlayerId = next.id;
  auction.currentBid = 0;
  auction.highestBidderId = null;
  auction.status = "LIVE";

  return getState();
}

module.exports = {
  getState,
  placeBid,
  sellPlayer,
  markUnsold,
  nextPlayer,
};
