#!/usr/bin/env python3
from game import TicTacToe


def input_move(ttt, player):
    while True:
        try:
            mv = int(input(f"Player {player} move (1-9): "))
            if 1 <= mv <= 9 and ttt.make_move(mv - 1, player):
                return
            print("Invalid move or occupied. Try again.")
        except ValueError:
            print("Enter a number from 1 to 9.")


def main():
    ttt = TicTacToe()
    mode = input("Play vs CPU? (y/n): ").strip().lower().startswith('y')
    current = 'X'
    ai_player = 'O' if mode else None

    while True:
        ttt.print_board()
        if mode and current == ai_player:
            print("CPU thinking...")
            mv = ttt.best_move(ai_player)
            ttt.make_move(mv, ai_player)
        else:
            input_move(ttt, current)

        w = ttt.winner()
        if w:
            ttt.print_board()
            print(f"Winner: {w}")
            break
        if ttt.is_draw():
            ttt.print_board()
            print("Draw.")
            break
        current = 'O' if current == 'X' else 'X'


if __name__ == '__main__':
    main()
