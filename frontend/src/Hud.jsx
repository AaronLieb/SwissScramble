import {
    Grid2,
    Typography,
    Stack,
    Paper
} from "@mui/material";
import cardIcon from './assets/card.jpg'
import curseCardIcon from './assets/curse.jpeg'

/*
  const props = {
  money: number,
  baseElevation: number,
  curseInventory: <curse>[],
  appliedCurses: <curse>[],
  powerupInventory: <powerup>[],
  appliedPowerups: <powerup>[],
  }
*/

function Hud({money, baseElevation, curses}) {
    return (
            <Grid2 item direction="row" >
                <Stack spacing={2}>
                    <Typography variant="h4" align="left">💰 {money}₣</Typography>
                    <Stack spacing={2} direction={"row"}>
                        <Typography variant="h4" align="left">💪 </Typography>
                        {curses.map(e => (
                            <Paper elevation={baseElevation + 1} sx={{ maxWidth: "4%" }} key={e} variant="outlined">
                                <img width={"100%"} height={"100%"} src={cardIcon} />
                            </Paper>
                        ))}
                    </Stack>
                    <Stack spacing={2} direction={"row"}>
                        <Typography variant="h4" align="left">👺 </Typography>
                        {curses.map(e => (
                            <Paper elevation={baseElevation + 1} sx={{ maxWidth: "4%" }} key={e} variant="outlined">
                                <img width={"100%"} height={"100%"} src={curseCardIcon} />
                            </Paper>
                        ))}
                    </Stack>
                </Stack>
            </Grid2>
    )
}

export default Hud
