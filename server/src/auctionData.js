
const teams = [
  { id: "MI", name: "Mumbai Indians", purse: 32.5, players: 18, overseas: 5 },
  { id: "CSK", name: "Chennai Super Kings", purse: 24.8, players: 17, overseas: 4 },
  { id: "RCB", name: "Royal Challengers", purse: 18.4, players: 19, overseas: 6 },
  { id: "KKR", name: "Kolkata Knight Riders", purse: 41.2, players: 16, overseas: 4 },
];

const players = [
  {
    id: "P001",
    name: "Rishabh Pant",
    role: "WICKETKEEPER",
    country: "INDIA",
    basePrice: 2,
    status: "AVAILABLE",
    soldTo: null,
    soldPrice: null,
  },
  {
    id: "P002",
    name: "Jasprit Bumrah",
    role: "FAST BOWLER",
    country: "INDIA",
    basePrice: 2,
    status: "AVAILABLE",
    soldTo: null,
    soldPrice: null,
  },
  {
    id: "P003",
    name: "Travis Head",
    role: "BATTER",
    country: "AUSTRALIA",
    basePrice: 2,
    status: "AVAILABLE",
    soldTo: null,
    soldPrice: null,
  },
];

module.exports = { teams, players };
