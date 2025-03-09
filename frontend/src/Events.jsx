/* eslint-disable react/prop-types */
import {
    Paper,
    List,
    ListItem,
    ListItemText,
    ListSubheader
} from "@mui/material";
import { useEffect, useState } from 'react';

function Events(props) {

    const [events, setEvents] = useState([]);

    // On first load, grab the events stream.
    useEffect(() => {
        fetch(props.backend + "/events/")
            .then((response) => {
                console.log(response)
                return response.json()
            })
            .then((data) => {
                console.log(data)
                setEvents([])
            })
            .catch((err) => {
                console.log("Error fetching events " + err);
            });

    }, [])

    return (
        <Paper elevation={props.elevation}>
            <List
                sx={{
                    width: '100%',
                    bgcolor: 'background.paper',
                    position: 'relative',
                    overflow: 'auto',
                    maxHeight: 300,
                    '& ul': { padding: 0 },
                }}
                subheader={<li />}
            >
                <ListSubheader>Events</ListSubheader>
                {events.map((item) => (
                    <ListItem key={`item-${item}`}>
                        <ListItemText primary={`Item ${item}`} />
                    </ListItem>
                ))}
                {[0, 1, 2, 3, 4, 5, 6, 7].map((item) => (
                    <ListItem key={`item-${item}`}>
                        <ListItemText primary={`Item ${item}`} />
                    </ListItem>
                ))}

            </List>
        </Paper>
    )
}


export default Events