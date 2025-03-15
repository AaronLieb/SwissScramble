/* eslint-disable react/prop-types */
import {
    Grid2,
    SwipeableDrawer,
    Stack,
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
                    alignItems={"center"}
                    wrap='nowrap'
                    sx={{
                        p: 3,
                        top: -drawerBleeding,
                        borderTopLeftRadius: 8,
                        borderTopRightRadius: 8,
                        visibility: 'visible',
                        right: 0,
                        left: 0,
                    }}
                >
                    <Puller />
                    <Stack spacing={2} alignItems={"center"} justifyContent={"center"} direction={"row"}>
                        <Stack>
                            <Typography variant="h3" align="center">💰</Typography>
                            <Typography variant="h3" align="center">{props.team.money}₣</Typography>
                        </Stack>
                        <img height={"50%"} width={"20%"} src={challenge} />
                        <Typography variant="h3" align="center"> {props.team.challenges} </Typography>


                        <img height={"50%"} width={"20%"} src={curse} />
                        <Typography variant="h3" align="center">{props.team.curses}</Typography>

                    </Stack>
                </Grid2>
            </SwipeableDrawer>
        </>
    )
}

export default Drawer;