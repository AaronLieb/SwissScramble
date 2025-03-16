/* eslint-disable react/prop-types */
import {
    Paper,
    List,
    ListItem,
    ListItemText,
    ListSubheader
} from "@mui/material";
import { useEffect } from 'react';

function Events(props) {
    // On any rerender, fetch events stream.
    useEffect(() => {
        props.fetchEvents()
    }, [props.updateEvents])

    function getEventEmoji(text) {
        if(text.includes("completed the challenge")) return "🏆"
        if(text.includes(" entered ")) return "🚂"
        if(text.includes(" a curse")) return "👺"
        if(text.includes("power up")) return "⚡"
        if(text.includes("paid a toll")) return "🛃"
        if(text.includes("passive income")) return "📈"
    }

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
                {props.events.sort((a,b) => Date.parse(b.time) - Date.parse(a.time)).map((item) => (
                    <ListItem key={`item-${item.id}-${item.time}`}>
                        <ListItemText primary={<b>{item.text} {getEventEmoji(item.text)}</b>} secondary={`${new Date(item.time).toLocaleString()}`} />
                    </ListItem>
                ))}
            </List>
        </Paper>
    )
}


export default Events