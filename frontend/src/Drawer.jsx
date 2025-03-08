/* eslint-disable react/prop-types */
import {
    Grid2,
    Button,
    SwipeableDrawer,
    Typography,
} from "@mui/material";
import { Global } from '@emotion/react';
import CssBaseline from '@mui/material/CssBaseline';
import { grey } from '@mui/material/colors';
import { styled } from '@mui/material/styles';

import challenge from './assets/challengesmall.png'
import curse from './assets/cursesmall.png'

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
            //backgroundColor: grey[900],
        }),
    }));
    const drawerBleeding = 56;


    // This is used only for the example
    const container = window !== undefined ? () => window.document.body : undefined;

    return (
        <>

            <CssBaseline />
            <Global
                styles={{
                    '.MuiDrawer-root > .MuiPaper-root': {
                        height: `calc(25% - ${drawerBleeding}px)`,
                        overflow: 'visible',
                    },
                }}
            />
            <SwipeableDrawer
                anchor="bottom"
                container={container}
                open={props.drawerOpen}
                onClose={props.toggleDrawer(false)}
                onOpen={props.toggleDrawer(true)}
                swipeAreaWidth={drawerBleeding}
                disableSwipeToOpen={false}
                keepMounted
            >
                <Grid2 container
                    justifyContent={"space-evenly"}
                    direction={"row"}
                    wrap='nowrap'
                    sx={{
                        p: 2,
                        top: -drawerBleeding,
                        borderTopLeftRadius: 8,
                        borderTopRightRadius: 8,
                        visibility: 'visible',
                        right: 0,
                        left: 0,
                    }}
                >
                    <Grid2 item>
                        <Puller />
                    </Grid2>
                    <Grid2 item sx={{ display: 'inline-flex', alignItems: 'baseline' }} size={{ xs: 3, md: 3 }}>
                        <Typography variant="h3">💰 {props.money}₣</Typography>
                    </Grid2>
                    <Grid2 item sx={{ display: 'inline-flex', alignItems: 'baseline' }} size={{ xs: 3, md: 3 }} spacing={2}>
                        <img height={"25%"} src={challenge} />
                        <Typography variant="h3"> {props.curses.length} </Typography>
                    </Grid2>
                    <Grid2 item sx={{ display: 'inline-flex', alignItems: 'baseline' }} size={{ xs: 3, md: 3 }} spacing={2}>
                        <img height={"25%"} src={curse} />
                        <Typography variant="h3"> {props.curses.length}</Typography>

                    </Grid2>


                </Grid2>
            </SwipeableDrawer>
        </>
    )
}

export default Drawer;