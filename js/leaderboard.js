class LeaderboardManager {
	constructor(apiBaseUrl) {
		this.apiBaseUrl = apiBaseUrl || '/api';
		this.gameToken = null;
	}

	/**
	 * Inicia una partida en el servidor
	 * @returns {Promise<number|null>} Semilla de la partida, o null si falla
	 * (se puede jugar, pero la puntuación no se podrá guardar)
	 */
	async startGame() {
		this.gameToken = null;
		try {
			const response = await fetch(`${this.apiBaseUrl}/start_game.php`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();

			if (data.success) {
				this.gameToken = data.data.token;
				return data.data.seed;
			} else {
				throw new Error(data.error || 'Error al iniciar la partida');
			}
		} catch (error) {
			console.error('Error starting game:', error);
			return null;
		}
	}

	/**
	 * Obtiene el leaderboard completo desde la API
	 * @returns {Promise<Array>} Lista de puntuaciones ordenadas
	 */
	async getLeaderboard() {
		try {
			const response = await fetch(`${this.apiBaseUrl}/get_leaderboard.php`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();

			if (data.success) {
				return data.data;
			} else {
				throw new Error(data.error || 'Error al obtener el leaderboard');
			}
		} catch (error) {
			console.error('Error fetching leaderboard:', error);
			throw error;
		}
	}

	/**
	 * Guarda una nueva puntuación en el leaderboard
	 * El servidor calcula la puntuación repitiendo los movimientos de la partida
	 * @param {string} playerName - Nombre del jugador
	 * @param {string} moves - Movimientos de la partida (L, R, U, D)
	 * @returns {Promise<Object>} Información sobre la puntuación guardada
	 */
	async saveScore(playerName, moves) {
		try {
			if (!this.gameToken) {
				throw new Error('This game cannot be saved (no game session)');
			}

			const response = await fetch(`${this.apiBaseUrl}/save_score.php`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					player_name: playerName,
					game_token: this.gameToken,
					moves: moves
				})
			});

			const data = await response.json().catch(() => ({}));

			if (!response.ok && !data.error) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			if (data.success) {
				// El token es de un solo uso
				this.gameToken = null;
				return data.data;
			} else {
				throw new Error(data.error || 'Error al guardar la puntuación');
			}
		} catch (error) {
			console.error('Error saving score:', error);
			throw error;
		}
	}

	/**
	 * Verifica si una puntuación entraría en el top 10
	 * @param {number} score - Puntuación a verificar
	 * @returns {Promise<boolean>}
	 */
	async isTopScore(score) {
		try {
			const leaderboard = await this.getLeaderboard();
			if (leaderboard.length < 10) {
				return true;
			}
			const lowestTopScore = leaderboard[leaderboard.length - 1].score;
			return score > lowestTopScore;
		} catch (error) {
			console.error('Error checking top score:', error);
			return false;
		}
	}
}
const leaderboardManager = new LeaderboardManager('/api');
