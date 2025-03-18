/* eslint-disable react/prop-types */
import {
    FormControl,
    ListItem,
    ListItemText,
    List,
    Typography
} from "@mui/material";

// Challenges is a view for un-authenticated users to see all challenges.
function Challenges(props) {
    return (
        <FormControl aria-label="Challenge selection" sx={{ width: "100%" }}>
            <Typography variant="h5">Challenges</Typography>
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
                {props.challenges.sort((a, b) => Date.parse(b.time) - Date.parse(a.time)).map((item) => (
                    <ListItem key={`chal-${item.name}`} {...props}>
                        <ListItemText primary={`${item.name}`} secondary={`${item.description} (${item.levels} Levels, ${item.money} ₣)`} />
                    </ListItem>
                ))}
            </List>

        </FormControl>
    )
}

export default Challenges