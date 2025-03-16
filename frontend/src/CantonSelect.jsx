/* eslint-disable react/prop-types */
import {
    Grid2,
    FormControl,
    Autocomplete,
    TextField,
} from "@mui/material";

function CantonSelect(props) {
    return (
        <>
            <Grid2 item size={{ xs: 9, lg: 9 }}>
                <FormControl sx={{ width: "100%" }} aria-label="Canton selection">
                    <Autocomplete
                        disablePortal
                        id="challenge-select"
                        aria-labelledby="challenge-select"
                        options={props.cantons.map(e => e.name)}
                        value={props.canton}
                        onChange={(d, e) => {
                            if (e !== null) props.setCanton(e);
                            else props.setCanton("");
                        }}
                        renderInput={(params) => (
                            <TextField {...params} label="Canton" />
                        )}
                    />
                </FormControl>
            </Grid2>
            <Grid2 item size={{ xs: 3 }}>
                <FormControl sx={{ width: "100%" }} aria-label="Canton level display">
                    <TextField id="outlined-basic" label="Level" defaultValue={props.selectedCanton.level} slotProps={{ inputLabel: { shrink: true }, input: { readOnly: true } }} />
                </FormControl>
            </Grid2>
        </>
    )
}

export default CantonSelect;