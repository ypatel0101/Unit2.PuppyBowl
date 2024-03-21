// Use the API_URL variable to make fetch requests to the API.
// Replace the placeholder with your cohort name (ex: 2109-UNF-HY-WEB-PT)
const cohortName = "2402-ftb-et-web-ft";
const API_URL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}`;

/**
 * Fetches all players from the API.
 * @returns {Object[]} the array of player objects
 */
const fetchAllPlayers = async () => {
  try {
    // TODO
    const response = await fetch(`${API_URL}players`);
    const data = await response.json();
    return data.data.players;

  } catch (err) {
    console.error("Uh oh, trouble fetching players!", err);
  }
};

/**
 * Fetches a single player from the API.
 * @param {number} playerId
 * @returns {Object} the player object
 */
const fetchSinglePlayer = async (playerId) => {
  try {
    // TODO
    const response = await fetch(`${API_URL}players/${playerId}`);
    const data = await response.json();
    return data.data.player;
  } catch (err) {
    console.error(`Oh no, trouble fetching player #${playerId}!`, err);
  }
};

/**
 * Adds a new player to the roster via the API.
 * @param {Object} playerObj the player to add
 * @returns {Object} the player returned by the API
 */
const addNewPlayer = async (playerObj) => {
  try {
    const response = await fetch(`${API_URL}players`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(playerObj),
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Oops, something went wrong with adding that player!", err);  }
};



/**
 * Removes a player from the roster via the API.
 * @param {number} playerId the ID of the player to remove
 */
const removePlayer = async (playerId) => {
  try {
    const response = await fetch(`${API_URL}players/${playerId}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(`Whoops, trouble removing player #${playerId} from the roster!`, err);
  }
};

/**
 * Updates `<main>` to display a list of all players.
 *
 * If there are no players, a corresponding message is displayed instead.
 *
 * Each player is displayed in a card with the following information:
 * - name
 * - id
 * - image (with alt text of the player's name)
 *
 * Additionally, each card has two buttons:
 * - "See details" button that, when clicked, calls `renderSinglePlayer` to
 *    display more information about the player
 * - "Remove from roster" button that, when clicked, will call `removePlayer` to
 *    remove that specific player and then re-render all players
 *
 * Note: this function should replace the current contents of `<main>`, not append to it.
 * @param {Object[]} playerList - an array of player objects
 */
const renderAllPlayers = (playerList) => {
  const main = document.querySelector('main');
  main.innerHTML = ''; 

  if (playerList.length === 0) {
    main.innerHTML = '<p>No players found.</p>';
    return;
  }

  playerList.forEach(player => {
    const playerElement = document.createElement('div');
    playerElement.className = 'player-card';
    playerElement.innerHTML = `
      <img src="${player.imageUrl}" alt="${player.name}" style="height: 100px; width: auto;">
      <h2>${player.name}</h2>
      <p>ID: ${player.id}</p>
      <p>Breed: ${player.breed}</p>
      <p>Status: ${player.status}</p>
      <p>Team: ${player.teamId ? 'Team ' + player.teamId : 'Unassigned'}</p>
      <button onclick="renderSinglePlayer(${player.id})">See Details</button>`;
    main.appendChild(playerElement);
  });
};

/**
 * Updates `<main>` to display a single player.
 * The player is displayed in a card with the following information:
 * - name
 * - id
 * - breed
 * - image (with alt text of the player's name)
 * - team name, if the player has one, or "Unassigned"
 *
 * The card also contains a "Back to all players" button that, when clicked,
 * will call `renderAllPlayers` to re-render the full list of players.
 * @param {Object} player an object representing a single player
 */
const renderSinglePlayer = (player) => {
  const main = document.querySelector('main');
  main.innerHTML = ''; // Clear current content

  // Create the player detail card
  const playerElement = document.createElement('div');
  playerElement.className = 'player-card';
  playerElement.innerHTML = `
    <img src="${player.imageUrl}" alt="Image of ${player.name}" style="height: 200px; width: auto;">
    <h2>${player.name}</h2>
    <p>ID: ${player.id}</p>
    <p>Breed: ${player.breed}</p>
    <p>Status: ${player.status}</p>
    <p>Team: ${player.teamId ? 'Team ' + player.teamId : 'Unassigned'}</p>
    <button onclick="fetchAllPlayers().then(renderAllPlayers)">Back to all players</button>
  `;

  main.appendChild(playerElement);
};

/**
 * Fills in `<form id="new-player-form">` with the appropriate inputs and a submit button.
 * When the form is submitted, it should call `addNewPlayer`, fetch all players,
 * and then render all players to the DOM.
 */
const renderNewPlayerForm = () => {
  try {
    const formContainer = document.getElementById('new-player-form');
    formContainer.innerHTML = `
      <h2>Add New Player</h2>
      <form id="addPlayerForm">
        <label for="name">Name:</label>
        <input type="text" id="name" name="name" required>
        
        <label for="breed">Breed:</label>
        <input type="text" id="breed" name="breed" required>
        
        <label for="status">Status:</label>
        <select id="status" name="status">
          <option value="field">Field</option>
          <option value="bench">Bench</option>
        </select>
        
        <label for="imageUrl">Image URL:</label>
        <input type="url" id="imageUrl" name="imageUrl" required>
        
        <button type="submit">Add Player</button>
      </form>
    `;

    const addPlayerForm = document.getElementById('addPlayerForm');
    addPlayerForm.onsubmit = async (e) => {
      e.preventDefault();
      const newPlayer = {
        name: document.getElementById('name').value,
        breed: document.getElementById('breed').value,
        status: document.getElementById('status').value,
        imageUrl: document.getElementById('imageUrl').value,
      };

      await addNewPlayer(newPlayer);
      await fetchAllPlayers().then(renderAllPlayers);
      
      addPlayerForm.reset();
    };
  } catch (err) {
    console.error("Uh oh, trouble rendering the new player form!", err);
  }
};

/**
 * Initializes the app by fetching all players and rendering them to the DOM.
 */
const init = async () => {
  const players = await fetchAllPlayers();
  renderAllPlayers(players);

  renderNewPlayerForm();
};

// This script will be run using Node when testing, so here we're doing a quick
// check to see if we're in Node or the browser, and exporting the functions
// we want to test if we're in Node.
if (typeof window === "undefined") {
  module.exports = {
    fetchAllPlayers,
    fetchSinglePlayer,
    addNewPlayer,
    removePlayer,
    renderAllPlayers,
    renderSinglePlayer,
    renderNewPlayerForm,
  };
} else {
  init();
}
