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
            {Object.keys(props.teamState).map((key,idx) => (
                <div key={`score${key}-${idx}`}>
                    <Typography variant="h4" component="div" align="left" sx={{ flexGrow: 1 }}>Team {key}</Typography>
                    <LinearProgressWithLabel sx={{ height: 10, borderRadius: 5, }} key={key} variant="determinate" value={props.teamState[key].length} />
                    <Typography variant="subtitle1" align="left" sx={{ color: 'text.secondary'}}>
                        {props.teamState[key].map((c,idy) => 
                        <span style={{ color: c.name === props.canton ? 'red' : '', fontWeight: c.name === props.canton ? 'bold' : 'normal'}} key={`${c.name}-${idx}-${idy}`}> {c.name}&nbsp;
                        </span>)}
                    </Typography>
                </div>
            ))}
        </Paper>
    )
}

export default Score;