class TicTacToe:
    def __init__(self):
        self.board = [' '] * 9

    def print_board(self):
        b = self.board
        print(f" {b[0]} | {b[1]} | {b[2]} ")
        print("---+---+---")
        print(f" {b[3]} | {b[4]} | {b[5]} ")
        print("---+---+---")
        print(f" {b[6]} | {b[7]} | {b[8]} ")

    def available_moves(self):
        return [i for i, v in enumerate(self.board) if v == ' ']

    def make_move(self, pos, player):
        if 0 <= pos < 9 and self.board[pos] == ' ':
            self.board[pos] = player
            return True
        return False

    def winner(self):
        b = self.board
        lines = [
            (0, 1, 2), (3, 4, 5), (6, 7, 8),
            (0, 3, 6), (1, 4, 7), (2, 5, 8),
            (0, 4, 8), (2, 4, 6),
        ]
        for a, c, d in lines:
            if b[a] == b[c] == b[d] and b[a] != ' ':
                return b[a]
        return None

    def is_draw(self):
        return ' ' not in self.board and self.winner() is None

    def _winner_board(self, board):
        lines = [
            (0, 1, 2), (3, 4, 5), (6, 7, 8),
            (0, 3, 6), (1, 4, 7), (2, 5, 8),
            (0, 4, 8), (2, 4, 6),
        ]
        for a, c, d in lines:
            if board[a] == board[c] == board[d] and board[a] != ' ':
                return board[a]
        return None

    def best_move(self, player):
        opponent = 'O' if player == 'X' else 'X'

        def minimax(board, current):
            w = self._winner_board(board)
            if w == player:
                return 1
            if w == opponent:
                return -1
            if ' ' not in board:
                return 0
            scores = []
            for i in range(9):
                if board[i] == ' ':
                    board[i] = current
                    score = minimax(board, opponent if current == player else player)
                    scores.append(score)
                    board[i] = ' '
            return max(scores) if current == player else min(scores)

        best = None
        best_score = -2
        for i in range(9):
            if self.board[i] == ' ':
                self.board[i] = player
                score = minimax(self.board, opponent)
                self.board[i] = ' '
                if score > best_score:
                    best_score = score
                    best = i
        if best is None:
            return self.available_moves()[0]
        return best
