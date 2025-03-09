/* eslint-disable react/prop-types */
import {
    Paper,
    Typography,
} from "@mui/material";
import './App.css';



function About(props) {
    return (
        <>
            <Paper align="left" sx={{mt: 2, p: 3}} elevation={props.elevation}>
                <Typography variant="h2">Swiss Scramble</Typography>
                <Typography variant="body1">Race to own the most cantons by the end of three days! Teams will utilize any and all forms of public transit to visit and control the most.
                    Teams will begin each day in the same place they ended the last, each day running from 8am - 7pm. <a target="_blank" rel="noopener noreferrer" href="https://www.openstreetmap.org/#map=19/47.380725/8.539381">Players will start here.</a>
                </Typography>
                <hr/>
                <Typography variant="h3">Control</Typography>
                <Typography variant="body1">
                Cantons are worth 1 point. Leveling up a canton does not award more points, and points are not cumulative. At the end of the game, the team with the most points wins.
                </Typography>
                <ul>
                    <li>At level one, the canton provides one points towards your final score.</li>
                    <li>At level two, the canton provides passive income.</li>
                    <li>At level three, the other team must pay a tariff to travel through the canton.</li>
                </ul>
                <hr/>
                <Typography variant="h3">Decks</Typography>
                <Typography variant="h4">Challenge Deck</Typography>
                <Typography variant="body1">Each team starts with two cards in their hands. These cards represent challenges you can do to either get in game income. A new challenge card can be drawn when you enter a canton every hour, or by purchasing it through the shop.
                </Typography>
                <Typography variant="h4">Curse Deck</Typography>
                <Typography variant="body1">A curse card can be bought one at a time and randomly drawn. There is a hand limit of 3. These curses can be played at any time.
                </Typography>
                <hr/>
                <Typography variant="h3">Income</Typography>
                <Typography variant="body1">
                Passive income will be gained from controlling a canton at level two. At level three, tariffs for entering the canton will be instilled. Tariffs will increase based on the day of the game, but the amount you are paid will not increase.
                </Typography>
                <ul>
                    <li>On day one, pay 50₣.</li>
                    <li>On day two, pay 100₣.</li>
                    <li>On day three, pay 150₣.</li>
                    <li><b>Receive 50₣ any time an opponent passes through your level three cantons regardless of day.</b></li>
                </ul>
                <hr/>
                <Typography variant="h3">Duels</Typography>
                <Typography variant="body1">Duels will reside in the challenge deck. The challenging team, upon pulling a duel must do it immediately. You must announce to the other team that you are challenging them. Upon pulling the duel, the challenging team must pull off the tape the next time they are off transit. They should then tell the other team to do the duel, and give them one hour to start it.
                </Typography>
                

            </Paper>
        </>
    )
}

export default About;