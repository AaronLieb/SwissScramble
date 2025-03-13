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
        let authHeaders = {
            headers: new Headers({
            'Authorization': `Bearer ${props.auth}`, 
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        })}
        fetch(props.backend + "/events/", authHeaders)
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                console.log(data)
                setEvents(data)
            })
            .catch((err) => {
                console.log("Error fetching events " + err);
            });

    }, [props.updateEvents])

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
            </List>
        </Paper>
    )
}


export default Events