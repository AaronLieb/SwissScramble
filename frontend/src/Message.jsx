/* eslint-disable react/prop-types */
import {
    Grid2,
    FormControl,
    Paper,
    Button,
    TextField,
} from "@mui/material";
import { enqueueSnackbar } from 'notistack';
import { useState } from 'react';




function Message(props) {

    const [eventMessage, setEventMessage] = useState("")

    async function sendMessage() {
        if (eventMessage.length === 0) {
            enqueueSnackbar("Cannot send empty message", { variant: "error", autoHideDuration: 3000 })
            return
        }
        await props.postEndpoint("/event/", JSON.stringify({
            text: eventMessage,
        }))
        setEventMessage("")
    }

    const onKeyPress = (e) => {
        if (e.key === "Enter") {
          sendMessage()
          e.preventDefault();
        }
      }
    
    return (
        <Paper sx={{ p: 2 }} elevation={props.elevation}>
        <Grid2 spacing={2} container>
            <Grid2 item size={{ xs: 12 }}>
                <FormControl sx={{ width: "100%" }} aria-label="Message">
                    <TextField onKeyDown={onKeyPress} disableAutoFocus multiline minRows={3} onChange={(d) => { setEventMessage(d.target.value) }} value={eventMessage} label="Message" />
                </FormControl>
            </Grid2>
            <Grid2 display="flex" justifyContent={"center"} item size={{ xs: 12 }}>
                <Button variant="contained" sx={{ m: 1, width: "100%" }} onClick={sendMessage} type="submit">Send Message</Button>
            </Grid2>
        </Grid2>
    </Paper>
    )
}

export default Message