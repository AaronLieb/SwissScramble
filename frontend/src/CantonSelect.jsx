/* eslint-disable react/prop-types */
import {
    Grid2,
    FormControl,
    Autocomplete,
    TextField,
    ListItem,
    ListItemText
} from "@mui/material";

function CantonSelect(props) {

    function getTeamName(id) {
        if(props.teams && props.teams.length) {
            let item = props.teams.find(e => e.id == id)
            if(item) return item.name
        }
        if(props.canton.name) return "None"
        return ""
    }

    return (
        <>
            <Grid2 item size={{ xs: 12, lg: 6 }}>
                <FormControl sx={{ width: "100%" }} aria-label="Canton selection">
                    <Autocomplete
                        disablePortal
                        id="canton-select"
                        aria-labelledby="canton-select"
                        options={props.cantons || []}
                        value={props.canton || {}}
                        getOptionLabel={c => c.name ? `${c.name}` : ''}
                        onChange={(d, e) => {
                            props.setCanton(e || {});
                        }}
                        renderInput={(params) => (
                            <TextField {...params} label="Canton" />
                        )}
                        renderOption={({ key, ...props }, option) => (
                            <ListItem key={key.name} {...props}>
                                <ListItemText primary={option.name} />
                            </ListItem>
                        )}                        
                    />
                </FormControl>
            </Grid2>
            <Grid2 item size={{ xs: 6, lg: 3 }}>
                <FormControl sx={{ width: "100%" }} aria-label="Canton level display">
                    <TextField id="outlined-basic" label="Level" defaultValue={props.canton.level} slotProps={{ inputLabel: { shrink: true }, input: { readOnly: true } }} />
                </FormControl>
            </Grid2>
            <Grid2 item size={{ xs: 6, lg: 3 }}>
                <FormControl sx={{ width: "100%" }} aria-label="Canton level display">
                    <TextField id="outlined-basic" label="Team" defaultValue={getTeamName(props.canton.team_id)} slotProps={{ inputLabel: { shrink: true }, input: { readOnly: true } }} />
                </FormControl>
            </Grid2>
        </>
    )
}

export default CantonSelect;