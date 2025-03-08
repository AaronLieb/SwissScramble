/* eslint-disable react/prop-types */
import {
    Grid2,
    FormControl,
    Chip,
    Paper,
    Snackbar,
    Button,
    Autocomplete,
    Stack,
    TextField,
    SwipeableDrawer,
    Typography,

} from "@mui/material";
import { grey } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import { useEffect, useState, useRef } from 'react';
import card from './assets/card.jpg'
import cursecard from './assets/curse.jpeg'

function Drawer(props) {

    const Puller = styled('div')(({ theme }) => ({
        width: 30,
        height: 6,
        backgroundColor: grey[300],
        borderRadius: 3,
        position: 'absolute',
        top: 8,
        left: 'calc(50% - 15px)',
        ...theme.applyStyles('dark', {
            backgroundColor: grey[900],
        }),
    }));
    const drawerBleeding = 56;
    const toggleDrawer = (newOpen) => () => {
        setDrawerOpen(newOpen);
    };
    const [drawerOpen, setDrawerOpen] = useState(true)

    return (
        <>
            <Grid2 sx={{ textAlign: 'center', pt: 1 }}>
                <Button onClick={toggleDrawer(true)}>Open</Button>
            </Grid2>
            <SwipeableDrawer
                anchor="bottom"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
                onOpen={toggleDrawer(true)}
                swipeAreaWidth={drawerBleeding}
                disableSwipeToOpen={false}
                keepMounted
            >
                <Grid2
                    sx={{
                        position: 'absolute',
                        top: -drawerBleeding,
                        borderTopLeftRadius: 8,
                        borderTopRightRadius: 8,
                        visibility: 'visible',
                        right: 0,
                        left: 0,
                    }}
                >
                    <Puller />
                    <Typography sx={{ p: 2, color: 'text.secondary' }}>51 results</Typography>
                    <Grid2 item direction={"column"}>
                    <Stack spacing={2}>
                    <Typography variant="h4" align="left">💰 {props.money}₣</Typography>
                    <Stack spacing={2} direction={"row"}>
                    <Typography variant="h4" align="left">💪 </Typography>
                    {props.curses.map(e => (
                        <Paper elevation={props.elevation} sx={{ maxWidth: "4%" }} key={e} variant="outlined">
                        <img width={"100%"} height={"100%"} src={card} />
                        </Paper>
                    ))}
                    </Stack>
                    <Stack spacing={2} direction={"row"}>
                    <Typography variant="h4" align="left">👺 </Typography>
                    {props.curses.map(e => (
                        <Paper elevation={props.elevation} sx={{ maxWidth: "4%" }} key={e} variant="outlined">
                        <img width={"100%"} height={"100%"} src={cursecard} />
                        </Paper>
                    ))}
                    </Stack>
                    </Stack>
                    </Grid2>

                </Grid2>
            </SwipeableDrawer>
        </>
    )
}

export default Drawer;