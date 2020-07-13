
## Flatiron Tetris

Production URL: https://flatirontetris.herokuapp.com/

Video Demo:         https://youtu.be/OisXHjgRHpo

Server-side repo: https://github.com/CBreakr/tetris_duel_server

## Have Fun!

Tetris is a game we all grew up loving, a classic example of simplicity in design leading to complex gameplay.

This site allows users to play the classic game by themselves, or to challenge other player to real-time battles. Winning matches will improve your ranking.

Use the arrow keys to move the pieces (up arrow to rotate). The game speeds up by 1% with every piece, slowly creeping up to a rapid pace.

In one-on-one mode, matching multiple rows at once will send penalty rows to your opponent equal to the number of rows matched minus one. Plan out your attacks to maximize your chance to win. Penalty rows your opponent is sending to you will flash under the next-piece indicator.

You can also spectate on matches currently ongoing between other players. Cheer on your friends!

Sign-up, login, and have fun!

## Technical Notes

This project was built with React javascript for the front end and a Ruby on Rails backend. It uses a PostgreSQL database for storage and actioncable/websockets to facilitate real-time interaction.

## Next Step

Right now there are a lot of players who never logged out filling up the main lobby, This makes knowing who's available to challenge, well, challenging 😅

I need to differentiate active from inactive players. The idea will be to have player displays either minimized or greyed out if they haven't recorded any activity in 5 minutes.
