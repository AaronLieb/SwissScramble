/* eslint-disable react/prop-types */
import {
    LinearProgress,
    Paper,
    Typography,
    Box,
} from "@mui/material";
import { useEffect, useState } from "react";

var groupBy = function (xs, key) {
    return xs.reduce(function (rv, x) {
        (rv[x[key]] ??= []).push(x);
        return rv;
    }, {});
};

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
    const [score, setScore] = useState({});

    function getTeamName(id) {
        
        if(props.teams && props.teams.length) {
            let item = props.teams.find(e => e.id == id)
            if(item) return item.name
            
        }
        return "None"
    }

    useEffect(() => {

        let group = groupBy(props.cantons, 'team_id')
        // Remove keys like 'null'.
        Object.keys(group).forEach(k => (k === "null" || k === '0' || k === 0) && delete group[k])
        setScore(group)
        console.log(score)
    }, [props.cantons])

    return (
        <>
        {Object.keys(score).length > 0 && (
        <Paper sx={{ p: 2 }} elevation={props.elevation}>
            {Object.keys(score).map((key,idx) => (
                <div key={`score${key}-${idx}`}>
                    <Typography variant="h4" component="div" align="left" sx={{ flexGrow: 1 }}>{getTeamName(key)}</Typography>
                    <LinearProgressWithLabel sx={{ height: 10, borderRadius: 5, }} key={key} variant="determinate" value={score[key].length} />
                    <Typography variant="subtitle1" align="left" sx={{ color: 'text.secondary'}}>
                        {score[key].map((c,idy) => 
                        <span style={{ color: c.name === props.canton.name ? 'red' : '', fontWeight: c.name === props.canton.name ? 'bold' : 'normal'}} key={`${c.name}-${idx}-${idy}`}> {c.name}&nbsp;
                        </span>)}
                    </Typography>
                </div>
            ))}
        </Paper>
        )}
        </>
    )
}

export default Score;