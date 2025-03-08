/* eslint-disable react/prop-types */
import {
    Grid2,
    LinearProgress,
    Paper,
    Typography,
    Box,
} from "@mui/material";


function LinearProgressWithLabel(props) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {props.value}
                </Typography>
            </Box>
        </Box>
    );
}


function Score(props) {

    return (
        <Paper sx={{ p: 2 }} elevation={props.elevation}>
            {Object.keys(props.teamState).map(key => (
                <>
                    <Typography variant="h4" component="div" align="left" sx={{ flexGrow: 1 }}>Team {key}</Typography>
                    <LinearProgressWithLabel sx={{ height: 10, borderRadius: 5, }} key={key} variant="determinate" value={props.teamState[key].length} />
                </>
            ))}
        </Paper>
    )
}

export default Score;