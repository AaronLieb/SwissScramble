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
import { Global } from '@emotion/react';
import CssBaseline from '@mui/material/CssBaseline';
import { grey } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import { useEffect, useState, useRef } from 'react';
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
    const toggleDrawer = (newOpen) => () => {
        setDrawerOpen(newOpen);
    };
    const [drawerOpen, setDrawerOpen] = useState(true)

    // This is used only for the example
    const container = window !== undefined ? () => window.document.body : undefined;

    return (
        <>

            <CssBaseline />
            <Global
                styles={{
                    '.MuiDrawer-root > .MuiPaper-root': {
                        height: `calc(50% - ${drawerBleeding}px)`,
                        overflow: 'visible',
                    },
                }}
            />
            <Grid2 sx={{ textAlign: 'center', pt: 1 }}>
                <Button onClick={toggleDrawer(true)}>Open</Button>
            </Grid2>
            <SwipeableDrawer
                anchor="bottom"
                container={container}
                open={drawerOpen}
                onClose={toggleDrawer(false)}
                onOpen={toggleDrawer(true)}
                swipeAreaWidth={drawerBleeding}
                disableSwipeToOpen={false}
                keepMounted
            >
                <Grid2 container
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
                    <Grid2 item size={{ xs: 12, md: 3 }}>
                        <Puller />
                    </Grid2>
                    <Grid2 item size={{ xs: 12, md: 3 }}>
                        <Typography variant="h3">💰 {props.money}₣</Typography>
                    </Grid2>
                    <Grid2 item size={{ xs: 12, md: 3 }} spacing={2}>
                        <Typography variant="h3">💪 </Typography>
                        {props.curses.map(e => (
                            <>
                                <img key={e} height={"25%"} src={challenge} />
                            </>
                        ))}
                    </Grid2>
                    <Grid2 item size={{ xs: 12, md: 3 }} spacing={2}>
                        <Typography variant="h3">👺 </Typography>
                        {props.curses.map(e => (
                            <>
                                <img key={e} height={"25%"} src={curse} />
                            </>
                        ))}
                    </Grid2>


                </Grid2>
            </SwipeableDrawer>
        </>
    )
}

export default Drawer;