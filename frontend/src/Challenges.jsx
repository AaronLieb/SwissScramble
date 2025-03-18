/* eslint-disable react/prop-types */
import {
    FormControl,
    ListItem,
    ListItemText,
    Autocomplete,
    TextField
} from "@mui/material";
import { useState } from 'react';

function Challenges(props) {

    const [challenge, setChallenge] = useState("")

    return (

                <FormControl aria-label="Challenge selection" sx={{ width: "100%" }}>
                    <Autocomplete
                        disablePortal
                        id="challenge-select"
                        aria-labelledby="challenge-select"
                        options={props.challenges || []}
                        value={challenge}
                        getOptionLabel={(option) =>
                            option ? `${option.name}` : ''
                        }
                        renderOption={({ key, ...props }, option) => (
                            <ListItem key={key} {...props}>
                                <ListItemText primary={`${option.name}`} secondary={`${option.description} (${option.levels} Levels, ${option.money} ₣)`} />
                            </ListItem>
                            )}
                        onChange={(_, newValue) => {
                            setChallenge(newValue || null)
                        }}
                        renderInput={(params) => (
                            <TextField {...params} label="Challenge" />
                        )}
                    />
                </FormControl>
    )
}

export default Challenges